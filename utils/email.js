const nodemailer = require('nodemailer');
const ejs = require('ejs');
const catchAsync = require('./catchAsync');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome();
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

  async send(template, subject) {
    // send the actual email
    //1) Render HTML based on ejs template
    const html = ejs.renderFile(`${__dirname}/../views/email/${template}.ejs`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    //3) Create a transport
    await this.newTransport().sendEmail(mailOptions);
  }

  async sendWelcome() {
    this.send('Welcome', 'Welcome to elimpco');
  }
};
