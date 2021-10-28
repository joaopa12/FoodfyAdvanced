const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8a23d951ef7cae",
    pass: "a7353c93d139a0"
  }
});