const Queue = require('bull');
const redisConfig = { host: '127.0.0.1', port: 6379 };

const queue = new Queue('example', redisConfig);

queue.add({ example: 'data' });
// queue.add({ example: 'data' }, { delay: 5000 });


queue.process(async (job) => {
  try{
      console.log(job.data);

  }catch(err){
     throw err;
  }
}).catch((err) => {
  // retry the job after 10 seconds
  return new Promise((resolve) => setTimeout(resolve, 10000));
});


/** Number of jobs processed simulteneously
 * queue.process(2, async (job) => {
  console.log(job.data);
});
 */
/**
queue.pause();
queue.resume();
queue.empty();
queue.clean();
queue.close();

 * 
 */
