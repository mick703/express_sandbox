const pr = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve(1);
    reject(new Error("Message Error"));
  }, 2000);
});

pr.then(result => console.log(result)).catch(err =>
  console.log("Error", err.message)
);

//Settled promises
const p = Promise.resolve({ id: 1 });
const p2 = Promise.reject(new Error("error"));
p.then(result => console.log(result));

p2.catch(error => console.log(error));

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("Async operation 3...");
    // reject(new Error("3 failed"));
    resolve(3);
  }, 2000);
});

const p4 = new Promise(resolve => {
  setTimeout(() => {
    console.log("Async operation 4...");
    resolve(4);
  }, 2000);
});
//As soon as the first one resolved, resolve return the first result
Promise.race([p3, p4])
  .then(result => console.log(result))
  .catch(error => console.log(error));

//Run in parallel, resolve returns an array of result
Promise.all([p3, p4])
  .then(result => console.log(result))
  .catch(error => console.log(error));

const p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("Async operation 5...");
    reject(new Error("5 failed"));
  }, 2000);
});

//One of them fails, the whole operation fails
Promise.all([p3, p4, p5])
  .then(result => console.log(result))
  .catch(error => console.log(error));

//Async and Await
function getUserById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Doing async operation getUser....");
      resolve({ id: 123, username: "Tom" });
    }, 2000);
  });
}
function getRepoByUsername(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Doing async operation getRepoByUsername....");
      reject(new Error("Failed getting repo by username"));
    }, 2000);
  });
}

async function handleUser(id) {
  //Handle errors by catch
  try {
    const user = await getUserById(id);
    const repo = await getRepoByUsername(user.username);
    console.log("User is ", user);
  } catch (error) {
    console.log(error);
  }
}

handleUser(123);
