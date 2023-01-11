const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const sendEmail = catchAsync(async (options) => {
  // 1) Create a transporter(an object that is able to send mail)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,

    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //   2) Define the email options
  const mailOptions = {
    from: 'oladeji Tosin <oladejit3@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message,
    // html: options.html, // html body
  };

  //  3) Actually send the email
  await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;
