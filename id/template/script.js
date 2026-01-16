// Data loading and template population
let staffData = null;

// Get user identifier from URL path
function getUserFromPath() {
    const path = window.location.pathname;
    // Extract from /id/director/lauren-moore/ or /id/director/jenny-roscoe/
    const match = path.match(/\/id\/director\/([^\/]+)/);
    if (match) {
        return match[1];
    }
    // Fallback: try query parameter
    const params = new URLSearchParams(window.location.search);
    return params.get('user') || null;
}

// Load staff data from JSON
async function loadStaffData() {
    const user = getUserFromPath();
    if (!user) {
        console.error('No user identifier found in URL');
        return null;
    }
    
    try {
        // Try relative path first (from /id/director/lauren-moore/)
        let dataPath = `../../data/${user}.json`;
        
        // If that fails, try absolute path
        const response = await fetch(dataPath);
        if (!response.ok) {
            // Try alternative path
            dataPath = `/data/${user}.json`;
            const altResponse = await fetch(dataPath);
            if (!altResponse.ok) {
                throw new Error(`Failed to load data for ${user}`);
            }
            const data = await altResponse.json();
            return data;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading staff data:', error);
        return null;
    }
}

// Populate template with staff data
function populateTemplate(data) {
    if (!data) return;
    
    // Apply theme
    if (data.theme) {
        document.body.setAttribute('data-theme', data.theme);
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = `${data.name} - Next Level Cleaning Ltd`;
    }
    
    // Update profile image
    const profileImage = document.getElementById('profileImage');
    if (profileImage && data.profileImage) {
        profileImage.src = data.profileImage;
        profileImage.alt = data.name;
    }
    
    // Update name, role, company
    const staffName = document.getElementById('staffName');
    if (staffName) staffName.textContent = data.name;
    
    const staffRole = document.getElementById('staffRole');
    if (staffRole) staffRole.textContent = data.role;
    
    const companyName = document.getElementById('companyName');
    if (companyName) companyName.textContent = data.company;
    
    // Update description
    const description = document.getElementById('description');
    if (description && data.description) {
        description.textContent = data.description;
    }
    
    // Update contact links
    const callLink = document.getElementById('callLink');
    if (callLink && data.phone) {
        callLink.href = `tel:${data.phone}`;
    }
    
    const emailLink = document.getElementById('emailLink');
    if (emailLink && data.email) {
        emailLink.href = `mailto:${data.email}`;
    }
    
    const websiteLink = document.getElementById('websiteLink');
    if (websiteLink && data.website) {
        websiteLink.href = data.website;
    }
    
    // Update VCF download link
    const vcardLink = document.getElementById('vcard');
    if (vcardLink && data.contactVcf) {
        vcardLink.href = data.contactVcf;
        vcardLink.download = data.contactVcf;
    }
    
    // Update social links (if they exist in the template)
    if (data.social) {
        const socialLinks = {
            facebook: data.social.facebook,
            instagram: data.social.instagram,
            tiktok: data.social.tiktok,
            linkedin: data.social.linkedin
        };
        
        // Update social media links
        const socialAnchors = document.querySelectorAll('.actions.secondary a');
        if (socialAnchors.length >= 4) {
            if (socialLinks.facebook) socialAnchors[0].href = socialLinks.facebook;
            if (socialLinks.instagram) socialAnchors[1].href = socialLinks.instagram;
            if (socialLinks.tiktok) socialAnchors[2].href = socialLinks.tiktok;
            if (socialLinks.linkedin) socialAnchors[3].href = socialLinks.linkedin;
        }
    }
    
    // Render content stream
    if (data.contentStream && data.contentStream.length > 0) {
        renderContentStream(data.contentStream);
    }
}

// Render content stream
function renderContentStream(items) {
    const container = document.getElementById('contentStream');
    if (!container) return;
    
    container.innerHTML = '';
    
    items.forEach(item => {
        const block = document.createElement('div');
        block.className = `contentBlock ${item.type}`;
        
        switch (item.type) {
            case 'image':
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt || '';
                if (item.title) {
                    img.title = item.title;
                }
                if (item.link) {
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.appendChild(img);
                    block.appendChild(link);
                } else {
                    block.appendChild(img);
                }
                break;
                
            case 'video':
                if (item.src.includes('youtube.com') || item.src.includes('youtu.be')) {
                    // YouTube embed
                    const videoId = extractYouTubeId(item.src);
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${videoId}`;
                    iframe.allowFullscreen = true;
                    iframe.frameBorder = '0';
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                    block.appendChild(iframe);
                } else if (item.src.includes('vimeo.com')) {
                    // Vimeo embed
                    const vimeoId = extractVimeoId(item.src);
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://player.vimeo.com/video/${vimeoId}`;
                    iframe.allowFullscreen = true;
                    iframe.frameBorder = '0';
                    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
                    block.appendChild(iframe);
                } else {
                    // MP4 video or other video formats
                    const video = document.createElement('video');
                    video.src = item.src;
                    video.controls = true;
                    video.preload = 'metadata';
                    if (item.poster) {
                        video.poster = item.poster;
                    }
                    if (item.autoplay) {
                        video.autoplay = true;
                        video.muted = true; // Required for autoplay
                    }
                    if (item.loop) {
                        video.loop = true;
                    }
                    block.appendChild(video);
                }
                break;
                
            case 'mp4':
                // Direct MP4 video support
                const mp4Video = document.createElement('video');
                mp4Video.src = item.src;
                mp4Video.controls = true;
                mp4Video.preload = 'metadata';
                if (item.poster) {
                    mp4Video.poster = item.poster;
                }
                if (item.autoplay) {
                    mp4Video.autoplay = true;
                    mp4Video.muted = true;
                }
                if (item.loop) {
                    mp4Video.loop = true;
                }
                block.appendChild(mp4Video);
                break;
                
            case 'carousel':
                // Enhanced carousel implementation with navigation
                const carouselContainer = document.createElement('div');
                carouselContainer.className = 'carousel-container';
                carouselContainer.style.position = 'relative';
                
                if (item.images && item.images.length > 0) {
                    let currentIndex = 0;
                    
                    // Create image wrapper
                    const imagesWrapper = document.createElement('div');
                    imagesWrapper.className = 'carousel-images';
                    imagesWrapper.style.position = 'relative';
                    imagesWrapper.style.overflow = 'hidden';
                    imagesWrapper.style.borderRadius = '12px';
                    
                    item.images.forEach((imgSrc, index) => {
                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.style.display = index === 0 ? 'block' : 'none';
                        img.style.width = '100%';
                        img.style.height = 'auto';
                        img.style.borderRadius = '12px';
                        img.dataset.index = index;
                        imagesWrapper.appendChild(img);
                    });
                    
                    carouselContainer.appendChild(imagesWrapper);
                    
                    // Add navigation if more than one image
                    if (item.images.length > 1) {
                        // Previous button
                        const prevBtn = document.createElement('button');
                        prevBtn.className = 'carousel-nav carousel-prev';
                        prevBtn.innerHTML = '‹';
                        prevBtn.style.cssText = 'position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 24px; z-index: 10;';
                        prevBtn.addEventListener('click', () => {
                            currentIndex = (currentIndex - 1 + item.images.length) % item.images.length;
                            updateCarousel(imagesWrapper, currentIndex);
                        });
                        
                        // Next button
                        const nextBtn = document.createElement('button');
                        nextBtn.className = 'carousel-nav carousel-next';
                        nextBtn.innerHTML = '›';
                        nextBtn.style.cssText = 'position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 24px; z-index: 10;';
                        nextBtn.addEventListener('click', () => {
                            currentIndex = (currentIndex + 1) % item.images.length;
                            updateCarousel(imagesWrapper, currentIndex);
                        });
                        
                        carouselContainer.appendChild(prevBtn);
                        carouselContainer.appendChild(nextBtn);
                        
                        // Dots indicator
                        const dotsContainer = document.createElement('div');
                        dotsContainer.className = 'carousel-dots';
                        dotsContainer.style.cssText = 'display: flex; justify-content: center; gap: 8px; margin-top: 10px;';
                        item.images.forEach((_, index) => {
                            const dot = document.createElement('button');
                            dot.className = 'carousel-dot';
                            dot.style.cssText = `width: 10px; height: 10px; border-radius: 50%; border: none; background: ${index === 0 ? '#333' : '#ccc'}; cursor: pointer;`;
                            dot.addEventListener('click', () => {
                                currentIndex = index;
                                updateCarousel(imagesWrapper, currentIndex);
                                updateDots(dotsContainer, currentIndex);
                            });
                            dotsContainer.appendChild(dot);
                        });
                        carouselContainer.appendChild(dotsContainer);
                        
                        // Helper function to update carousel
                        function updateCarousel(wrapper, index) {
                            const images = wrapper.querySelectorAll('img');
                            images.forEach((img, i) => {
                                img.style.display = i === index ? 'block' : 'none';
                            });
                            updateDots(dotsContainer, index);
                        }
                        
                        function updateDots(container, activeIndex) {
                            const dots = container.querySelectorAll('.carousel-dot');
                            dots.forEach((dot, i) => {
                                dot.style.background = i === activeIndex ? '#333' : '#ccc';
                            });
                        }
                    }
                }
                block.appendChild(carouselContainer);
                break;
                
            case 'button':
                const button = document.createElement('a');
                button.href = item.link || '#';
                button.textContent = item.title || 'Click here';
                if (item.target) {
                    button.target = item.target;
                }
                block.appendChild(button);
                break;
                
            case 'banner':
                const bannerImg = document.createElement('img');
                bannerImg.src = item.src;
                bannerImg.alt = item.alt || '';
                if (item.link) {
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.appendChild(bannerImg);
                    block.appendChild(link);
                } else {
                    block.appendChild(bannerImg);
                }
                break;
        }
        
        container.appendChild(block);
    });
}

// Helper functions for video embeds
function extractYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

function extractVimeoId(url) {
    const match = url.match(/(?:vimeo\.com\/)(\d+)/);
    return match ? match[1] : null;
}

// Modal system
let m = document.getElementById("modal");
let c = document.getElementById("close");

function showModal(view) {
    if (!m) return;
    
    const qrv = document.getElementById('qrView');
    const cv = document.getElementById('copyView');
    const ki = document.getElementById('keyInfo');
    
    if (view === 'qr') {
        if (cv) cv.style.display = 'none';
        if (qrv) {
            qrv.style.display = 'block';
            qrv.style.visibility = 'visible';
            qrv.style.opacity = '1';
            qrv.style.setProperty('display', 'block', 'important');
            qrv.style.setProperty('visibility', 'visible', 'important');
        }
        // Small delay to ensure modal is fully visible before generating QR
        setTimeout(() => {
            generateQR();
        }, 100);
    } else if (view === 'share') {
        if (cv) cv.style.display = 'block';
        if (qrv) qrv.style.display = 'none';
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
    // Get current URL - ensure it's the full URL
    const currentUrl = window.location.href;
    const name = staffData?.name || document.querySelector('.name.text')?.textContent.trim() || 'Contact';
    
    const shareData = {
        title: name + ' - Next Level Cleaning Ltd',
        text: 'Connect with ' + name + ' from Next Level Cleaning Ltd',
        url: currentUrl
    };
    
    try {
        // Check if Web Share API is available and can share
        if (navigator.share) {
            // Check if the data can be shared
            if (navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Try sharing anyway (some browsers don't support canShare)
                await navigator.share(shareData);
            }
        } else {
            // Fallback to modal with copy URL
            showModal('share');
        }
    } catch (error) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
            console.error('Share error:', error);
            // Fallback to modal
            showModal('share');
        }
        // If AbortError or NotAllowedError, user cancelled - do nothing
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

// QR Code generation - generates unique QR for each employee card
function generateQR() {
    const qrContainer = document.getElementById('qr');
    if (!qrContainer) {
        console.error('QR container not found - #qr element missing');
        return;
    }
    
    // Clear existing QR code completely
    qrContainer.innerHTML = '';
    
    // Wait for QRCode library to load - check multiple times
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded, waiting...');
        qrContainer.innerHTML = '<p class="text">Loading QR code library...</p>';
        
        // Wait for library to load with multiple attempts
        let attempts = 0;
        const checkLibrary = setInterval(() => {
            attempts++;
            if (typeof QRCode !== 'undefined') {
                clearInterval(checkLibrary);
                console.log('QRCode library loaded after', attempts * 100, 'ms');
                generateQR(); // Retry now that library is loaded
            } else if (attempts > 30) {
                clearInterval(checkLibrary);
                console.error('QRCode library failed to load after 3 seconds');
                qrContainer.innerHTML = '<p class="text">QR code library not available. Please check your internet connection and refresh the page.</p>';
            }
        }, 100);
        return;
    }
    
    // TEMPLATE FILE - Should not be used in production
    // This is for development only - do not generate QR codes from template
    console.warn('WARNING: QR code generation attempted from template file. This should not be used in production.');
    qrContainer.innerHTML = '<p class="text">Template file - QR codes should not be generated from this page.</p>';
    return;
    
    // Force container visibility
    qrContainer.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; min-height: 256px !important; padding: 1rem !important; background: white !important; border-radius: 12px !important; text-align: center !important; position: relative !important;';
    
    // Generate QR code using qrcodejs library (davidshimjs - constructor method)
    try {
        // Clear container first and remove any debug styling
        qrContainer.innerHTML = '';
        qrContainer.style.cssText = 'display: block !important; visibility: visible !important; padding: 1rem !important; background: white !important; border-radius: 12px !important; text-align: center !important; min-height: 256px !important; width: 100% !important; box-sizing: border-box !important; position: relative !important; margin: 0 auto !important;';
        
        console.log('Creating QR code for:', currentUrl);
        
        // Generate QR code using constructor - this creates an img element immediately
        const qrcode = new QRCode(qrContainer, {
            text: currentUrl,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#FFFFFF',
            correctLevel: QRCode.CorrectLevel.M
        });
        
        // Check immediately what was created
        console.log('QRCode instance created. Container HTML:', qrContainer.innerHTML);
        
        // Wait a moment for the library to render, then check
        setTimeout(() => {
            // Ensure container is visible first
            qrContainer.style.setProperty('display', 'block', 'important');
            qrContainer.style.setProperty('visibility', 'visible', 'important');
            qrContainer.style.setProperty('opacity', '1', 'important');
            qrContainer.style.setProperty('min-height', '256px', 'important');
            qrContainer.style.setProperty('width', '100%', 'important');
            
            const qrImg = qrContainer.querySelector('img');
            const qrCanvas = qrContainer.querySelector('canvas');
            const qrSvg = qrContainer.querySelector('svg');
            
            console.log('After timeout - img:', qrImg, 'canvas:', qrCanvas, 'svg:', qrSvg);
            console.log('Container computed styles:', {
                display: window.getComputedStyle(qrContainer).display,
                visibility: window.getComputedStyle(qrContainer).visibility,
                width: window.getComputedStyle(qrContainer).width,
                height: window.getComputedStyle(qrContainer).height
            });
            
            if (qrSvg) {
                console.log('Found SVG element - this is the QR code!');
                // Hide canvas and img if they exist
                if (qrCanvas) qrCanvas.style.cssText = 'display: none !important;';
                if (qrImg) qrImg.style.cssText = 'display: none !important;';
                // Force visible styling on SVG
                qrSvg.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; margin: 0 auto !important; width: 256px !important; height: 256px !important; border: none !important;';
                qrSvg.setAttribute('width', '256');
                qrSvg.setAttribute('height', '256');
                console.log('QR SVG should now be visible');
            } else if (qrImg) {
                console.log('Found img element with src:', qrImg.src ? qrImg.src.substring(0, 50) + '...' : 'NO SRC');
                // Hide canvas if it exists
                if (qrCanvas) {
                    qrCanvas.style.cssText = 'display: none !important; visibility: hidden !important;';
                    console.log('Hiding canvas element');
                }
                
                // Get computed styles before changes
                const beforeDisplay = window.getComputedStyle(qrImg).display;
                const beforeVisibility = window.getComputedStyle(qrImg).visibility;
                const beforeOpacity = window.getComputedStyle(qrImg).opacity;
                console.log('Before styling - display:', beforeDisplay, 'visibility:', beforeVisibility, 'opacity:', beforeOpacity);
                
                // Remove any inline styles that might hide the img
                qrImg.removeAttribute('style');
                
                // Force visible styling on img with all possible overrides
                qrImg.style.setProperty('display', 'block', 'important');
                qrImg.style.setProperty('visibility', 'visible', 'important');
                qrImg.style.setProperty('opacity', '1', 'important');
                qrImg.style.setProperty('margin', '0 auto', 'important');
                qrImg.style.setProperty('width', '256px', 'important');
                qrImg.style.setProperty('height', '256px', 'important');
                qrImg.style.setProperty('border', 'none', 'important');
                qrImg.style.setProperty('position', 'static', 'important');
                qrImg.style.setProperty('z-index', '10', 'important');
                qrImg.style.setProperty('left', 'auto', 'important');
                qrImg.style.setProperty('right', 'auto', 'important');
                qrImg.style.setProperty('top', 'auto', 'important');
                qrImg.style.setProperty('bottom', 'auto', 'important');
                qrImg.style.setProperty('max-width', '100%', 'important');
                qrImg.style.setProperty('min-width', '256px', 'important');
                qrImg.style.setProperty('min-height', '256px', 'important');
                
                // Set attributes
                qrImg.setAttribute('width', '256');
                qrImg.setAttribute('height', '256');
                
                // Ensure container is visible too
                qrContainer.style.setProperty('display', 'block', 'important');
                qrContainer.style.setProperty('visibility', 'visible', 'important');
                qrContainer.style.setProperty('overflow', 'visible', 'important');
                
                // Force multiple reflows
                void qrImg.offsetHeight;
                void qrContainer.offsetHeight;
                
                // Check computed styles after
                const afterDisplay = window.getComputedStyle(qrImg).display;
                const afterVisibility = window.getComputedStyle(qrImg).visibility;
                const afterOpacity = window.getComputedStyle(qrImg).opacity;
                const afterWidth = window.getComputedStyle(qrImg).width;
                const afterHeight = window.getComputedStyle(qrImg).height;
                console.log('After styling - display:', afterDisplay, 'visibility:', afterVisibility, 'opacity:', afterOpacity, 'width:', afterWidth, 'height:', afterHeight);
                
                // Final check - if still not visible, try one more approach
                if (afterDisplay === 'none' || afterVisibility === 'hidden' || afterOpacity === '0') {
                    console.warn('QR img still not visible after styling, trying alternative approach');
                    qrImg.style.cssText = '';
                    qrImg.className = '';
                    qrImg.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; margin: 0 auto !important; width: 256px !important; height: 256px !important; border: none !important; position: relative !important; z-index: 9999 !important; max-width: 100% !important;';
                }
                
                // Double-check it's actually in the viewport
                const rect = qrImg.getBoundingClientRect();
                console.log('QR img bounding rect:', {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    visible: rect.width > 0 && rect.height > 0
                });
                
                // If dimensions are 0, force them
                if (rect.width === 0 || rect.height === 0) {
                    console.warn('QR img has zero dimensions, forcing size');
                    qrImg.style.setProperty('width', '256px', 'important');
                    qrImg.style.setProperty('height', '256px', 'important');
                    qrImg.setAttribute('width', '256');
                    qrImg.setAttribute('height', '256');
                }
            } else if (qrCanvas) {
                console.log('Found canvas element - making it visible');
                // Hide img if it exists
                if (qrImg) qrImg.style.cssText = 'display: none !important;';
                // Remove any inline styles from canvas
                qrCanvas.removeAttribute('style');
                qrCanvas.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; margin: 0 auto !important; width: 256px !important; height: 256px !important;';
                qrCanvas.setAttribute('width', '256');
                qrCanvas.setAttribute('height', '256');
                console.log('QR canvas should now be visible');
            } else {
                console.error('No img, canvas, or SVG found in container');
                console.log('Container HTML:', qrContainer.innerHTML);
                qrContainer.innerHTML = '<p class="text">QR code generation failed. Please refresh and try again.</p>';
            }
        }, 300);
        
    } catch (error) {
        console.error('QR code generation error:', error);
        qrContainer.innerHTML = '<p class="text">Error: ' + error.message + '</p>';
    }
}

// Initialize on window load to ensure all scripts are loaded
window.addEventListener('load', async function() {
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
    
    // Verify QRCode library is loaded - wait a bit if needed
    let checkCount = 0;
    const checkLibrary = setInterval(() => {
        checkCount++;
        if (typeof QRCode !== 'undefined') {
            console.log('✅ QRCode library loaded successfully');
            clearInterval(checkLibrary);
        } else if (checkCount > 10) {
            console.error('❌ QRCode library NOT loaded after 2 seconds');
            clearInterval(checkLibrary);
        }
    }, 200);
    
    // Load and populate staff data
    staffData = await loadStaffData();
    if (staffData) {
        populateTemplate(staffData);
    } else {
        console.warn('No staff data loaded, using template defaults');
    }
});
