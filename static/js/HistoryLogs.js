import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getDatabase,
  get,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Initialize Firebase
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

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);

let tbody = document.getElementById("tbody_detection");

function renderDetectionLogs(detections) {
  tbody.innerHTML = "";

  if (!detections || detections.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="text-center" colspan="5">No detection logs available.</td>
        `;
    tbody.appendChild(row);
    return;
  }

  detections.forEach((detection) => {
    if (
      detection.date &&
      detection.time &&
      detection.type &&
      detection.camera
    ) {
      const { date, time, type, camera, video_url } = detection;

      const trow = document.createElement("tr");

      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const td5 = document.createElement("td");

      td1.classList.add("text-center");
      td2.classList.add("text-center");
      td3.classList.add("text-center");
      td4.classList.add("text-center");
      td5.classList.add("text-center");

      td1.textContent = date;
      td2.textContent = time;
      td3.textContent = type;
      td4.textContent = camera;

      if (video_url) {
        const downloadLink = document.createElement("a");
        downloadLink.href = video_url;
        downloadLink.className = "btn btn-success btn-sm";
        downloadLink.download = `${type}_${date}_${time}.mp4`;
        downloadLink.textContent = "Download";
        td5.appendChild(downloadLink);
      } else {
        td5.textContent = "No video available";
      }

      trow.appendChild(td1);
      trow.appendChild(td2);
      trow.appendChild(td3);
      trow.appendChild(td4);
      trow.appendChild(td5);

      tbody.appendChild(trow);
    }
  });

  if ($.fn.DataTable.isDataTable("#table_detection")) {
    $("#table_detection").DataTable().clear();
    $("#table_detection").DataTable().destroy();
  }

  $(document).ready(function () {
    var table = $("#table_detection").DataTable({
      buttons: [
        { extend: "copy", exportOptions: { columns: ":not(:last-child)" } },
        { extend: "csv", exportOptions: { columns: ":not(:last-child)" } },
        { extend: "excel", exportOptions: { columns: ":not(:last-child)" } },
        { extend: "pdf", exportOptions: { columns: ":not(:last-child)" } },
        { extend: "print", exportOptions: { columns: ":not(:last-child)" } },
      ],
    });
    table
      .buttons()
      .container()
      .appendTo("#table_detection_wrapper .col-md-6:eq(0)");
  });
}

function GetAllDataOnce() {
  const user = auth.currentUser;

  if (user) {
    // Fetch the user's firstname from your database, assuming it's stored under Registered_Accounts
    const uid = user.uid;
    const userRef = ref(db, `Registered_Accounts/${uid}`);
    
    get(userRef).then((snapshot) => {
      const userData = snapshot.val();
      const firstname = userData ? userData.firstname : "Unknown"; // Default to "Unknown" if firstname is not found

      console.log("Fetching data for user:", firstname);

      const dbRef = ref(db, `Registered_Accounts/${uid}/Detection`);
      onValue(dbRef, (snapshot) => {
        const detections = [];
        console.log("Snapshot data:", snapshot.val());

        snapshot.forEach((cameraSnapshot) => {
          const cameraKey = cameraSnapshot.key;
          cameraSnapshot.forEach((detectionSnapshot) => {
            const data = detectionSnapshot.val();
            console.log(`Detection data from ${cameraKey}:`, data);
            detections.push({
              date: data.date || "Unknown Date",
              time: data.time || "Unknown Time",
              type: data.type || "Unknown Type",
              video_url: data.video_url || null,
              camera: cameraKey || "Unknown Camera",
            });
          });
        });
        console.log("All detections:", detections);
        // renderDetectionLogs(detections);
        // updateIncidentCounts(detections);
      });
    }).catch((error) => {
      console.error("Error fetching user data:", error);
    });
  } else {
    console.error("User is not logged in.");
  }
}


auth.onAuthStateChanged((user) => {
  if (user) {
    GetAllDataOnce();
  } else {
    console.error("No user is currently logged in.");
  }
});

if (!tbody) {
  console.error("tbody_detection element not found in the DOM.");
}
