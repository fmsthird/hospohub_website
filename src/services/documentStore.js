// Local prototype files only. A production service must enforce access on the server.
export function validateUploadFile(file) {
  return Boolean(
    file &&
    ["application/pdf", "image/jpeg", "image/png"].includes(file.type) &&
    file.size > 0 &&
    file.size <= 10 * 1024 * 1024,
  );
}
function openStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("hospoHub.files", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function storeFile(userId, id, file) {
  const db = await openStore();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").put(file, `${userId}:${id}`);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
export async function loadFile(userId, id) {
  const db = await openStore();
  try {
    return await new Promise((resolve, reject) => {
      const request = db
        .transaction("files")
        .objectStore("files")
        .get(`${userId}:${id}`);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}
export function downloadText(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
