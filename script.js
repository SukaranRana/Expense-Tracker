"use strict";
// Variables
let transactionsArray = [];
let indexOfElementToBeEdited = -1;
let dateOfElementToBeEdited = Date.now();
// Start Page elements
const startBtn = document.querySelector(".start");
const startInput = document.getElementById("name");
const startMenu = document.querySelector(".container-1");
//Main menu elements
const mainMenu = document.querySelector(".container-2");
const username = document.querySelector(".username");
const totalBalance = document.querySelector(".totalBalance");
const incomeBalance = document.querySelector(".incomeBalance");
const expenseBalance = document.querySelector(".expenseBalance");
const openModalBtn = document.querySelector(".add");
const delBtn = document.querySelector(".delete");
const searchBtn = document.querySelector(".search");
const editBtn = document.querySelector(".edit");
const saveBtn = document.querySelector(".save-btn");
const sortBtn = document.querySelector(".sort");
const tickBtn = document.querySelector(".tick");
const profileBtn = document.querySelector(".fa-user-ninja");
// Modal elements
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const addBtn = document.querySelector(".btn");

// Functions
const init = () => {
  checkUser();
  loadMainMenu();
};

const createUser = (user) => {
  localStorage.setItem("user", JSON.stringify(formatTextToCapitalize(user)));
  checkUser();
  username.textContent = localStorage
    .getItem("user")
    .slice(1, localStorage.getItem("user").length - 1);
  totalBalance.textContent =
    incomeBalance.textContent =
    expenseBalance.textContent =
      0;
};

const checkUser = () => {
  if (localStorage.getItem("user").length !== 0) {
    startMenu.classList.add("none");
    mainMenu.classList.remove("none");
    return;
  }
  startMenu.classList.remove("none");
  mainMenu.classList.add("none");
};

const checkRadioModal = () => {
  if (document.getElementById("income").checked) {
    document
      .querySelectorAll(".type")
      .forEach((el) => el.classList.add("none"));
  }
  if (document.getElementById("expense").checked) {
    document
      .querySelectorAll(".type")
      .forEach((el) => el.classList.remove("none"));
  }
};

const findMode = function (expenseType) {
  let icon = ``;
  switch (expenseType) {
    case "food":
      icon = "hamburger";
      break;
    case "shopping":
      icon = "shopping-cart";
      break;
    case "travel":
      icon = "plane-departure";
      break;
    case "entertainment":
      icon = "film";
      break;
    case "medical":
      icon = "hospital";
      break;
    case "other":
      icon = "dollar-sign";
      break;
  }
  return icon;
};

const findModeIndex = function (expenseType) {
  let optionIndex = 0;
  switch (expenseType) {
    case "Food":
      optionIndex = 0;
      break;
    case "Shopping":
      optionIndex = 1;
      break;
    case "Travel":
      optionIndex = 2;
      break;
    case "Entertainment":
      optionIndex = 3;
      break;
    case "Medical":
      optionIndex = 4;
      break;
    case "Other":
      optionIndex = 5;
      break;
  }
  return optionIndex;
};

const calcDaysPassed = function (day1, day2) {
  return Math.abs(new Date(day1).getDate() - new Date(day2).getDate());
};

const formatDate = (date) => {
  date = new Date(+date);
  const daysPassed = calcDaysPassed(date, new Date());
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  const hour = `${date.getHours()}`.padStart(2, 0);
  const min = `${date.getMinutes()}`.padStart(2, 0);
  if (daysPassed === 0) return `Today, ${hour}:${min}`;
  else if (daysPassed === 1) return `Yesterday, ${hour}:${min}`;
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else return `${day}/${month}/${year}, ${hour}:${min}`;
};

const formatTextToCapitalize = function (words) {
  var separateWord = words.toLowerCase().split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  return separateWord.join(" ");
};

const formatBalancesInRupeesFormat = function (balance) {
  return (
    "₹ " +
    balance.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")
  );
};

