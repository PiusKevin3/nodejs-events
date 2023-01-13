require("dotenv").config();
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const sgMail = require("@sendgrid/mail");

const sendEmailWithSendGrid = (emailDataFields) => {
  sgMail.setApiKey(emailDataFields.SENDGRID_API_KEY);

  const filePath = path.join(__dirname, "/defaultEmail.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);

  const htmlToSend = template(emailDataFields.customFields);

  let msg = {
    to: emailDataFields.to,
    from: emailDataFields.from,
    subject: emailDataFields.subject,
    text: emailDataFields.text,
    html: htmlToSend,
  };

  sgMail
    .send(msg)
    .then((response) => {
        console.log('email sent')
      return response;
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports = sendEmailWithSendGrid;
