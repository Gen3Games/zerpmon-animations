const fs = require("fs");

fs.readFile("data.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  const lines = data.trim().split("\n");

  lines.forEach((line) => {
    const fields = line.split(",");
    const ZerpmonNumber = fields[0];
    appendToLog(ZerpmonNumber);
  });
});

function appendToLog(ZerpmonNumber) {
  fs.appendFile("nftList.log", `${ZerpmonNumber}\n`, (err) => {
    if (err) {
      console.error("Error appending to log file:", err);
      return;
    }
    console.log(`Zerpmon Number ${ZerpmonNumber} appended to nftList.log`);
  });
}
