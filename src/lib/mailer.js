const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "bd3795958daf43",
      pass: "73215abc3a0efb"
    }
  });