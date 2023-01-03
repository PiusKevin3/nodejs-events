const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const nodeMailer = require("nodemailer");

const sendEmail = (emailDataFields) => {
  const structureMailOption = (transporter) => {
    const filePath = path.join(__dirname, "/defaultEmail.html");
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);

    const htmlToSend = template(emailDataFields.customFields);

    let mailOption = {
      from: emailDataFields.from,
      to: emailDataFields.to,
      subject: emailDataFields.subject,
      text: emailDataFields.text,
      html: htmlToSend,
    };

    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        return err;
      } else {
        return nodeMailer.getTestMessageUrl(info);
      }
    });
  };

  const createTransporter = () => {
    //creating smtp object
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: emailDataFields.from,
        pass: emailDataFields.senderPassword, //   pass: "your pass password"
      },
    });
    structureMailOption(transporter);
  };

  return createTransporter();
};

module.exports = sendEmail;
