// ========================================
// UPLOAD UTILITIES - YUKI STORE
// ========================================

// Helper untuk generate nama file unik
function generateFilename(mimeType) {
    const ext = mimeType === 'image/png' ? 'png' 
              : mimeType === 'image/jpeg' || mimeType === 'image/jpg' ? 'jpg'
              : mimeType === 'application/pdf' ? 'pdf'
              : 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `payments/${timestamp}_${random}.${ext}`;
}

// Helper untuk konversi file ke base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Export untuk digunakan di payment.js jika perlu
window.YukiUpload = {
    generateFilename,
    fileToBase64
};
