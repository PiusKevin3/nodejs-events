const Queue = require("bull");
const redisConfig = { host: "127.0.0.1", port: 6379 };

class BullRedisMessageQueuer {
  /**
   * Execute a job producer to a job name
   */
  jobProducer(queueJobItemName, data, delayTime) {
    const queue = new Queue(queueJobItemName, redisConfig);
    queue.add(data, { delay: delayTime });
  }

  /**
   * Execute a job consumer to a job name
   */
  jobConsumer(queueJobItemName, callback) {
    const queue = new Queue(queueJobItemName, redisConfig);
    queue
      .process(async (job) => {
        try {
          callback(job.data);
        } catch (err) {
          throw err;
        }
      })
      .catch((err) => {
        // retry the job after 10 seconds
        return new Promise((resolve) => setTimeout(resolve, 10000));
      });
  }
}

module.exports = new BullRedisMessageQueuer();
