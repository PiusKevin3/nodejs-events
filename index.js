require('dotenv').config();
const NotificationPubSub = require('./pubSub')
const pubSub = new NotificationPubSub() 
const emailDataFields = require('./nodemailer/emailData')

pubSub.subscribe('USER_CREATED_SEND_WELCOME_EMAIL')
pubSub.publish('USER_CREATED_SEND_WELCOME_EMAIL',emailDataFields)   
