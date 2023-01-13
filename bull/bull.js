const Queue = require("bull") ;


const queue = new Queue("myQueue",{redis: { host: "127.0.0.1", port: 6379 }});

const main = async () => {
  await queue.add({ name: "John", age: 30 });
  await queue.add({ foo: 'bar' }, { delay: 5000 });

};

queue.process((job, done) => {
  console.log(job.data);
  done();
});

main().catch(console.error);






const users = [
  { name: "John", age: 31 },
  { name: "Jane", age: 25 },
  { name: "Jim", age: 19 },
  { name: "Jill", age: 17 },
  { name: "Jack", age: 32 },
];


const controller = async () => {
  const promises = users.map((user) => queue.add(user));

  await Promise.all(promises);
};

// void controller();
// controller();
console.log(controller());

