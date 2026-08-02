// ========================================
// PAYMENT MODAL SYSTEM
// ========================================

const modal = document.getElementById('paymentModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function openModal(content) {
    if (modalBody) modalBody.innerHTML = content;
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modal?.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Generate payment modal content
function generatePaymentHTML(productName, price) {
    const formattedPrice = 'Rp ' + price.toLocaleString('id-ID');
    
    return `
        <div class="payment-header">
            <h3>${productName}</h3>
            <div class="payment-price">${formattedPrice}</div>
        </div>
        
        <div class="payment-methods">
            <h4><i class="fas fa-wallet"></i> Metode Pembayaran</h4>
            
            <!-- QRIS -->
            <div class="payment-method">
                <div class="payment-method-header">
                    <i class="fas fa-qrcode"></i>
                    <span>QRIS</span>
                </div>
                <img src="https://yuki-regal.vercel.app/Yuki1785667267355.jpg" alt="QRIS Payment" class="qris-image">
                <p style="text-align:center; font-size:0.85rem; color:var(--text-light-muted); margin-top:8px;">
                    Scan QRIS di atas untuk membayar
                </p>
            </div>
            
            <!-- DANA -->
            <div class="payment-method">
                <div class="payment-method-header">
                    <i class="fas fa-wallet"></i>
                    <span>DANA</span>
                </div>
                <div class="copy-box">
                    <span id="danaNumber">085166370226</span>
                    <button class="btn-copy" onclick="copyToClipboard('danaNumber', this)">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
            
            <!-- GoPay -->
            <div class="payment-method">
                <div class="payment-method-header">
                    <i class="fas fa-wallet"></i>
                    <span>GoPay</span>
                </div>
                <div class="copy-box">
                    <span id="gopayNumber">085166370226</span>
                    <button class="btn-copy" onclick="copyToClipboard('gopayNumber', this)">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Upload Bukti -->
        <div class="upload-section">
            <h4><i class="fas fa-upload"></i> Upload Bukti Pembayaran</h4>
            <div class="upload-area" id="uploadArea">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Klik atau drag & drop file bukti pembayaran di sini</p>
                <small style="color:var(--text-light-muted);">Format: JPG, PNG, PDF (Max 5MB)</small>
                <input type="file" id="paymentFile" accept="image/*,.pdf">
            </div>
            <div class="upload-preview" id="uploadPreview" style="display:none;"></div>
            <div class="upload-actions" id="uploadActions" style="display:none;">
                <button class="btn btn-primary btn-full" id="btnUpload" onclick="uploadPayment('${productName}', ${price})">
                    <i class="fas fa-paper-plane"></i> Kirim Bukti Pembayaran
                </button>
            </div>
            <p class="upload-note">
                <i class="fas fa-info-circle"></i> Setelah upload, kami akan memverifikasi pembayaran dalam 5-10 menit.
            </p>
        </div>
        
        <!-- WhatsApp Contact -->
        <div class="wa-contact">
            <p><i class="fab fa-whatsapp"></i> Butuh bantuan? Hubungi kami</p>
            <a href="https://wa.me/6288246387665" target="_blank" class="btn-wa">
                <i class="fab fa-whatsapp"></i> Chat WhatsApp
            </a>
        </div>
    `;
}

// Copy to clipboard
function copyToClipboard(elementId, btn) {
    const text = document.getElementById(elementId)?.textContent;
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Tersalin';
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Tersalin';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    });
}

// File upload handling
let selectedFile = null;

function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('paymentFile');
    const preview = document.getElementById('uploadPreview');
    const actions = document.getElementById('uploadActions');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });
    
    function handleFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('File terlalu besar! Maksimal 5MB.');
            return;
        }
        
        selectedFile = file;
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            preview.innerHTML = `<div style="padding:20px;text-align:center;"><i class="fas fa-file-pdf" style="font-size:3rem;color:var(--primary);"></i><p style="margin-top:8px;">${file.name}</p></div>`;
            preview.style.display = 'block';
        }
        
        actions.style.display = 'block';
        uploadArea.style.display = 'none';
    }
}

// Upload payment proof
async function uploadPayment(productName, price) {
    const btn = document.getElementById('btnUpload');
    if (!selectedFile || !btn) return;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengupload...';
    
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('productName', productName);
        formData.append('price', price);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            btn.innerHTML = '<i class="fas fa-check"></i> Berhasil Dikirim!';
            btn.style.background = '#10B981';
            
            setTimeout(() => {
                closeModal();
                alert('Bukti pembayaran berhasil dikirim! Kami akan memverifikasi dalam 5-10 menit.');
            }, 1000);
        } else {
            throw new Error(result.message || 'Upload gagal');
        }
    } catch (err) {
        console.error(err);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Bukti Pembayaran';
        alert('Gagal mengupload: ' + err.message);
    }
}

// Bind buy buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            if (name && price) {
                openModal(generatePaymentHTML(name, price));
                // Re-init upload after modal opens
                setTimeout(initUpload, 100);
            }
        });
    });
});
