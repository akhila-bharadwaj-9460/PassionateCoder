"use strict";

// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-01-18T21:31:17.178Z",
    "2021-02-23T07:42:02.383Z",
    "2021-05-28T09:15:04.904Z",
    "2021-06-01T10:17:24.185Z",
    "2021-06-08T14:11:59.604Z",
    "2022-01-26T17:01:17.194Z",
    "2022-01-28T23:36:17.929Z",
    "2022-02-03T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "En-IN", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

// const displayDate = function (currDate) {
//   // we need to display it in 03/02/2022 format
//   const date = `${currDate.getDate()}`.padStart(2, 0);
//   const month = `${currDate.getMonth() + 1}`.padStart(2, 0); // zero based
//   const year = currDate.getFullYear();

//   return `${date}/${month}/${year}`;
// };

const formattedCurrency = function (amt) {
  return Intl.NumberFormat(currentAccount.locale, {
    style: "currency", // currency/units/percent
    currency: currentAccount.currency,
  }).format(amt);
};

// DISPLAY MOVEMENTS DATES
const displayMovementDates = function (recDate) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), new Date(recDate));
  if (daysPassed === 0) {
    return "TODAY";
  } else if (daysPassed === 1) {
    return "YESTERDAY";
  } else if (daysPassed <= 7) {
    return `${daysPassed} DAYS AGO`;
  } else {
    // return displayDate(new Date(recDate));
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return Intl.DateTimeFormat(currentAccount.locale, options).format(recDate);
  }
};

// DISPLAY MOVEMENTS
const displayMovements = function (acc, state = false) {
  // need to empty the containerMovements before adding new data
  containerMovements.innerHTML = "";

  const movs = state
    ? acc.movements.slice().sort((a, b) => b - a)
    : acc.movements;

  // movements is array containing deposits and withdrawals
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const currDate = displayMovementDates(new Date(acc.movementsDates[i]));

    // console.log(currDate);
    const html = `<div class="movements">
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } deposit</div>
      <div class="movements__date">${currDate}</div>
      <div class="movements__value">${formattedCurrency(mov)}</div>
    </div>
    `;
    // movements should have only 2 precisions , that is achieved by toFixed()
    //innerAdjacentHTML ---> is used to display the elements in a container next to one another.

    // afterbegin --> this will append the new child on top of the other child, last one to enter will be first one to be displayed
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const createUsernames = function (accs) {
  // loop over each account in a array and create username property in the account which will be a combination of first characters of their names (firstname middle lastname)

  accs.forEach((acc) => {
    acc.username = acc.owner
      .split(" ")
      .map((namee) => {
        return namee.toLowerCase()[0];
      })
      .join("");
  });
};

createUsernames(accounts); // array of all the accounts

const calcBalance = function (acc) {
  acc.balance = acc.movements.reduce((accu, curr) => accu + curr);
  labelBalance.textContent = `${formattedCurrency(acc.balance)}`;
};
// calcBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((accu, mov) => accu + mov, 0);
  labelSumIn.textContent = `${formattedCurrency(incomes)}`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((accu, mov) => accu + mov, 0);
  labelSumOut.textContent = `${formattedCurrency(Math.abs(out))}`;

  // 1.2 interest on the deposits and we need to include only those interest which is above 1euro
  // calculating interest based on the interest rate give to each account
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((accu, int) => accu + int, 0)
    .toFixed(2);
  labelSumInterest.textContent = formattedCurrency(interest);
};
// calcDisplaySummary(account1.movements);

let currentAccount, timer;

const updateUI = function (acc) {
  // display movements
  displayMovements(acc);
  // display Balance
  calcBalance(acc);
  // display summary
  calcDisplaySummary(acc);
  // reset timer
  // timer must also user to logout only during the inactivity of certain amount of time.
  clearInterval(timer);
  timer = setLogoutTimer();
};

// FAKE LOGIN -->
// currentAccount = account1;
// containerApp.style.opacity = 100;
// updateUI(currentAccount);

// LOGOUT TIMER
const setLogoutTimer = function () {
  // calculate how much mins you need in seconds --> 5mins
  let time = 20; // 5*60

  // set the interval for every one second,1000->millisecond
  timer = setInterval(() => {
    let mins = `${Math.trunc(time / 60)}`; // will gives us mins
    let secs = `${Math.abs(time % 60)}`; // will give use seconds
    // display the timer
    labelTimer.textContent = `${mins.padStart(2, 0)}:${secs.padStart(2, 0)}`;

    // log out once the timer is 0min and 0sec
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // decrease the time by 1 sec
    time--;
  }, 1000);

  // returning timer because we dont want the timers between different accounts to crash
  // if the previous timer exists we will clear it

  return timer;
};

