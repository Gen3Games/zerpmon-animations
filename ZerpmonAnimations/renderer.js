const form = document.querySelector("#zerp-form");
const startInput = document.querySelector("#start");
const endInput = document.querySelector("#end");
const csv = document.querySelector("#csv");
const renderCsvButton = document.querySelector("#render-csv");
const filenameDisplay = document.querySelector("#filename");
let selectedFile = null;

async function startRender(e) {
  e.preventDefault();
  const start = startInput.value;
  const end = endInput.value;

  try {
    await createImageChunksGUI(start, end);
    await fetchAndDownloadImageGUI();
    await renderAnimationGUI();
    await checkMissingFilesGUI();
  } catch (error) {
    console.error("Error : ", error);
  }
}

async function startRenderWithCSV(event) {
  event.preventDefault();

  if (!selectedFile) {
    alertError("No CSV file selected");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function (event) {
    const csvData = event.target.result;

    try {
      await processCSVDataGUI(csvData);
      await fetchAndDownloadImageGUI();
      await renderAnimationGUI();
      await checkMissingFilesGUI();
    } catch (error) {
      console.error("Error : ", error);
    }
  };
  reader.readAsText(selectedFile);
}

async function processCSVDataGUI(csvData) {
  const response = await window.createImageChunksWithCSV(csvData);
  if (response.result) {
    alertSuccess(response.message);
  } else {
    alertError(missingFilesResponse.message);
  }
}

async function createImageChunksGUI(start, end) {
  const response = await window.createImageChunks(start, end);
  if (response.result) {
    alertSuccess(response.message);
  } else {
    alertError(missingFilesResponse.message);
  }
}

async function fetchAndDownloadImageGUI() {
  const response = await window.fetchAndDownloadImage();
  if (response.result) {
    alertSuccess(response.message);
  } else {
    alertError(missingFilesResponse.message);
  }
}

async function renderAnimationGUI() {
  const response = await window.main();
  if (response) {
    alertSuccess(response.message);
  } else {
    alertError(missingFilesResponse.message);
  }
}

async function checkMissingFilesGUI() {
  const response = await window.checkMissingFiles();
  if (response) {
    alertSuccess(response.message);
  } else {
    alertError(missingFilesResponse.message);
  }
}

function handleFileUpload(event) {
  selectedFile = event.target.files[0];

  if (!isFileCSV(selectedFile)) {
    alertError("Please select a CSV file");
    return;
  }

  filenameDisplay.textContent = selectedFile.name;
  renderCsvButton.style.display = "block";
}

function isFileCSV(file) {
  const acceptedCSVType = "text/csv";
  return file && file.type === acceptedCSVType;
}

function processCSV(data) {
  console.log("CSV Data:", data);
  // Add logic here to handle the CSV data
}

// Make sure file is an csv
function isFileCSV(file) {
  const acceptedCSVType = "text/csv";
  return file && file.type === acceptedCSVType;
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  });
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  });
}

// Form submit listener
csv.addEventListener("change", handleFileUpload);
form.addEventListener("submit", startRender);
renderCsvButton.addEventListener("click", startRenderWithCSV);
