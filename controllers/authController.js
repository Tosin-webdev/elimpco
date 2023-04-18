const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const Email = require('../utils/email');

// A function to create a JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    // sends the cookie when using a secured connection(HTTPS)
    // secure: true,
    // Ensures the cookie can not be access or modified by the
    // browser(to prevent cross site scripting attack)
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookingOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // remove password from output
  user.password = undefined;
  // sends response to client
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // create a new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // const url = `${req.protocol}://${req.get('host')}/me`;
  // // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
  // create a token
});

exports.login = catchAsync(async (req, res, next) => {
  // Access email and password from the request body
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  // 2) Check if user exists

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Incorrect email or password', 401));
  }

  console.log(user.password);

  // checks if user password is correc                                                                                            t
  const correct = await user.correctPassword(password, user.password);
  if (!correct) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything is okay, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  // res.cookie('jwt', 'loggedOut', {
  //   expires: new Date(Date.now() * 10 * 1000),
  //   httpOnly: true,
  // });
  res.cookie('jwt', '', { maxAge: 1, httpOnly: true });
  res.status(200).json({ status: 'success' });
};

// exports.logout = (req, res) => {
//   res.cookie('jwt', '', { maxAge: 1 });
//   // res.status(200).json({ status: 'success' });
//   res.redirect('/signin');
// };

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if its there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401));
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // res.send(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this email does not exist', 401));
  }

  // 4) Check if user changed password after the JWT
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! please log in again.', 401));
  }

  // Grant Access to protected route
  req.user = currentUser;

  next();
});

// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       // 1) verify token
//       const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

//       // 2) Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

//       // 3) Check if user changed password after the token was issued
//       if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next();
//       }

//       // THERE IS A LOGGED IN USER
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       res.locals.user = null;
//       return next();
//     }
//   }
//   next();
// };

exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// Perfoming authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    // roles ['admin', 'lead-guide']
    // checks if the user role is not an 'admin' or 'lead-guide'
    // if its not then send the error
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  // console.log(user);
  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  // save to the database and deactivate the values set to
  // our schema
  await user.save({ validateBeforeSave: false });
  // console.log(resetToken);

  // 3) send it to the user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
  try {
    const message = `Forgot your password? Submit this link: ${resetUrl}.\n If you did not request this, please ignore this email and your password will remain unchanged.`;
    // console.log(message);
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  // find the user by its hashed token
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

  console.log(user);
  // if token has expired or invalid token
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 404));
  }
  //  If the token has not expired, and there is user, set
  // the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Log the user in, send JWT
  createSendToken(user, 200, res);
  // Update passwordChangedAt property
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  console.log(user);
  // Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // If so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // Log user in, send JWT
  // res.send('sent');
  createSendToken(user, 200, res);
});