// LOGIN
btnLogin.addEventListener("click", function (e) {
  // each time the button is clicked the document is reloaded, we need to prevent that from happening
  e.preventDefault();
  // get the currentAccount from the username
  currentAccount = accounts.find(
    (acc) => inputLoginUsername.value === acc.username
  );

  // SET CURRENT DATE and TIME
  // const now = new Date();
  // const hours = `${now.getHours()}`.padStart(2, 0);
  // const mins = `${now.getMinutes()}`.padStart(2, 0);

  // labelDate.textContent = `${displayDate(now)}, ${hours}:${mins}`;

  // USING INTERNATIONAL DATE FORMATTING BASED OF COUNTRY
  const now = new Date();
  // we need to pass the country locale --> 'en-US' something like this, so we can format it according to the country.

  // labelDate.textContent = new Intl.DateTimeFormat("en-US").format(now);

  // we can also pass the options in the form of object
  // "full","long","medium","short"
  const options = {
    day: "2-digit", // or 'numeric',
    hour: "numeric",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
    // weekday: "short", //"long",
  };
  // Kannada
  // labelDate.textContent = new Intl.DateTimeFormat("kn-IN", options).format(now);

  // // getting locale from system
  // const locale = navigator.language; // 'en-GB'
  // labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

  // // using locale of account
  const locale = navigator.language; // 'en-GB'
  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  // check if the credentials entered is correct
  // if ever the user does not exist currentAccount will be pointing to undefined, to avoid getting error we use optional chaining
  if (currentAccount?.pin === +inputLoginPin.value) {
    // after login we need to set the opacity of to app to 100
    containerApp.style.opacity = 100;

    // clear input fields and remove focus from them
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

    // display welcome message by using first name
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }!`;

    // updatingUI
    updateUI(currentAccount);
  }

  // as soon as we login the logout timer should start
  // if previously the timer exists then we need to clear it and then continue, so that the timers of different accounts dont crash

  if (timer) clearInterval(timer);
  timer = setLogoutTimer();
});

// Transfering amount
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  // Number can be replaced by +, them immediately string will be converted to Number
  // const transferAmount = Number(inputTransferAmount.value);
  const transferAmount = +inputTransferAmount.value;
  const receiveracc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // clearing input fields
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();

  // we need to check if receiveracc is avaible and not undefined
  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    receiveracc &&
    receiveracc.username !== currentAccount.username
  ) {
    // we need debit the transferAmount from the current acount and add it to the receiverAccount
    currentAccount.movements.push(-transferAmount);
    receiveracc.movements.push(transferAmount);

    currentAccount.movementsDates.push(new Date());
    receiveracc.movementsDates.push(new Date());

    // updating UI with updated balance and movements
    updateUI(currentAccount);
  }
});

// closing account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("haiiiiii");

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //  deleting the account from the accounts array
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    // close the UI by setting the opacity back to 0
    containerApp.style.opacity = 0;
  }
});

// request loan
// request loan is accepted only if any of the positive transaction is done that is any one deposit which is atleast 10% of the loan amount only then the loan will be sanctioned
// loan can be given only for integer value, so no decimal points will be included, so we make use of floor()

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  // check if amount is greater than 0
  if (
    +inputLoanAmount.value > 0 &&
    currentAccount.movements.some((mov) => mov >= inputLoanAmount.value * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(Math.floor(inputLoanAmount.value));
      currentAccount.movementsDates.push(new Date());
      inputLoanAmount.value = "";
      updateUI(currentAccount);
    }, 5000);
  }
});

// sort button
let state = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !state);
  state = !state;
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // map() method ---> this will return a new array , it will take an iterable and a callback function, which in turn will be called for each and every array element.

// const eurToUSD = 1.1;
// const movementUSD = movements.map(function (mov) {
//   return mov * eurToUSD;
// });
// console.log(movementUSD);

// // using array
// const movementsUSDarr = movements.map((mov) => mov * eurToUSD);
// console.log(movementsUSDarr);

// // map method can also produce index along with values like forEach()

// const movementDescription = movementsUSDarr.map(function (mov, i, arr) {
//   return `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"} ${mov}`;
// });

// console.log(movementDescription);

// // CODING CHALLENGE 1
// /*
// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
// 4. Run the function for both test datasets
// HINT: Use tools from all lectures in this section so far 😉
// TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// GOOD LUCK 😀
// */

// const checkDogs = function (dogsJulia, dogsKate) {
//   // 1.
//   // let dogsJuliaCopy =  dogsJulia.splice(); // [...dogsJulia]
//   let dogsJuliaCopy = dogsJulia.slice(1);
//   dogsJuliaCopy.splice(-2); // removing last 2

//   console.log(dogsJuliaCopy);
//   // 2.
//   const totalDogs = dogsJuliaCopy.concat(dogsKate); // [...dogsJuliaCopy, ...dogsKate]
//   console.log(totalDogs);

//   // 3.
//   totalDogs.forEach(function (dogYears, i) {
//     if (dogYears >= 3) {
//       console.log(
//         `dogYears number ${i + 1} is an adult, and is ${dogYears} years old`
//       );
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`);
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // FILTER METHOD
// // filter will always take a function which will return true or false , if the returned value is true only then it will be a part of the filtered collection
// const deposits = movements.filter(function (mov, i, arr) {
//   return mov > 0;
// });
// console.log(deposits);

// const withdrawals = movements.filter((mov) => mov < 0);
// console.log(withdrawals);

// // REDUCE METHOD
// // this method will reduce a collection into one single value. it will have a accumulator which will accumulate value in each iteration and return a single value as output
// // we also need to specify the initial value of the accumulator
// // syntax --> arr.reduce(function(accumulator,curr,i,arr){}, initailValueOfAccumulator)

// const balance = movements.reduce(function (accu, curr, i, arr) {
//   return accu + curr;
// }, 0);
// console.log(balance);

// const balance2 = movements.reduce((accu, curr) => accu + curr);
// console.log(balance2);

// const maximum = movements.reduce(function (acc, curr) {
//   acc = acc < curr ? curr : acc;
//   return acc;
// }, movements[0]);
// console.log(maximum);

// const max = movements.reduce(
//   (acc, curr) => (acc < curr ? curr : acc),
//   movements[0]
// );
// console.log(max);

// // CODING CHALLENGE 2

// /*
// Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
// 2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets
// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
// GOOD LUCK 😀
// */

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map((dogAge) =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );

//   const humanAgesAbove18 = humanAges.filter((age) => age >= 18);

//   const avgHumanAge =
//     humanAgesAbove18.reduce((accu, curr) => accu + curr, 0) /
//     humanAgesAbove18.length;
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// FIND METHOD
// this method is just like filter, but it will return only one element that is encountered first which is actually satisfying the condition first

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(function (mov) {
//   return mov < 0;
// });
// console.log(firstWithdrawal); //-400

// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// console.log(account);

// // SOME METHOD()
// // This will return true if anyone of the value in the array is actually statisfying the condition or else false.
// arr = [10, 20, 30, 40];
// arr.some((val) => val % 3 === 0); //true
// arr.some((val) => val % 11 === 0); //false

// // EVERY METHOD ()
// // This will return true if all the values in the array are statisfying the condition or else it returns false
// arr.every((val) => val % 3 === 0); //false
// arr.every((val) => val % 10 === 0); //true

// // FLAT METHOD()
// // this is a array method which is used to flatten the array by merging all the nested collection into one single array, we can decide the depth of flattening, default falttening will be 1.

// const arr = [10, 20, [1, 2, 3, [4, 5]], 8, 9, [7, 8, [30, 50]]];
// console.log(arr.flat()); // arr.flat(1) --> [10, 20, 1, 2, 3, Array(2), 8, 9, 7, 8, Array(2)]

// console.log(arr.flat(2)); //[10, 20, 1, 2, 3, 4, 5, 8, 9, 7, 8, 30, 50]

// // FlatMap method ()
// // its a combination of flat() and map() together, but the depth of flattening will be 1, and the depth cannot be changed

// const allAccTotalBal = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((accu, mov) => accu + mov, 0);
// console.log(allAccTotalBal); //17840

// // samething can be achieved by flatMap()
// const allAccTotalBal2 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((accu, mov) => accu + mov, 0);
// console.log(allAccTotalBal2); // 17840

// // SORT METHOD()
// // this method will always sort in ascending order by default, works for both strings and arrays
// // ascending order --> a>b returns a positive value, a<b --> returns a negative value
// // descending order --> a<b returns a positive value, a>b --> returns a negative value

// const movements1 = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // ascending order
// // movements1.sort();

// // movements1.sort(function (a, b) {
// //   if (a > b) {
// //     return 1;
// //   } else if (a < b) {
// //     return -1;
// //   }
// // });

// movements1.sort((a, b) => a - b); // if a>b then a-b will return a +ve value, else a negative value

// console.log(movements1);

// // descending order

// const movements2 = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // movements2.sort(function (a, b) {
// //   if (a > b) {
// //     return -1;
// //   } else if (a < b) {
// //     return 1;
// //   }
// // });

// movements2.sort((a,b)=>b-a)// if b-a will return a +ve value, else a negative value
// console.log(movements2);

// DIFFERENT DATA! Contains movement dates, currency and locale

// // DATE

// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,

//   movementsDates: [
//     "2019-11-18T21:31:17.178Z",
//     "2019-12-23T07:42:02.383Z",
//     "2020-01-28T09:15:04.904Z",
//     "2020-04-01T10:17:24.185Z",
//     "2020-05-08T14:11:59.604Z",
//     "2020-07-26T17:01:17.194Z",
//     "2020-07-28T23:36:17.929Z",
//     "2020-08-01T10:51:36.790Z",
//   ],
//   currency: "EUR",
//   locale: "pt-PT", // de-DE
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,

//   movementsDates: [
//     "2019-11-01T13:15:33.035Z",
//     "2019-11-30T09:48:16.867Z",
//     "2019-12-25T06:04:23.907Z",
//     "2020-01-25T14:18:46.235Z",
//     "2020-02-05T16:33:06.386Z",
//     "2020-04-10T14:43:26.374Z",
//     "2020-06-25T18:49:59.371Z",
//     "2020-07-26T12:01:20.894Z",
//   ],
//   currency: "USD",
//   locale: "en-US",
// };

// const accounts = [account1, account2];

// // DATES
// //  the usual format of date is --> yyyy mm dd hh mm ss
// const now = new Date();
// console.log(now);
// // months and days are zero based 0-> jan, 11->dec
// const future = new Date(2037, 7, 17, 22, 45, 27);
// console.log(future);

// console.log(future.getDate()); // date--> 17
// console.log(future.getDay()); // day --> 1 , 0-->sun, 1-->mon
// console.log(future.getFullYear()); // year--> 2037
// console.log(future.getMonth()); // mon--> 7-->aug
// console.log(future.getHours()); // hours--> 22
// console.log(future.getMinutes()); // mins--> 45
// console.log(future.getSeconds()); // secs--> 27
// console.log(future.getTime()); //2134142127000
// console.log(new Date(2134142127000)); // returns a timestamp
// // Mon Aug 17 2037 22:45:27 GMT+0530 (India Standard Time)

// console.log(Date.now()); // 1643889699440---> it wii return a timestamp , which is milliseconds calculated from 1st jan 1970
// console.log(new Date(1643889699440));
// // Thu Feb 03 2022 17:31:39 GMT+0530 (India Standard Time)

// console.log(future.toDateString()); //Mon Aug 17 2037
// console.log(future.toISOString()); //2037-08-17T17:15:27.000Z

// console.log(future);
// future.setDate(8);
// future.setFullYear(2022);
// future.setMonth(8);
// future.setHours(24);
// future.setMinutes(0);
// future.setSeconds(0);
// console.log(future);

// SET TIMEOUT FUNCTION
// this function will take a call back function which will execute it in future after the wait for specified time is done, the waiting time will be sent as the 2nd arg and the time should be in millieseconds.
// syntax : setTimeout(function(arg1,arg2,...,argN){} , wait(in ms), arg1,arg2,...,argN)

// setTimeout(() => console.log(`here's your pizza`), 5000); // logs after 5secs.

// setTimeout(
//   (ing1, ing2) => console.log(`here's your pizza with ${ing1},${ing2}`),
//   5000,
//   "jalepeno",
//   "capsicum"
// ); // logs after 5secs with args

// // if ever we want to cancel the timer
// const Ingredients = ["olives", "tomato", "capsicum", "jalepeno"];
// const pizzaTimer = setTimeout(
//   (...ings) => console.log(`here's your pizza with ${ings}`),
//   5000,
//   ...Ingredients
// );
// if (Ingredients.includes("spinach")) {
//   clearTimeout(pizzaTimer);
// }
// setTimeout will be executed only onece

// SET INTERVAL
// setInterval function will execute the function n number of times after waiting of certain amount of time
// setInterval(() => {
//   console.log(new Date());
// }, 1000);
// every one second this function will be executed.

// console.log(time);
// console.log(new Date().getSeconds());

// timestamp = new Date().getTime();
// 1643969443029;
// currDate(timestamp - 1000);

// currentAccount = account1;
// currDate.setMinutes(5, 0);
