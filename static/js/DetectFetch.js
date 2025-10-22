document.addEventListener("DOMContentLoaded", async function () {
  const userUid = sessionStorage.getItem("user-creds")
    ? JSON.parse(sessionStorage.getItem("user-creds")).uid
    : null;

  if (!userUid) {
    console.error("User ID (uid) not found in session storage");
    return;
  }

  function fetchDetectionLogs(cameraIndex) {
    fetch(`/logs?uid=${userUid}&camera_index=${cameraIndex}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const logTableId = `tbody_cam${cameraIndex + 1}`;
        const logTable = document.getElementById(logTableId);
        logTable.innerHTML = "";

        if (!data || data.length === 0) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="text-center" colspan="4">No detection logs available for Camera ${
              cameraIndex + 1
            }.</td>
          `;
          logTable.appendChild(row);
          return;
        }

        data.forEach((log) => {
          if (log && log.date && log.time && log.type && log.video_url) {
            const { date, time, type, video_url } = log;
            const row = document.createElement("tr");
            row.innerHTML = `
              <td class="text-center">${date}</td>
              <td class="text-center">${time}</td>
              <td class="text-center">${type}</td>
              <td class="text-center">
                <a href="${video_url}" class="btn btn-success btn-sm" download="${type}_${date}_${time}.mp4">
                  Download
                </a>
              </td>
            `;
            logTable.appendChild(row);
          }
        });
      })
      .catch((error) => {
        console.error(`Error fetching logs for Camera ${cameraIndex}:`, error);

        const logTable = document.getElementById(`tbody_cam${cameraIndex + 1}`);
        logTable.innerHTML = "";
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="text-center" colspan="4">Error fetching logs. Please try again later.</td>
        `;
        logTable.appendChild(row);
      });
  }

  document.querySelectorAll(".nav-link").forEach((tab, index) => {
    tab.addEventListener("click", () => fetchDetectionLogs(index));
  });

  // Fetch detection logs on page load
  fetchDetectionLogs();

  setInterval(fetchDetectionLogs, 1500);

  // Function for detection alert
  let alertShown = false;
  const audioAlert = new Audio("/static/sample.mp3");

  function checkDetection() {
    fetch("/detection_status")
      .then((response) => response.json())
      .then((data) => {
        const detectionAlert = document.getElementById("detectionAlert");

        if (data.person_detected && !alertShown) {
          detectionAlert.style.display = "block";
          audioAlert.play();
          alertShown = true;

          setTimeout(() => {
            detectionAlert.style.display = "none";
            alertShown = false;
          }, 10000);
        }
      })
      .catch((error) =>
        console.error("Error fetching detection status:", error)
      );
  }

  // Fetch logs for additional monitoring
  function fetchLogs() {
    fetch("/logs")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((log) => {
          const logEntry = document.createElement("p");
          logEntry.textContent = log;

          // Find the camera number from the log (e.g., "Camera 1")
          const cameraMatch = log.match(/Camera (\d+)/);

          if (cameraMatch) {
            const cameraNumber = cameraMatch[1]; // Extract camera number (1, 2, 3, or 4)
            const logContainer = document.getElementById(
              "logContainer_" + cameraNumber
            );
            if (logContainer) {
              logContainer.appendChild(logEntry);
              logContainer.scrollTop = logContainer.scrollHeight;
            }
          }
        });
      })
      .catch((error) => console.error("Error fetching logs:", error));
  }

  // Initial fetch and periodic updates
  fetchDetectionLogs();
  setInterval(checkDetection, 5000); // Check detection status every 5 seconds
  setInterval(fetchLogs, 60000); // Refresh logs every 1 minute
});
