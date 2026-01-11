// Modal system
let m = document.getElementById("modal");
let c = document.getElementById("close");

function showModal(view) {
    if (!m) return;
    
    if (view === 'qr') {
        document.getElementById('copyView').style.display = 'none';
        document.getElementById('qrView').style.display = 'block';
        generateQRCode();
    } else if (view === 'share') {
        document.getElementById('copyView').style.display = 'block';
        document.getElementById('qrView').style.display = 'none';
    }
    
    m.style.visibility = 'visible';
    m.style.opacity = '1';
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    if (!m) return;
    m.style.visibility = 'hidden';
    m.style.opacity = '0';
    document.body.style.overflow = '';
}

if (c) {
    c.addEventListener('click', function(e) {
        e.preventDefault();
        hideModal();
    });
}

if (m) {
    m.addEventListener('click', function(e) {
        if (e.target === m) {
            hideModal();
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && m && m.style.visibility === 'visible') {
        hideModal();
    }
});

// Header controls
let s = document.getElementById("share");
let sqr = document.getElementById("showQR");

if (s) {
    s.addEventListener('click', function(e) {
        e.preventDefault();
        handleShare();
    });
}

if (sqr) {
    sqr.addEventListener('click', function(e) {
        e.preventDefault();
        showModal('qr');
    });
}

// Share functionality
async function handleShare() {
    const currentUrl = window.location.href;
    const name = document.querySelector('.name.text')?.textContent.trim() || 'Contact';
    const shareData = {
        title: name + ' - Next Level Cleaning Ltd',
        text: 'Connect with ' + name + ' from Next Level Cleaning Ltd',
        url: currentUrl
    };
    
    try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
            showModal('share');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            showModal('share');
        }
    }
}

// Copy URL functionality
let copyBtn = document.getElementById("copyURL");
if (copyBtn) {
    copyBtn.addEventListener('click', async function() {
        const url = window.location.href;
        
        try {
            await navigator.clipboard.writeText(url);
            this.innerHTML = '<div class="icon action"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg></div><span class="action">Copied!</span>';
            
            setTimeout(() => {
                this.innerHTML = '<div class="icon action"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div><span class="action">Copy URL</span>';
            }, 2000);
        } catch (error) {
            console.error('Clipboard error:', error);
            // Fallback
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            
            this.innerHTML = '<div class="icon action"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg></div><span class="action">Copied!</span>';
            
            setTimeout(() => {
                this.innerHTML = '<div class="icon action"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></div><span class="action">Copy URL</span>';
            }, 2000);
        }
    });
}

// QR Code generation
function generateQRCode() {
    const qrContainer = document.getElementById('qr');
    if (!qrContainer) return;
    
    const currentUrl = window.location.href;
    
    // Clear existing QR code
    qrContainer.innerHTML = '';
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    qrContainer.appendChild(canvas);
    
    // Generate QR code
    QRCode.toCanvas(canvas, currentUrl, {
        width: 256,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
    }, function(error) {
        if (error) {
            console.error('QR code generation error:', error);
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial modal state
    if (m) {
        m.style.visibility = 'hidden';
        m.style.opacity = '0';
    }
    
    // Hide copyView by default
    const copyView = document.getElementById('copyView');
    if (copyView) {
        copyView.style.display = 'none';
    }
});
