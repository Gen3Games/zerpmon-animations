const png = document.querySelector("#png");
const renderButton = document.querySelector("#render");
const filenameDisplay = document.querySelector("#filename");
const copyCode = document.querySelector("#copy-code");
const spinner = document.querySelector("#spinner");
let selectedFiles = null;

async function startRender(e) {
  e.preventDefault();

  try {
    spinner.style.display = "block";
    copyCode.style.display = "none";
    copyCode.addEventListener("click", () => {
      window.electronAPI.openJsonFile();
    });
    await saveFiles(selectedFiles);
    await renderAnimation();
  } catch (error) {
    console.error("Error : ", error);
  } finally {
    spinner.style.display = "none";
  }
}

function handleFileUpload(event) {
  selectedFiles = [...event.target.files];

  if (selectedFiles.length === 0) {
    alertError("No files selected");
    renderButton.style.display = "none";
    filenameDisplay.textContent = "";
    return;
  }

  const areFilesPng = Array.from(selectedFiles).every(isFilePng);
  if (!areFilesPng) {
    alertError("Please select PNG files");
    return;
  }

  filenameDisplay.textContent = selectedFiles.length + " files selected";
  renderButton.style.display = "block";
}

async function saveFiles(files) {
  if (!files || files.length === 0) {
    alertError("No files selected");
    return;
  }
  const response = await window.saveSelectedFiles(files);
  if (response.result) {
    alertSuccess(response.message);
  } else {
    alertError(response.message);
    throw new Error(response.message);
  }
}

function isFilePng(file) {
  const acceptedPngType = "image/png";
  return file && file.type === acceptedPngType;
}

async function renderAnimation() {
  const response = await window.main();
  if (response) {
    alertSuccess(response.message);
    copyJsonFileContents();
  } else {
    alertError(response.message);
  }
}

function copyJsonFileContents() {
  try {
    const fileContents = window.electronAPI.readJsonFile();
    // navigator.clipboard.writeText(fileContents);
    alertSuccess("Contents copied to clipboard!");
    copyCode.style.display = "block";
    copyCode.textContent = "Open JSON file";
  } catch (err) {
    alertError("Could not read file: " + err.message);
  }
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
png.addEventListener("change", handleFileUpload);
renderButton.addEventListener("click", startRender);
