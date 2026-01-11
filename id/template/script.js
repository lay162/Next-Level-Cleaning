// SmartVCard-Style Digital Business Card - Template Script

// ============================================
// Modal System
// ============================================

const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const qrView = document.getElementById('qr-view');
const shareView = document.getElementById('share-view');
const shareBtn = document.getElementById('share-btn');
const qrBtn = document.getElementById('qr-btn');
const copyUrlBtn = document.getElementById('copy-url-btn');
const shareUrlInput = document.getElementById('share-url-input');
const copySuccess = document.getElementById('copy-success');

// Show modal
function showModal(view) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (view === 'qr') {
        qrView.style.display = 'block';
        shareView.style.display = 'none';
        generateQRCode();
    } else if (view === 'share') {
        qrView.style.display = 'none';
        shareView.style.display = 'block';
        shareUrlInput.value = window.location.href;
        copySuccess.style.display = 'none';
    }
}

// Hide modal
function hideModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Modal event listeners
if (modalClose) {
    modalClose.addEventListener('click', hideModal);
}

if (modalBackdrop) {
    modalBackdrop.addEventListener('click', hideModal);
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        hideModal();
    }
});

// ============================================
// QR Code Generation
// ============================================

function generateQRCode() {
    const qrCanvas = document.getElementById('qr-code');
    if (!qrCanvas) return;
    
    const currentUrl = window.location.href;
    
    // Clear existing QR code
    qrCanvas.width = 0;
    qrCanvas.height = 0;
    
    // Generate QR code
    QRCode.toCanvas(qrCanvas, currentUrl, {
        width: 280,
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

// QR button event listener
if (qrBtn) {
    qrBtn.addEventListener('click', function() {
        showModal('qr');
    });
}

// ============================================
// Share System
// ============================================

async function handleShare() {
    const currentUrl = window.location.href;
    const personName = document.querySelector('.profile-name')?.textContent || 'Contact';
    const shareData = {
        title: personName + ' - Next Level Cleaning Ltd',
        text: 'Connect with ' + personName + ' from Next Level Cleaning Ltd',
        url: currentUrl
    };
    
    try {
        // Try native Web Share API
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
            // Fallback to modal
            showModal('share');
        }
    } catch (error) {
        // User cancelled or error - show modal fallback
        if (error.name !== 'AbortError') {
            showModal('share');
        }
    }
}

// Share button event listener
if (shareBtn) {
    shareBtn.addEventListener('click', handleShare);
}

// Copy URL functionality
if (copyUrlBtn) {
    copyUrlBtn.addEventListener('click', async function() {
        const url = shareUrlInput.value;
        
        try {
            await navigator.clipboard.writeText(url);
            copySuccess.style.display = 'block';
            
            // Hide success message after 3 seconds
            setTimeout(function() {
                copySuccess.style.display = 'none';
            }, 3000);
        } catch (error) {
            console.error('Clipboard error:', error);
            // Fallback: select text
            shareUrlInput.select();
            shareUrlInput.setSelectionRange(0, 99999);
            alert('URL selected. Press Ctrl+C to copy.');
        }
    });
}

// ============================================
// Save Contact (VCF Download)
// ============================================

const saveContactBtn = document.getElementById('save-contact-btn');

if (saveContactBtn) {
    saveContactBtn.addEventListener('click', function() {
        // Fetch the contact.vcf file
        fetch('contact.vcf')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch contact file');
                }
                return response.blob();
            })
            .then(blob => {
                // Create download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'contact.vcf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error downloading contact:', error);
                alert('Error downloading contact. Please try again.');
            });
    });
}

// ============================================
// Attachments Engine
// ============================================

const attachmentsSection = document.getElementById('attachments-section');

// Attachments engine is ready for future content
// This structure allows adding:
// - Image blocks
// - Embedded videos (Vimeo, YouTube, MP4)
// - Image carousels / sliders
// - Promotional panels
// - External links
// - Downloadable files

// Example function to add content blocks (for future use)
function addAttachmentBlock(type, data) {
    if (!attachmentsSection) return;
    
    const block = document.createElement('div');
    block.className = `attachment-block attachment-${type}`;
    
    // Implementation would go here based on type
    // For now, this is just the structure
    
    attachmentsSection.appendChild(block);
    return block;
}

// Initialize attachments section (ready for future content)
if (attachmentsSection) {
    // Attachments section is ready
    // Content can be added dynamically or via HTML
}

// ============================================
// Initialize on DOM Load
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // All initialization is done via event listeners above
    // This ensures everything is ready when DOM is loaded
    console.log('Digital Business Card initialized');
});

