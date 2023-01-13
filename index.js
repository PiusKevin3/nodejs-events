require("dotenv").config();
/*
const NotificationPubSub = require("./pubSub");
const pubSub = new NotificationPubSub();
const emailDataFields = require("./nodemailer/emailData");


  pubSub.subscribe("USER_CREATED_SEND_WELCOME_EMAIL_WITH_NODEMAILER");
  pubSub.publish(
    "USER_CREATED_SEND_WELCOME_EMAIL_WITH_NODEMAILER",
    emailDataFields
  );

*/
const test=(data)=>{
  console.log('Am working well',data)
}
const bullRedisMessageQueuer = require('./bullRedis')
bullRedisMessageQueuer.jobProducer('USER_CREATED',{name:'pius'},1000)
bullRedisMessageQueuer.jobConsumer('USER_CREATED',(data)=>test(data))


// bullRedisMessageQueuer.jobProducer('RESET_PASSWORD',{name:'KEVIN'},5000)
// bullRedisMessageQueuer.jobConsumer('RESET_PASSWORD')

