const emailDataFields = {
    from: process.env.SENDER_EMAIL,
    senderPassword:process.env.EMAIL_NOTIFICATION_PASSWORD,
    to: process.env.RECEIVER_EMAIL,
    subject: "Welcome Onboard",
    text: '',
    customFields:{
      username: "piuskevin3",
    },
    SENDGRID_API_KEY:process.env.SENDGRID_API_KEY
    
    };

 module.exports =emailDataFields