const EventEmitter = require('events')

/**Observer Design Pattern */
class Notification extends EventEmitter {

    constructor() {
        this.observers = [];
      }
    
      subscribe(func) { //Join channel
        this.observers.push(func);
      }
    
      unsubscribe(func) { //Leave channel
        this.observers = this.observers.filter(observer => observer !== func);
      }
    
      notify(data) { //Receive Notification function
        this.observers.forEach(observer => observer(data));
      }
    
}

module.exports = Notification;
