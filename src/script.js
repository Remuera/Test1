document.addEventListener("DOMContentLoaded", () => {
  const downloadAllBtn = document.getElementById("downloadAllBtn");

  downloadAllBtn.addEventListener("click", async () => {
    // Prüfe, ob der Browser die File System Access API unterstützt
    if (!window.showDirectoryPicker) {
      alert(
        "Ihr Browser unterstützt die File System Access API nicht. Bitte verwenden Sie Chrome oder Edge."
      );
      return;
    }

    // Hole die Liste der Dateien aus dem Unterverzeichnis "/Dateien"
    // Hier wird angenommen, dass der Server einen Endpunkt /api/listFiles anbietet,
    // der ein JSON-Array mit Dateinamen (z. B. ["Datei1.pdf", "Datei2.docx"]) zurückliefert.
    let fileList;
    try {
      const listResponse = await fetch("/api/listFiles");
      if (!listResponse.ok)
        throw new Error("Fehler beim Laden der Dateiliste vom Server.");
      fileList = await listResponse.json();
    } catch (error) {
      console.error("Fehler beim Laden der Dateiliste:", error);
      alert("Fehler beim Laden der Dateiliste.");
      return;
    }

    if (!Array.isArray(fileList) || fileList.length === 0) {
      alert("Keine Dateien gefunden.");
      return;
    }

    // Lasse den Nutzer ein Zielverzeichnis auswählen
    let directoryHandle;
    try {
      directoryHandle = await window.showDirectoryPicker();
    } catch (error) {
      console.error("Verzeichniswahl abgebrochen oder fehlgeschlagen:", error);
      return;
    }

    // Für jede Datei: Herunterladen und im ausgewählten Zielverzeichnis speichern
    for (const fileName of fileList) {
      try {
        // Erstelle die URL für die Datei im Server-Unterverzeichnis "/Dateien"
        const fileURL = "/Dateien/" + encodeURIComponent(fileName);
        const fileResponse = await fetch(fileURL);
        if (!fileResponse.ok) {
          console.error("Fehler beim Herunterladen der Datei:", fileName);
          continue;
        }
        const fileBlob = await fileResponse.blob();

        // Erstelle oder öffne im Zielverzeichnis einen Dateihandle
        const fileHandle = await directoryHandle.getFileHandle(fileName, {
          create: true
        });
        // Erstelle einen Schreib-Stream und schreibe den Blob hinein
        const writableStream = await fileHandle.createWritable();
        await writableStream.write(fileBlob);
        await writableStream.close();
        console.log("Datei gespeichert:", fileName);
      } catch (err) {
        console.error("Fehler beim Speichern von", fileName, ":", err);
      }
    }
    alert("Alle Dateien wurden heruntergeladen.");
  });
});
