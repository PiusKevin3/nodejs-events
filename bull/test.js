var Queue = require('bull');

let redisOptions = {
  redis: {
    port: 6379,
    host: '127.0.0.1'
  },
  // Maximum one job is processed every 5 seconds.
  limiter: {
    max: 1,
    duration: 5000
  },
  settings: {
    backoffStrategies: {
      // Custom backoff strategy.
      myStrategy: function (attemptsMade, error) {
        return error.delay || 60 * 1000;
      }
    }
  }
};

var myQueue = new Queue('Linear-Queue', redisOptions);

myQueue.process('Type-1', function (job, done) {
  setTimeout(() => {
    // compare attemptsMade with 3, to test 'on-all-attempts-fail' scenario.
    if (job.attemptsMade == 2) {
      done(false);
    } else {
      done(job.data.error);
    }
  }, job.data.time);
});

let options = {
  attempts: 3,
  backoff: {
    type: 'myStrategy'
  },
  removeOnComplete: false, // Set to true if job has to be removed on success.
  removeOnFail: false // Set to true if job has to be removed on failure.
}

for (let i = 1; i <= 10; i++) {
  let error = false;

  if (i == 2) {
    error = true
  }

  myQueue.add('Type-1', { time: i * 1000, description: "Type-1 Job-" + i, error: error }, options);

  // You can also add job with some time gap.
  // setTimeout(i => {
  //   myQueue.add('Type-1', { time: i * 1000, description: "Type-1 Job-" + i, error: error }, options);
  // }, 1000, i);
}

myQueue.on('completed', async function (job, result) {
  console.log("Completed: Job " + job.id);
});

myQueue.on('failed', async function (job, error) {
  console.log("Failed: Job " + job.id + " on attempt " + job.attemptsMade);
  handelFailure(job);
});

myQueue.on('error', function (error) {
  console.log("Queue: on error");
  console.log(error);
});

async function handelFailure(currentJob) {
  if (currentJob.opts.attempts == currentJob.attemptsMade) {
    // Remove all jobs in queue and clan the redis.
    await myQueue.clean(70 * 1000, 'wait');
    await myQueue.clean(70 * 1000, 'active');
    await myQueue.clean(70 * 1000, 'failed');
    await myQueue.clean(70 * 1000, 'paused');
    await myQueue.clean(70 * 1000, 'delayed');
    await myQueue.empty();
    return;
  }

  let pendingJobs = await myQueue.getJobs(['waiting', 'active', 'failed', 'paused', 'delayed'], 0, -1, true);
  console.log("Failing all remaining " + pendingJobs.length + " jobs...");

  for (let i = 0; i < pendingJobs.length; i++) {
    if (pendingJobs[i].id == currentJob.id) {
      continue;
    }
    let errorInfo = {
      delay: (70 * 1000) + (i * 5 * 1000),
      message: "Moving " + pendingJobs[i].id + " to failed queue."
    }
    await pendingJobs[i].moveToFailed(errorInfo, true);
  }
}