const calculateBalance = function (array) {
  if (array.length === 0) return;
  // Expense
  let expenses = 0;
  let incomes = 0;
  if (array.filter((o) => o.type === "expense").length !== 0) {
    expenses = array
      .filter((o) => o.type === "expense")
      .map((a) => a.amount * 1)
      .reduce((acc, cur) => acc + cur);
  }
  // Income
  if (array?.filter((o) => o.type === "income").length !== 0) {
    incomes = array
      ?.filter((o) => o.type === "income")
      ?.map((a) => a.amount * 1)
      ?.reduce((acc, cur) => acc + cur);
  }
  // Total Balance
  const total = incomes - expenses;
  // Updating DOM
  totalBalance.textContent = formatBalancesInRupeesFormat(total);
  incomeBalance.textContent = formatBalancesInRupeesFormat(incomes);
  expenseBalance.textContent = formatBalancesInRupeesFormat(expenses);
};

const loadMainMenu = function () {
  let html = "";
  transactionsArray = JSON.parse(localStorage.getItem("transactions"));
  username.textContent = localStorage
    .getItem("user")
    .slice(1, localStorage.getItem("user").length - 1);
  document.querySelector(".transaction-list").innerHTML = "";
  if (transactionsArray.length === 0) {
    totalBalance.textContent = 0;
    incomeBalance.textContent = 0;
    expenseBalance.textContent = 0;
    return;
  }
  transactionsArray?.forEach((d) => {
    if (d.type === "income") {
      html = `
          <div class="transaction salary">
            <div class="left">
              <i class="fas fa-credit-card main-icon"></i>
              <i class="fas fa-minus-circle none" id="minus-icon" onclick="removeTransaction();"></i>
              <i class="fas fa-pencil-alt none" id="edit-icon" onclick=editTransaction();></i>
              <div>
                <p class="transaction-class">Income</p>
                <p class="note-class">${d.note}</p>
              </div>
            </div>
            <div class="right">
              <strong class="amount-class">${formatBalancesInRupeesFormat(
                d.amount
              )}</strong>
              <p>${formatDate(d.date)}</p>
            </div>
          </div>
    `;
    } else if (d.type === "expense") {
      html = `
        <div class="transaction ${d.mode}">
          <div class="left">
            <i class="fas fa-${findMode(d.mode)} main-icon"></i>
            <i class="fas fa-minus-circle none" id="minus-icon" onclick="removeTransaction();"></i>
            <i class="fas fa-pencil-alt none" id="edit-icon" onclick=editTransaction();></i>
            <div>
            <p>${d.mode.charAt(0).toUpperCase() + d.mode.slice(1)}</p>
            <p class="transaction-class none">Expense</p>
              <p class="note-class">${d.note}</p>
            </div>
          </div>
          <div class="right">
            <strong class="amount-class">-${formatBalancesInRupeesFormat(
              d.amount
            )}</strong>
            <p>${formatDate(d.date)}</p>
          </div>
        </div>
        `;
    }
    document
      .querySelector(".transaction-list")
      .insertAdjacentHTML("afterbegin", html);
  });
  calculateBalance(transactionsArray);
};

const removeTransaction = function () {
  document.querySelectorAll(".left").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-minus-circle")) {
        let array = [];
        const transactionToBeDeleted = e.target.closest(".transaction");
        const type = transactionToBeDeleted.firstElementChild
          .querySelector(".transaction-class")
          .innerHTML.toLowerCase();
        const note =
          transactionToBeDeleted.firstElementChild.querySelector(
            ".note-class"
          ).innerHTML;
        let amount = "";
        if (type === "expense") {
          amount = e.target
            .closest(".transaction")
            .lastElementChild.querySelector(".amount-class")
            .innerHTML.slice(3)
            .replaceAll(",", "");
        }
        if (type === "income") {
          amount = e.target
            .closest(".transaction")
            .lastElementChild.querySelector(".amount-class")
            .innerHTML.slice(2)
            .replaceAll(",", "");
        }
        array = JSON.parse(localStorage.getItem("transactions"));
        let index = -1;
        let data = "";

        let count = 0;
        array.forEach((i) => {
          if (i.amount === amount && i.note === note && i.type === type) {
            index = count;
          }
          count++;
        });
        count = 0;
        array.splice(index, 1);
        localStorage.removeItem("transactions");
        localStorage.setItem("transactions", JSON.stringify(array));
        if (array.length > 3) {
          transactionToBeDeleted.outerHTML = "";
        } else {
          tickBtnFunctionality();
          loadMainMenu();
        }
      }
    })
  );
};

