const nodemailer = require('nodemailer');
const ejs = require('ejs');
const catchAsync = require('./catchAsync');

new Email(user, url).sendWelcome();
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `oladeji Tosin <${process.env.EMAIL_FROM}>`;
  }
  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  send(template, subject) {
    // send the actual email
    //1) Render HTML based on ejs template
    const html = ejs.renderFile(`${__dirname}/../views/emails/${template}.pug`);

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: options.message,
    };
  }

  sendWelcome() {
    this.send('Welcome', 'Welcome to elimpco');
  }
};

const sendEmail = catchAsync(async (options) => {
  // 1) Create a transporter(an object that is able to send mail)
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,

  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

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

// module.exports = sendEmail;
