const nodemailer = require(`nodemailer`);
const pug = require(`pug`)
const htmlToText = require(`html-to-text`);

module.exports = class Email {
  constructor(user, url) {
    this.from = `Dhruv Chauhan <${process.env.EMAIL_FROM}>`;
    this.to = user.email;
    this.firstName = user.name.split(` `)[0];
    this.url = url;
  }
  createTransport() {
    if (process.env.NODE_ENV === `production`) {
      return nodemailer.createTransport({
        service: `gmail`,
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
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
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
    await this.createTransport().sendMail(emailOptions);
  }
  async sendWelcome() {
    await this.send(`welcome`, `Welcome to the PARKकर Family!`);
  }
  async sendpasswordReset() {
    await this.send(
      `passwordReset`,
      `Your password reset token (valid for only 10 minutes).`
    );
  }
};
