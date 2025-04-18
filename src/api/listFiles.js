const fs = require('fs').promises;
const path = require('path');

module.exports = async function (context, req) {
  // Annahme: Der Ordner "Dateien" liegt als Geschwisterordner von "api"
  const dirPath = path.join(__dirname, "..", "Dateien");
  try {
    const files = await fs.readdir(dirPath);
    context.res = {
      // Rückgabe als JSON-Array z. B. ["Datei1.pdf", "Datei2.docx"]
      status: 200,
      body: files
    };
  } catch (error) {
    context.log.error("Fehler beim Lesen des Verzeichnisses:", error);
    context.res = {
      status: 500,
      body: { error: "Fehler beim Lesen des Verzeichnisses" }
    };
  }
};
