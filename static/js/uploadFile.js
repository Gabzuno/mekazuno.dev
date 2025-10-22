document.addEventListener("DOMContentLoaded", function () {
  const demoModal = new bootstrap.Modal(document.getElementById("modalDemo"));
  const demoBtn = document.getElementById("demo-video");
  const fileInput = document.getElementById("fileInput");
  const dropArea = document.getElementById("dropArea");
  const browseBtn = document.getElementById("browseBtn");
  const uploadBtn = document.getElementById("uploadBtn");
  const uploadStatus = document.getElementById("uploadStatus");
  const closeBtn = document.getElementById("demoBtnClose");
  const fileNameDisplay = document.getElementById("fileName");
  const downloadLink = document.getElementById("downloadLink");

  let selectedFile = null;
  const UPLOAD_LIMIT = 3;
  const RESET_INTERVAL = 30 * 1000; // 30 seconds in milliseconds

  // Load upload count from localStorage
  let uploadCount = parseInt(localStorage.getItem("uploadCount")) || 0;
  let lastResetTime =
    parseInt(localStorage.getItem("lastResetTime")) || Date.now();

  function checkResetTime() {
    if (Date.now() - lastResetTime >= RESET_INTERVAL) {
      localStorage.setItem("uploadCount", "0");
      localStorage.setItem("lastResetTime", Date.now().toString());
      uploadCount = 0;
      console.log("Upload limit reset.");
    }
  }

  // Call reset check on load
  checkResetTime();

  function handleFiles(files) {
    uploadStatus.style.display = "none";
    uploadBtn.disabled = true;

    if (files.length > 0) {
      if (uploadCount >= UPLOAD_LIMIT) {
        uploadStatus.innerText = "⚠️ Upload limit reached. Try again later.";
        uploadStatus.style.display = "block";
        return;
      }

      const file = files[0];
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/jpg",
        "video/mp4",
        "video/webm",
        "video/ogg",
      ];

      if (!validTypes.includes(file.type)) {
        uploadStatus.innerText = "❌ Only images and videos are allowed.";
        uploadStatus.style.display = "block";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        uploadStatus.innerText = "❌ File size must be 10MB or less.";
        uploadStatus.style.display = "block";
        return;
      }

      selectedFile = file;
      uploadBtn.disabled = false;
      fileNameDisplay.textContent = `Selected File: ${file.name}`;
      uploadStatus.textContent = "";
      downloadLink.style.display = "none";
    }
  }

  demoBtn.addEventListener("click", function () {
    demoModal.show();
  });

  browseBtn.addEventListener("click", function () {
    fileInput.value = "";
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    handleFiles(fileInput.files);
  });

  dropArea.addEventListener("dragover", function (event) {
    event.preventDefault();
    dropArea.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", function () {
    dropArea.classList.remove("drag-over");
  });

  dropArea.addEventListener("drop", function (event) {
    event.preventDefault();
    dropArea.classList.remove("drag-over");
    handleFiles(event.dataTransfer.files);
  });

  closeBtn.addEventListener("click", function () {
    fileNameDisplay.textContent = "";
    uploadStatus.style.display = "none";
    uploadBtn.disabled = true;
    fileInput.value = "";
    selectedFile = null;
    downloadLink.style.display = "none";
  });

  uploadBtn.addEventListener("click", function () {
    if (!selectedFile) {
      uploadStatus.textContent = "⚠️ Please select a file first.";
      uploadStatus.style.display = "block";
      return;
    }

    uploadStatus.textContent = "Uploading file...(please be patient)";
    uploadStatus.style.display = "block";

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch("http://127.0.0.1:5002/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.download_url) {
          uploadStatus.textContent = "✅ File processed successfully!";
          downloadLink.href = `http://127.0.0.1:5002${data.download_url}`;
          downloadLink.style.display = "block";

          // Increase upload count and save it
          uploadCount++;
          localStorage.setItem("uploadCount", uploadCount.toString());

          if (uploadCount >= UPLOAD_LIMIT) {
            uploadBtn.disabled = true;
            uploadStatus.textContent =
              "⚠️ Upload limit reached. Try again after 30mins.";
          }
        } else {
          uploadStatus.textContent = "❌ Error processing file.";
        }
      })
      .catch(() => {
        uploadStatus.textContent = "❌ Server error. Try again later.";
      });
  });

  // Auto-reset upload count every 30 minutes
  setInterval(checkResetTime, RESET_INTERVAL);
});
