const EventEmitter = require("events");
const sendEmail = require("../nodemailer/realEmailAccount");
/**Publisher Subscriber Design Pattern */

class NotificationPubSub extends EventEmitter {
  /**
   * Subscribe and execute a callback to an event name
   */
  subscribe(eventName) {
    switch (eventName) {
      case "USER_CREATED_SEND_WELCOME_EMAIL":
        this.on(eventName, async (emailDataFields) => {
          await sendEmail(emailDataFields);
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
