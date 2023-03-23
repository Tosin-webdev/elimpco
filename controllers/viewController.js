const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signup = (req, res) => {
  // console.log('cool');
  res.status(200).render('signup', {
    title: 'All Tours',
  });
};

exports.getOverview = async (req, res) => {
  // Get tour data from collection
  const tours = await Tour.find();

  // render the template
  res.status(200).render('index', {
    title: 'All Tours',
    tours,
  });
};

exports.signin = (req, res) => {
  // render the template
  res.status(200).render('signin', {
    title: 'All Tours',
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  // // Get the data, for the requested tour including reviews and guides
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // console.log(tour);
  res.status(200).render('tour', {
    title: 'The forest Hiker Tour',
    tour,
  });
});

exports.errorPage = (req, res) => {
  res.status(404).render('404');
};

exports.getMe = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('profile', {
    title: 'Profile page',
    user: updatedUser,
  });
};
// exports.updateUserData = async (req, res) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   res.status(200).render('profile', {
//     title: 'Your account',
//     user: updatedUser,
//   });
// };
