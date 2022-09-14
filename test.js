// const wait = function (seconds) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// function myAPICall() {
//   // simulate 1 second wait time
//   return wait(1).then(() => console.log('I waited for 1 seconds'));
// }

// const a = myAPICall();
// console.log(a, 'mohish');

// // wait(1).then(() => 'success');

// // wait(1).then(() => {
// //   console.log('I waited for 1 seconds');
// // });
// // console.log(wait(1).then(() => 'success'));

// // wait(1)
// //   .then(() => {
// //     console.log('I waited for 1 seconds');
// //     return wait(1);
// //   })
// //   .then(() => {
// //     console.log('I waited for 2 seconds');
// //     return wait(1);
// //   })
// //   .then(() => {
// //     console.log('I waited for 3 seconds');
// //     return wait(1);
// //   })
// //   .then(() => {
// //     console.log('I waited for 4 seconds');
// //     return wait(1);
// //   })
// //   .then(() => {
// //     console.log('I waited for 5 seconds');
// //     return wait(1);
// //   });

const timeout = (seconds) =>
  new Promise((res) => setTimeout(res, seconds * 1000));

function myAPICall() {
  // simulate 1 second wait time
  return timeout(1).then(() => 'success');
}

async function myAsyncFunction() {
  try {
    console.log('starting');

    // just starting the API call and storing the promise for now. not waiting yet
    let dataP = myAPICall();

    let result = 2 + 2;

    // Executes right away
    console.log('result', result);

    // wait now
    let data = await dataP;

    // Executes after one second
    console.log('data', data);

    return data;
  } catch (ex) {
    return ex;
  }
}

myAsyncFunction();

console.log('chut mari ch ');
