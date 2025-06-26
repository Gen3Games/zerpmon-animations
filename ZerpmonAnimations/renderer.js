const form = document.querySelector("#zerp-form");
const startInput = document.querySelector("#start");
const endInput = document.querySelector("#end");
const processCountInput = document.querySelector("#concurrency");
const csv = document.querySelector("#csv");
const renderCsvButton = document.querySelector("#render-csv");
const renderNumberButton = document.querySelector("#render-number");
const filenameDisplay = document.querySelector("#filename");
const spinner = document.querySelector("#spinner");
let selectedFile = null;

async function startRender(e) {
  e.preventDefault();
  const start = startInput.value;
  const end = endInput.value;
  const processCount = processCountInput.value;

  try {
    spinner.style.display = "block";
    renderNumberButton.disabled = true;
    await createImageChunksGUI(start, end);
    await fetchAndDownloadImageGUI();
    await renderAnimationGUI(processCount);
    await checkMissingFilesGUI();
  } catch (error) {
    console.error("Error : ", error);
  } finally {
    spinner.style.display = "none";
    renderNumberButton.disabled = false;
  }
}

async function startRenderWithCSV(event) {
  event.preventDefault();

  if (!selectedFile) {
    alertError("No CSV file selected");
    return;
  }

  const processCount = processCountInput.value;

  if (!processCount) {
    alertError("Please enter a process count");
    return;
  }

  console.log(processCount);
  spinner.style.display = "block";
  renderCsvButton.disabled = true;
  const reader = new FileReader();
  reader.onload = async function (event) {
    const csvData = event.target.result;

    try {
      await processCSVDataGUI(csvData);
      await fetchAndDownloadImageGUI();
      await renderAnimationGUI(processCount);
      await checkMissingFilesGUI();
    } catch (error) {
      console.error("Error : ", error);
    } finally {
      spinner.style.display = "none";
      renderCsvButton.disabled = false;
    }
  };
  reader.readAsText(selectedFile);
}

async function processCSVDataGUI(csvData) {
  const response = await window.createImageChunksWithCSV(csvData);
  if (response.result) {
    alertSuccess(response.message);
  } else {
    alertError(response.message);
    throw new Error(response.message);
  }
}

async function createImageChunksGUI(start, end) {
  const response = await window.createImageChunks(start, end);
  if (response.result) {
    alertSuccess(response.message);
  } else {
    alertError(response.message);
    throw new Error(response.message);
  }
}

async function fetchAndDownloadImageGUI() {
  const response = await window.fetchAndDownloadImage();
  if (response.result) {
    alertSuccess(response.message);
  } else {
    alertError(response.message);
    throw new Error(response.message);
  }
}

async function renderAnimationGUI(processCount) {
  const response = await window.main(processCount);
  if (response) {
    alertSuccess(response.message);
  } else {
    alertError(response.message);
  }
}

async function checkMissingFilesGUI() {
  const response = await window.checkMissingFiles();
  if (response) {
    alertSuccess(response.message);
  } else {
    alertError(response.message);
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
    duration: 10000,
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
