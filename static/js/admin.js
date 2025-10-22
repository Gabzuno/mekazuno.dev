import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD56TvVuz9rl9wvRN9VhkJH_Gz8WHpFh_Q",
  authDomain: "spectre-8f79c.firebaseapp.com",
  databaseURL:
    "https://spectre-8f79c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spectre-8f79c",
  storageBucket: "spectre-8f79c.appspot.com",
  messagingSenderId: "875337744237",
  appId: "1:875337744237:web:75456d5c16227f05b56464",
  measurementId: "G-XKVZM1NSR8",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

//LOGIN FORM
const form = document.getElementById("mainform");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const feedback = document.getElementById("passwordFeedback");

let tbody = document.getElementById("tbody_accountmanagement");

function StaffManagement(
  company_email,
  company_name,
  company_branch,
  company_city
) {
  let trow = document.createElement("tr");

  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  let td4 = document.createElement("td");
  let td5 = document.createElement("td");

  td1.classList.add("text-center");
  td2.classList.add("text-center");
  td3.classList.add("text-center");
  td4.classList.add("text-center");
  td5.classList.add("text-center");

  td1.innerHTML = company_email;
  td2.innerHTML = company_name;
  td3.innerHTML = company_branch;
  td4.innerHTML = company_city;

  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add(
    "d-flex",
    "justify-content-center",
    "flex-column",
    "gap-2",
    "flex-sm-row"
  );

  let viewBtn = document.createElement("button");
  viewBtn.type = "button";
  viewBtn.className = "btn text-sm";
  viewBtn.style.backgroundColor = "rgb(49, 101, 147)";
  viewBtn.style.color = "white";
  viewBtn.innerHTML =
    "<img src='../../../../static/images/icons/view.png' alt='View'> View";
  viewBtn.addEventListener("click", function () {
    viewButtonClicked(company_email);
  });

  buttonContainer.appendChild(viewBtn);

  td5.appendChild(buttonContainer);

  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);
  trow.appendChild(td5);

  tbody.appendChild(trow);
}

window.viewButtonClicked = function (company_email) {
  const dbRef = ref(db, "Registered_Accounts");

  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().company_email === company_email) {
          const userData = childSnapshot.val();

          // Populate modal fields with user data
          document.getElementById("viewFirstname").value =
            userData.firstname || "";
          document.getElementById("viewMiddlename").value =
            userData.middlename || "";
          document.getElementById("viewLastname").value =
            userData.lastname || "";
          document.getElementById("viewContactNo").value = userData.contact_no
            ? userData.contact_no.slice(3)
            : "";
          document.getElementById("viewGender").value = userData.gender || "";
          document.getElementById("viewEmail").value = userData.email || "";
          document.getElementById("viewRegion").value = userData.region || "";
          document.getElementById("viewProvince").value =
            userData.province || "";
          document.getElementById("viewCity").value = userData.city || "";
          document.getElementById("viewBarangay").value =
            userData.barangay || "";
          document.getElementById("viewAddressInfo").value =
            userData.address_info || "";
          document.getElementById("viewCompanyName").value =
            userData.company_name || "";
          document.getElementById("viewCompanyBranch").value =
            userData.company_branch || "";
          document.getElementById("viewCompanyEmail").value =
            userData.company_email || "";
          document.getElementById("viewTelephoneNo").value =
            userData.company_telephone_no || "";
          document.getElementById("viewCompanyAddressInfo").value =
            userData.company_address || "";
          document.getElementById("viewCompanyRegion").value =
            userData.company_region || "";
          document.getElementById("viewCompanyProvince").value =
            userData.company_province || "";
          document.getElementById("viewCompanyCity").value =
            userData.company_city || "";
          document.getElementById("viewCompanyBarangay").value =
            userData.company_barangay || "";

          // Show the modal
          $("#viewAccountModal").modal("show");
        }
      });
    },
    { onlyOnce: true }
  );
};

function AddAllItemsToTable(TheUser) {
  if (!Array.isArray(TheUser)) {
    console.error("TheUser is not an array:", TheUser);
    return;
  }

  let tbody = document.querySelector("#example tbody");
  if (!tbody) {
    console.error("Table body not found!");
    return;
  }

  // 🔹 Reset table content
  tbody.innerHTML = "";

  let table;
  if ($.fn.DataTable.isDataTable("#example")) {
    table = $("#example").DataTable();
    table.clear().draw();
  } else {
    table = $("#example").DataTable({
      columns: [
        { title: "Email", className: "text-center" },
        { title: "Company Name", className: "text-center" },
        { title: "Branch", className: "text-center" },
        { title: "City", className: "text-center" },
        { title: "Actions", className: "text-center" },
      ],
      buttons: [
        { extend: "copy", exportOptions: { columns: ":not(:last-child)" } },
        { extend: "csv", exportOptions: { columns: ":not(:last-child)" } },
        { extend: "excel", exportOptions: { columns: ":not(:last-child)" } },
        { extend: "pdf", exportOptions: { columns: ":not(:last-child)" } },
        { extend: "print", exportOptions: { columns: ":not(:last-child)" } },
      ],
    });

    table.buttons().container().appendTo("#example_wrapper .col-md-6:eq(0)");
  }

  // 🔹 Avoid modifying original array
  const reversedUsers = [...TheUser].reverse();

  // 🔹 Insert rows into DataTable (ONLY ONCE)
  reversedUsers.forEach((user) => {
    if (
      !user.company_email ||
      !user.company_name ||
      !user.company_branch ||
      !user.company_city
    ) {
      console.warn("Skipping user with missing data:", user);
      return;
    }

    let actionButtons = `<button class="btn btn-primary" onclick="viewButtonClicked('${user.company_email}')">View</button>`;

    try {
      table.row
        .add([
          `<span style="color: white;">${user.company_email}</span>`,
          `<span style="color: white;">${user.company_name}</span>`,
          `<span style="color: white;">${user.company_branch}</span>`,
          `<span style="color: white;">${user.company_city}</span>`,
          actionButtons,
        ])
        .draw();
    } catch (error) {
      console.error("Error adding row:", error);
    }
  });
}

function GetAllDataOnce() {
  const dbRef = ref(db, "Registered_Accounts");

  onValue(dbRef, (snapshot) => {
    var users = [];

    snapshot.forEach((childSnapshot) => {
      users.push(childSnapshot.val());
    });

    AddAllItemsToTable(users);
  });
}

window.onload = GetAllDataOnce;

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (window.location.pathname === "/Zq3cT404") {
      window.location.href = "/Zq3cT404/main";
    }
  } else {
    if (window.location.pathname === "/Zq3cT404/main") {
      window.location.href = "/Zq3cT404";
    }
  }
});

// LOGOUT
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      console.log("Attempting to log out...");
      signOut(auth)
        .then(() => {
          console.log("User successfully logged out.");
          window.location.href = "/Zq3cT404";
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    });
  }
});

// FORM SUBMISSION
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  if (email === "" || password === "") {
    alert("Both fields are required.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
  .then(() => {
    window.location.href = "/Zq3cT404/main";
  })
  .catch((error) => {
    console.error("Authentication failed:", error);
    feedback.style.display = "block";
  });
});
