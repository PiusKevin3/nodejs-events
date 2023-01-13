const EventEmitter = require("events");
const sendEmail = require("../nodemailer/realEmailAccount");
const sendEmailWithSendGrid = require("../sendGrid/index");

/**Publisher Subscriber Design Pattern */

class NotificationPubSub extends EventEmitter {
  /**
   * Subscribe and execute a callback to an event name
   */
  subscribe(eventName) {
    switch (eventName) {
      case "USER_CREATED_SEND_WELCOME_EMAIL_WITH_NODEMAILER":
        this.on(eventName, async (emailDataFields) => {
         await sendEmail(emailDataFields);
        });
        break;
      case "USER_CREATED_SEND_WELCOME_EMAIL_WITH_SENDGRID":
        this.on(eventName, async (emailDataFields) => {
            await sendEmailWithSendGrid(emailDataFields);
            
         });
        break;  
      case "SEND_SMS":
        this.on(eventName, (data) => {
          console.log("Handle SMS notification...", data);
        });
        break;

      default:
        return this.on(eventName, (data) => {
          console.log("Handle default event notification...",data);
        });
    }
  }

  /**
   * Execute a callback to an event name
   */
  publish(eventName, data) {
    this.emit(eventName, data);
  }

  /**
   * Remove a previously added callback
   */
  unsubscribe(eventName, callback) {}
}

module.exports = NotificationPubSub;
