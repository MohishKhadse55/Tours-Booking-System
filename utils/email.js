const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Mohish Khadse <${process.env.EMAIL_FROM}>  `;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production ') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      }); // in node mailer ther are some predefined servives like gmail and sendgrid
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: false,

      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1 Render HTML based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // 2 define email options
    const mailOption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };
    console.log('before  new Transport');
    // 3 create transport ad send email
    await this.newTransport().sendMail(mailOption);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family ');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid only for 10 min)'
    );
  }
};
