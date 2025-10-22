// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import {
  getDatabase,
  get,
  ref,
  child,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD56TvVuz9rl9wvRN9VhkJH_Gz8WHpFh_Q",
  authDomain: "spectre-8f79c.firebaseapp.com",
  databaseURL:
    "https://spectre-8f79c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "spectre-8f79c",
  storageBucket: "spectre-8f79c.appspot.com",
  messagingSenderId: "875337744237",
  appId: "1:875337744237:web:d2dd76f311523b30b56464",
  measurementId: "G-13VZ185YFT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);

document.addEventListener("DOMContentLoaded", function () {
  const mainForm = document.getElementById("mainform");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const passwordFeedback = document.getElementById("passwordFeedback");
  const emailFeedback = document.getElementById("emailFeedback");
  const closeButtons = document.querySelectorAll(".btn-close");
  const sendOTPButton = document.getElementById("sendOTP");

  let SignInUser = async (evt) => {
    evt.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    console.log("Email:", emailValue, typeof email);
    console.log("Password:", passwordValue, typeof password);

    // Clear previous validation states
    email.classList.remove("is-valid", "is-invalid");
    password.classList.remove("is-valid", "is-invalid");
    emailFeedback && (emailFeedback.style.display = "none");
    passwordFeedback.style.display = "none";

    // Validate email domain
    const validDomains = ["@gmail.com", "@outlook.com"];
    const emailDomain = emailValue.substring(emailValue.lastIndexOf("@"));

    if (!validDomains.includes(emailDomain)) {
      email.classList.add("is-invalid");
      emailFeedback.innerText = "*Please enter a valid email address.";
      emailFeedback.style.display = "block";
      return;
    }

    // Validate password is not empty
    if (!passwordValue) {
      password.classList.add("is-invalid");
      passwordFeedback.innerText = "*Please enter your password.";
      passwordFeedback.style.display = "block";
      return;
    }

    try {
      // Firebase sign-in
      const credentials = await signInWithEmailAndPassword(
        auth,
        emailValue,
        passwordValue
      );

      // Fetch user's account data
      const emailSnapshot = await get(child(dbref, "Registered_Accounts"));
      if (!emailSnapshot.exists()) {
        alert("No registered accounts found.");
        return;
      }

      const accounts = emailSnapshot.val();
      const account = Object.values(accounts).find(
        (acc) => acc.email === emailValue
      );

      if (!account) {
        alert("Account does not exist.");
        return;
      }

      // Save session data
      sessionStorage.setItem("user-info", JSON.stringify(account));
      sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));

      // Redirect to client dashboard
      window.location.href = "/client";
    } catch (error) {
      console.error("Sign-in error:", error);

      // Handle specific Firebase errors
      switch (error.code) {
        case "auth/invalid-email":
          email.classList.add("is-invalid");
          emailFeedback.innerText = "*Invalid email format.";
          emailFeedback.style.display = "block";
          break;
        case "auth/wrong-password":
          password.classList.add("is-invalid");
          passwordFeedback.innerText = "*Incorrect password.";
          passwordFeedback.style.display = "block";
          break;
        case "auth/invalid-credential":
          alert(
            "The credentials provided are invalid. Please check your email and password."
          );
          mainForm.reset();
          break;
        case "auth/user-not-found":
          alert("Account does not exist.");
          break;
        default:
          alert("An unexpected error occurred. Please try again.");
          break;
      }
    }
  };

  if (mainForm) {
    mainForm.addEventListener("submit", SignInUser);
  } else {
    console.log("Form element not found.");
  }

  // FORGOT PASS
  if (sendOTPButton) {
    sendOTPButton.addEventListener("click", () => {
      const emailInputReset = document.getElementById("forgotpassemail");
      const feedbackElement = document.getElementById("noacc-feedback");
      const email = emailInputReset.value.trim();

      if (email === "") {
        feedbackElement.textContent = "*Please enter your email.";
        emailInputReset.classList.add("is-invalid");
        return;
      }

      emailInputReset.classList.remove("is-invalid");

      // Send a password reset email using Firebase Authentication
      sendPasswordResetEmail(auth, email)
        .then(() => {
          const resetEmailModal = new bootstrap.Modal(
            document.getElementById("resetEmailModal")
          );
          resetEmailModal.show();
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            feedbackElement.textContent =
              "*No account found with this email address.";
            feedbackElement.style.color = "red";
          } else if (error.code === "auth/invalid-email") {
            feedbackElement.textContent =
              "*Invalid email format. Please enter a correct email.";
            feedbackElement.style.color = "red";
          } else {
            console.error(error.message);
            feedbackElement.textContent =
              "*An unexpected error occurred. Please try again later.";
            feedbackElement.style.color = "red";
          }
        });
    });
  } else {
    console.log("sendOTP button not found.");
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");

      if (modal) {
        const inputs = modal.querySelectorAll("input");
        inputs.forEach((input) => {
          input.value = "";
          input.classList.remove("is-invalid");
        });

        const feedbackElement = modal.querySelector("#noacc-feedback");
        if (feedbackElement) {
          feedbackElement.textContent = "";
        }
      }
    });
  });

  //TOGGLE PASSWORD
  if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
      const type = password.type === "password" ? "text" : "password";
      password.type = type;

      // Toggle between eye and eye-slash icons
      this.classList.toggle("bi-eye");
      this.classList.toggle("bi-eye-slash");
    });
  } else {
    console.log("togglePassword or password element not found.");
  }
});
