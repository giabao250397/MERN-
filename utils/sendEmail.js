require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const sendEmail = (receiver, source, subject, content) => {
  try {
    const data = {
      to: receiver,
      from: source,
      subject,
      html: content,
    };
    return sgMail.send(data);
  } catch (err) {
    return new Error(err);
  }
};

module.exports = sendEmail;
