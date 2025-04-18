document.addEventListener("DOMContentLoaded", function() {
    // Menüsteuerung
    const uploadMenuBtn = document.getElementById("uploadMenuBtn");
    const downloadMenuBtn = document.getElementById("downloadMenuBtn");
    const uploadSection = document.getElementById("uploadSection");
    const downloadSection = document.getElementById("downloadSection");
  
    // Anfang: Zeige Upload-Bereich
    uploadSection.classList.add("active");
    downloadSection.classList.remove("active");
  
    uploadMenuBtn.addEventListener("click", () => {
      uploadSection.classList.add("active");
      downloadSection.classList.remove("active");
    });
  
    downloadMenuBtn.addEventListener("click", () => {
      downloadSection.classList.add("active");
      uploadSection.classList.remove("active");
    });
  
    // Datei-Upload
    document.getElementById("uploadBtn").addEventListener("click", () => {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      if (!file) {
        alert("Bitte wähle eine Datei zum Hochladen aus.");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
  
      // Der Server muss einen Endpoint /upload bereitstellen, der die Datei im Unterordner `/Dateien` speichert.
      fetch("/upload", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (response.ok) {
          alert("Datei erfolgreich hochgeladen!");
        } else {
          alert("Fehler beim Hochladen der Datei.");
        }
      })
      .catch(error => {
        console.error("Upload-Fehler:", error);
        alert("Fehler beim Hochladen der Datei.");
      });
    });
  
    // Datei-Download
    document.getElementById("downloadBtn").addEventListener("click", () => {
      const fileName = document.getElementById("downloadFilename").value.trim();
      if (!fileName) {
        alert("Bitte Dateiname eingeben.");
        return;
      }
      // Erstelle die URL: Das Unterverzeichnis "/Dateien" wird relativ zum Root (oder zum Verzeichnis der index.html) angesprochen.
      const downloadUrl = "/Dateien/" + encodeURIComponent(fileName);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
  