document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("#sidebar .event-link a");
  const contentItems = document.querySelectorAll(".content-item");
  const profileLink = document.getElementById("profile-link");

  // DATE DISPLAY
  const dateElement = document.getElementById("currentDate");
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString(undefined, options);
  if (dateElement) dateElement.textContent = formattedDate;

  /* FIREBASE FETCHING */
  let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

  // console.log(UserInfo);

  let userFirstname = document.getElementById("user_firstname");
  let userCompanyName = document.getElementById("company_name");
  let displayCompanyName = document.getElementById("displayCompanyName");
  let displayCompanyName2 = document.getElementById("displayCompanyName2");
  let displayCompanyBranch = document.getElementById("displayCompanyBranch");
  let displayCompanyAddress = document.getElementById("displayCompanyAddress");
  let displayCompanyTelephoneNo = document.getElementById(
    "displayCompanyTelephoneNo"
  );

  // Helper function to update element text
  function updateElementText(element, value) {
    if (element) {
      element.innerText = value || "N/A"; // Default to "N/A" if value is undefined
    }
  }

  // Display user info with fallback values
  if (UserInfo) {
    updateElementText(userFirstname, UserInfo.firstname);
    updateElementText(userCompanyName, UserInfo.company_name);
    updateElementText(displayCompanyName, UserInfo.company_name);
    updateElementText(displayCompanyName2, UserInfo.company_name);
    updateElementText(displayCompanyBranch, UserInfo.company_branch);
    updateElementText(displayCompanyAddress, UserInfo.company_address);
    updateElementText(displayCompanyTelephoneNo, UserInfo.company_telephone_no);
  } else {
    console.log("UserInfo is not available.");
  }

  // Display firstname and company name, with checks to confirm data is present
  if (UserInfo && UserInfo.firstname) {
    userFirstname.innerText = `${UserInfo.firstname}`;
  } else {
    console.log("Firstname is missing in UserInfo or is undefined.");
  }

  if (userCompanyName) {
    if (UserInfo && UserInfo.company_name) {
      userCompanyName.innerText = `${UserInfo.company_name}`;
    } else {
      console.log("Company name is missing in UserInfo or is undefined.");
    }
  } else {
    console.log("Element with ID 'userCompanyName' not found in the DOM.");
  }

  if (UserInfo && UserInfo.company_name) {
    displayCompanyName.innerText = `${UserInfo.company_name}`;
  } else {
    console.log("Company name is missing in UserInfo or is undefined.");
  }

  if (UserInfo && UserInfo.company_name) {
    displayCompanyName2.innerText = `${UserInfo.company_name}`;
  } else {
    console.log("Company name is missing in UserInfo or is undefined.");
  }

  if (UserInfo && UserInfo.company_branch) {
    displayCompanyBranch.innerText = `${UserInfo.company_branch}`;
  } else {
    console.log("Company branch is missing in UserInfo or is undefined.");
  }

  if (UserInfo && UserInfo.company_address) {
    displayCompanyAddress.innerText = `${UserInfo.company_address}`;
  } else {
    console.log("Company address is missing in UserInfo or is undefined.");
  }

  if (UserInfo && UserInfo.company_telephone_no) {
    displayCompanyTelephoneNo.innerText = `${UserInfo.company_telephone_no}`;
  } else {
    console.log(
      "Company telephone nummber is missing in UserInfo or is undefined."
    );
  }

  /* SIDEBAR TOGGLE */
  if (typeof $ !== "undefined") {
    $(document).ready(function () {
      $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
      });
    });
  } else {
    document
      .getElementById("sidebarCollapse")
      ?.addEventListener("click", function () {
        document.getElementById("sidebar").classList.toggle("active");
      });
  }

  /* START CONTENT AND SIDEBAR LOGIC */
  // Load the last active link and content from localStorage
  const lastActiveContentId = localStorage.getItem("activeContent");
  if (lastActiveContentId) {
    links.forEach((link) => {
      if (link.getAttribute("data-content") === lastActiveContentId) {
        link.classList.add("active-link");
      }
    });

    contentItems.forEach((item) => {
      item.style.display = item.id === lastActiveContentId ? "block" : "none";
    });
  } else {
    // Set Default Active Link
    const defaultLink = document.querySelector(
      "#sidebar .event-link[data-content='content1']"
    );
    console.log("Default Link Found:", defaultLink);
    if (defaultLink) {
      defaultLink.classList.add("active-link");
      const defaultContent = document.querySelector("#content1");
      if (defaultContent) {
        defaultContent.style.display = "block";
      }
    }
  }

  // Click Event for Sidebar Links
  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // Ensure that href is valid and contains a content ID
      const href = this.getAttribute("href");

      if (!href) {
        console.error("Missing href attribute on link:", this);
        return;
      }

      if (href.startsWith("#")) {
        const targetContentId = href.substring(1);
        const targetContent = document.querySelector(`#${targetContentId}`);

        if (targetContent) {
          document
            .querySelectorAll(".content-item")
            .forEach((item) => (item.style.display = "none"));
          targetContent.style.display = "block";

          // Remove active class from all links
          links.forEach((l) => l.classList.remove("active-link"));
          this.classList.add("active-link");

          // Save the active content to localStorage
          localStorage.setItem("activeContent", targetContentId);
        } else {
          console.error(`Target content with ID ${targetContentId} not found.`);
        }
      } else {
        console.error("Invalid href attribute:", href);
      }
    });
  });

  /* END CONTENT AND SIDEBAR LOGIC */

  // CONTENT 5: ACCOUNTS
  function goToAccounts(event) {
    event.preventDefault();
    document.getElementById("content1").style.display = "none"; // Dashboard
    document.getElementById("content2").style.display = "none"; // Detection
    document.getElementById("content3").style.display = "none"; // History
    document.getElementById("accounts").style.display = "block"; // Accounts

    // Save the active content to localStorage
    localStorage.setItem("activeContent", "accounts");
  }

  if (profileLink) {
    // Attach the goToAccounts function to the click event
    profileLink.addEventListener("click", goToAccounts);
  }

  /*SHOW PASSWORD AND PIN EYE TOGGLER*/
  $(document).ready(function () {
    const togglePasswordVisibility = (passwordInput, eyeIcon, eyeSlashIcon) => {
      const type =
        passwordInput.attr("type") === "password" ? "text" : "password";
      passwordInput.attr("type", type);
      eyeIcon.toggleClass("d-none");
      eyeSlashIcon.toggleClass("d-none");
    };

    $(".toggle-password-btn").on("click", function () {
      const targetInputId = $(this).data("target");
      const passwordInput = $("#" + targetInputId);
      const eyeIcon = $(this).find("i.bi-eye");
      const eyeSlashIcon = $(this).find("i.bi-eye-slash");
      togglePasswordVisibility(passwordInput, eyeIcon, eyeSlashIcon);

      const newPasswordInput = $("#newPassword");
      const confirmNewPasswordInput = $("#confirmNewPassword");

      if (targetInputId === "confirmNewPassword") {
        togglePasswordVisibility(
          newPasswordInput,
          $("#passwordToggleBtn i.bi-eye"),
          $("#passwordToggleBtn i.bi-eye-slash")
        );
      } else if (targetInputId === "newPassword") {
        togglePasswordVisibility(
          confirmNewPasswordInput,
          $("#passwordToggleBtn i.bi-eye"),
          $("#passwordToggleBtn i.bi-eye-slash")
        );
      }
    });
  });
});
