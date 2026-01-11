// QR Code Generator for Digital Business Card

document.addEventListener('DOMContentLoaded', function() {
    const qrCanvas = document.getElementById('qr-code');
    
    if (!qrCanvas) {
        console.error('QR code canvas not found');
        return;
    }
    
    // Get current page URL for QR code
    const currentUrl = window.location.href;
    
    // Generate QR code using qrcode library
    QRCode.toCanvas(qrCanvas, currentUrl, {
        width: 200,
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
});

// Save Contact functionality
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('save-contact');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Fetch the contact.vcf file
            fetch('contact.vcf')
                .then(response => response.blob())
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
});

// Share functionality
document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.getElementById('share-card');
    
    if (shareButton) {
        shareButton.addEventListener('click', async function() {
            const currentUrl = window.location.href;
            const shareData = {
                title: document.querySelector('.person-name').textContent + ' - Next Level Cleaning Ltd',
                text: 'Connect with ' + document.querySelector('.person-name').textContent + ' from Next Level Cleaning Ltd',
                url: currentUrl
            };
            
            try {
                // Try native Web Share API
                if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                } else {
                    // Fallback to clipboard
                    await navigator.clipboard.writeText(currentUrl);
                    alert('Link copied to clipboard!');
                }
            } catch (error) {
                // Fallback to clipboard if share is cancelled or fails
                if (error.name !== 'AbortError') {
                    try {
                        await navigator.clipboard.writeText(currentUrl);
                        alert('Link copied to clipboard!');
                    } catch (clipboardError) {
                        console.error('Clipboard error:', clipboardError);
                        // Last resort: show URL in prompt
                        prompt('Copy this URL:', currentUrl);
                    }
                }
            }
        });
    }
});