const displayTick = function () {
  // Hiding buttons
  openModalBtn.classList.add("none");
  searchBtn.classList.add("none");
  editBtn.classList.add("none");
  sortBtn.classList.add("none");
  delBtn.classList.add("none");
  // Displaying tick button
  tickBtn.classList.remove("none");
};

const tickBtnFunctionality = function () {
  openModalBtn.classList.remove("none");
  searchBtn.classList.remove("none");
  editBtn.classList.remove("none");
  sortBtn.classList.remove("none");
  delBtn.classList.remove("none");
  tickBtn.classList.add("none");
  // Hiding minus and edit-icon buttons against each transaction
  document
    .querySelectorAll(".main-icon")
    .forEach((icon) => icon.classList.remove("none"));
  document
    .querySelectorAll("#minus-icon")
    .forEach((icon) => icon.classList.add("none"));
  document
    .querySelectorAll("#edit-icon")
    .forEach((icon) => icon.classList.add("none"));
};

const editTransaction = function () {
  document.querySelectorAll(".left").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-pencil-alt")) {
        // Getting details related to the particular transaction
        let array = [];
        const transactionToBeEdited = e.target.closest(".transaction");
        const type = transactionToBeEdited.firstElementChild
          .querySelector(".transaction-class")
          .innerHTML.toLowerCase();
        const note =
          transactionToBeEdited.firstElementChild.querySelector(
            ".note-class"
          ).innerHTML;
        let amount = "";
        if (type === "expense") {
          amount = e.target
            .closest(".transaction")
            .lastElementChild.querySelector(".amount-class")
            .innerHTML.slice(3)
            .replaceAll(",", "");
        }
        if (type === "income") {
          amount = e.target
            .closest(".transaction")
            .lastElementChild.querySelector(".amount-class")
            .innerHTML.slice(2)
            .replaceAll(",", "");
        }
        // Find the current transaction index
        array = JSON.parse(localStorage.getItem("transactions"));

        let data = "";

        let count = 0;
        array.forEach((i) => {
          if (i.amount === amount && i.note === note && i.type === type) {
            indexOfElementToBeEdited = count;
            dateOfElementToBeEdited = i.date;
          }
          count++;
        });
        count = 0;
        // Open modal, format accordingly and fill the fetched details
        modal.classList.remove("none");
        document.querySelector(".edit-h1").classList.remove("none");
        document.querySelector(".add-h1").classList.add("none");
        document.querySelector(".add-btn").classList.add("none");
        document.querySelector(".save-btn").classList.remove("none");
        document.getElementById("amount").value = amount;
        document.getElementById("note").value = note;
        if (type === "income") {
          document.getElementById("income").checked = true;
          document
            .querySelectorAll(".type")
            .forEach((el) => el.classList.add("none"));
        } else if (type === "expense") {
          document.getElementById("expense").checked = true;
          document
            .querySelectorAll(".type")
            .forEach((el) => el.classList.remove("none"));
          const expenseType =
            transactionToBeEdited.childNodes[0].nextElementSibling.outerText.split(
              "\n"
            )[0];

          document.getElementById("expense-type").selectedIndex =
            findModeIndex(expenseType);
        }
      }
    })
  );
};

// Event listeners
startBtn.addEventListener("click", () => {
  if (!startInput.value) return;
  createUser(startInput.value);
});

openModalBtn.addEventListener("click", () => {
  modal.classList.remove("none");
  document.querySelector(".edit-h1").classList.add("none");
  document.querySelector(".add-h1").classList.remove("none");
  document.querySelector(".add-btn").classList.remove("none");
  document.querySelector(".save-btn").classList.add("none");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("none");
});

