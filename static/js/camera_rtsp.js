/* CAMERA FEED FULL SCREEN */
document.addEventListener("DOMContentLoaded", async function () {
  const baseUrl = "http://127.0.0.1:5002/video_feed";
  const noSignalImage = "static/images/nosignal.jpg";

  // Retrieve the user ID from sessionStorage (assuming it's stored as 'user-creds')
  const rawUserCreds = sessionStorage.getItem("user-creds");
  const userCredentials = rawUserCreds ? JSON.parse(rawUserCreds) : null;
  const userUid = userCredentials ? userCredentials.uid : null;

  if (!userUid) {
    console.error("User ID not found in session storage");
    return;
  }

  // Fetch available cameras from the Flask server
  const response = await fetch("http://127.0.0.1:5002/available_cameras")
  .catch((err) => console.error("Fetch error:", err));
  if (!response || !response.ok) {
    console.error("Failed to fetch available cameras");
    return;
  }
  const data = await response.json();
  const availableCams = data.available_rtsp;

  console.log("Available cameras:", availableCams);

  // Select all video container elements
  const videoContainers = document.querySelectorAll(".webcam-container");

  // Loop through each container and update its image source based on availability
  videoContainers.forEach((container) => {
    const rtspUrl = container.getAttribute("data-rtsp-url");
    const imgElement = container.querySelector("img");

    if (availableCams.includes(rtspUrl)) {
      // Assign the video feed URL with UID as a query parameter
      imgElement.src = `${baseUrl}?rtsp_url=${encodeURIComponent(rtspUrl)}&uid=${userUid}`;
      console.log(`Camera index ${rtspUrl} is active.`);
    } else {
      // Use the fallback image if the camera is not available
      console.warn(`Camera index ${rtspUrl} is not available.`);
      imgElement.src = noSignalImage;
    }

    // Add error handling for failed streams
    imgElement.onerror = function () {
      console.error(
        `Stream failed for camera ${rtspUrl}, switching to noSignal image.`
      );
      imgElement.src = noSignalImage;
    };
  });
  
  // Add event listeners to images for fullscreen mode
  document.querySelectorAll(".block img").forEach((img) => {
    img.addEventListener("click", () => {
      // Only proceed if the image source is not the fallback image
      if (img.src !== noSignalImage) {
        // Create fullscreen container
        const fullScreenContainer = document.createElement("div");
        fullScreenContainer.classList.add("fullscreen");

        // Add the selected webcam feed in fullscreen
        const videoElement = document.createElement("img");
        videoElement.src = img.src;
        fullScreenContainer.appendChild(videoElement);

        // Add close button at the top-left corner
        const closeButton = document.createElement("button");
        closeButton.classList.add("close-fullscreen-btn");
        closeButton.textContent = "×";
        fullScreenContainer.appendChild(closeButton);

        // Append the fullscreen container to the body
        document.body.appendChild(fullScreenContainer);

        // Close fullscreen when the close button is clicked
        closeButton.addEventListener("click", () => {
          fullScreenContainer.remove();
        });

        // Show the "Press Esc to exit" notification
        const escNotification = document.createElement("div");
        escNotification.classList.add("esc-notification");
        escNotification.textContent = "Press Esc to exit fullscreen";
        fullScreenContainer.appendChild(escNotification);

        // Automatically hide the notification after 3 seconds
        setTimeout(() => {
          escNotification.style.opacity = "0";
        }, 1000);
      }
    });
  });

  // Exit fullscreen when pressing "Escape"
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const fullscreenElement = document.querySelector(".fullscreen");
      if (fullscreenElement) {
        fullscreenElement.remove();
      }
    }
  });
});