addBtn.addEventListener("click", () => {
  let income = false;
  const detailsObject = {
    type: "",
    amount: 0,
    note: "",
    date: Date.now(),
  };
  if (document.getElementById("income").checked) {
    income = true;
  }
  if (document.getElementById("expense").checked) {
    income = false;
  }
  const expenseType = document.getElementById("expense-type").value;
  const amount = document.getElementById("amount").value;
  const note = document.getElementById("note").value;
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  if (!amount) {
    document.getElementById("amount").style.borderBottom = "3px solid red";
    document.getElementById("amount").placeholder = "Amount?!?";
    return;
  }
  if (!note) {
    document.getElementById("note").style.borderBottom = "3px solid red";
    document.getElementById("note").placeholder = "Don't forget to add note!";
    return;
  }
  if (income) {
    detailsObject.type = "income";
  }
  if (!income) {
    detailsObject.type = "expense";
    detailsObject.mode = expenseType;
  }

  modal.classList.add("none");
  document.getElementById("amount").style.borderBottom = "3px solid purple";
  document.getElementById("amount").placeholder = "Add amount";
  document.getElementById("note").style.borderBottom = "3px solid purple";
  document.getElementById("note").placeholder = "Add Note";
  detailsObject.amount = amount;
  detailsObject.note = note.charAt(0).toUpperCase() + note.slice(1);

  transactionsArray.push(detailsObject);
  localStorage.setItem("transactions", JSON.stringify(transactionsArray));
  calculateBalance(transactionsArray);
  loadMainMenu();
});

delBtn.addEventListener("click", () => {
  displayTick();
  // Displaying minus buttons against each transaction
  document
    .querySelectorAll(".main-icon")
    .forEach((icon) => icon.classList.add("none"));
  document
    .querySelectorAll("#minus-icon")
    .forEach((icon) => icon.classList.remove("none"));
});

tickBtn.addEventListener("click", () => {
  tickBtnFunctionality();
  loadMainMenu();
});

editBtn.addEventListener("click", () => {
  displayTick();
  // Displaying edit-icon buttons against each transaction
  document
    .querySelectorAll(".main-icon")
    .forEach((icon) => icon.classList.add("none"));
  document
    .querySelectorAll("#edit-icon")
    .forEach((icon) => icon.classList.remove("none"));
});

saveBtn.addEventListener("click", function () {
  let income = false;
  const detailsObject = {
    type: "",
    amount: 0,
    note: "",
    date: dateOfElementToBeEdited,
  };
  // Fetching data from DOM
  const expenseType = document.getElementById("expense-type").value;
  const amount = document.getElementById("amount").value;
  const note = document.getElementById("note").value;
  // Clearing fields
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
  if (!amount) {
    document.getElementById("amount").style.borderBottom = "3px solid red";
    document.getElementById("amount").placeholder = "Amount?!?";
    return;
  }
  if (!note) {
    document.getElementById("note").style.borderBottom = "3px solid red";
    document.getElementById("note").placeholder = "Don't forget to add note!";
    return;
  }
  if (document.querySelector("#income").checked) income = true;

  if (income) {
    detailsObject.type = "income";
  }
  if (!income) {
    detailsObject.type = "expense";
    detailsObject.mode = expenseType;
  }
  modal.classList.add("none");
  document.getElementById("amount").style.borderBottom = "3px solid purple";
  document.getElementById("amount").placeholder = "Add amount";
  document.getElementById("note").style.borderBottom = "3px solid purple";
  document.getElementById("note").placeholder = "Add Note";
  detailsObject.amount = amount;
  detailsObject.note = note.charAt(0).toUpperCase() + note.slice(1);

  let array = [];
  // Fetching local storage data
  array = JSON.parse(localStorage.getItem("transactions"));

  // Update Array
  array.splice(indexOfElementToBeEdited, 1, detailsObject);
  // Delete localStorage
  localStorage.removeItem("transactions");
  // Update localStorage
  localStorage.setItem("transactions", JSON.stringify(array));
  // Update UI
  tickBtnFunctionality();
  loadMainMenu();
});

searchBtn.addEventListener("click", () => {});
sortBtn.addEventListener("click", () => {});
profileBtn.addEventListener("click", () => {});

// Initialisation
init();
