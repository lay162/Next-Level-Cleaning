// Data loading and template population
let staffData = null;

// Get user identifier and category from URL path
// Supports: /id/director/lauren-moore/, /id/manager/john-smith/, /id/cleaner/jane-doe/, etc.
function getUserFromPath() {
    const path = window.location.pathname;
    // Extract from /id/[category]/[employee-name]/
    // Categories: director, manager, cleaner
    // Handle both /id/director/lauren-moore/ and /id/director/lauren-moore/index.html
    const match = path.match(/\/id\/(director|manager|cleaner)\/([^\/]+)/);
    if (match && match[2]) {
        const user = match[2];
        // Make sure it's not 'template' or 'index.html'
        if (user !== 'template' && user !== 'index.html' && !user.endsWith('.html')) {
            return user;
        }
    }
    // Fallback: try query parameter
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    if (userParam && userParam !== 'template') {
        return userParam;
    }
    return null;
}

// Get category from URL path (director, manager, cleaner)
function getCategoryFromPath() {
    const path = window.location.pathname;
    // Extract category from /id/[category]/[employee-name]/
    const match = path.match(/\/id\/(director|manager|cleaner)\//);
    if (match && match[1]) {
        return match[1];
    }
    // Fallback: default to director if not found
    return 'director';
}

// Load staff data from JSON
async function loadStaffData() {
    let user = getUserFromPath();
    console.log('Loading staff data for user:', user);
    console.log('Current pathname:', window.location.pathname);
    console.log('Current URL:', window.location.href);
    
    // CRITICAL FIX: If getUserFromPath() fails, try to detect from URL directly
    if (!user) {
        console.warn('⚠️ getUserFromPath() returned null, trying direct URL detection...');
        const path = window.location.pathname;
        const href = window.location.href;
        
        // Try to extract from any category path: /id/[category]/[employee-name]/
        const categoryMatch = path.match(/\/id\/(director|manager|cleaner)\/([^\/]+)/);
        if (categoryMatch && categoryMatch[2]) {
            user = categoryMatch[2];
            console.log('✅ Detected user from URL:', user);
        } else {
            // Fallback: try to find employee name in path
            const nameMatch = path.match(/\/([a-z]+-[a-z]+)\//);
            if (nameMatch && nameMatch[1]) {
                user = nameMatch[1];
                console.log('✅ Detected user from path pattern:', user);
            } else {
                console.error('❌ No user identifier found in URL');
                console.error('Pathname:', path);
                console.error('Href:', href);
                // Template file - return null, don't default to specific employee
                return null;
            }
        }
    }
    
    if (user === 'template') {
        console.error('ERROR: Template detected - this should not happen on employee cards!');
        alert('ERROR: Template page detected. This is a development-only page.');
        return null;
    }
    
    try {
        // Try multiple paths in order of likelihood
        // CRITICAL: For local testing, try relative path first
        // For production, try absolute and full URL
        // Try multiple paths - works for both GitHub Pages and custom domain
        const baseUrl = window.location.origin;
        // Check if we're on GitHub Pages (has /Next-Level-Cleaning/ in path or github.io domain)
        const isGitHubPages = window.location.hostname.includes('github.io') || window.location.pathname.includes('/Next-Level-Cleaning/');
        const repoPath = isGitHubPages ? '/Next-Level-Cleaning' : '';
        
        const pathsToTry = [
            `${baseUrl}${repoPath}/data/${user}.json`,  // Full URL with current origin (works everywhere)
            `${baseUrl}/data/${user}.json`,             // Full URL without repo path (fallback)
            `/data/${user}.json`,                       // Absolute path (works on GitHub Pages and custom domain)
            `${repoPath}/data/${user}.json`,            // Absolute path with repo (GitHub Pages)
            `../../data/${user}.json`,                  // Relative path from /id/director/lauren-moore/ (works locally)
            `https://lay162.github.io/Next-Level-Cleaning/data/${user}.json`,  // Full GitHub Pages URL (always works)
            `https://nextlevelcleaningltd.co.uk/data/${user}.json`,  // Full production URL (works when scanned)
            `../data/${user}.json`,                     // Alternative relative (one level up)
            `./data/${user}.json`,                      // Alternative relative (same directory)
            `data/${user}.json`                         // Simple relative
        ];
        
        for (let i = 0; i < pathsToTry.length; i++) {
            const dataPath = pathsToTry[i];
            console.log(`Attempt ${i + 1}/${pathsToTry.length}: Loading data from:`, dataPath);
            
            try {
                const response = await fetch(dataPath);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ Data loaded successfully from: ${dataPath}`);
                    console.log('✅ Loaded data for:', data.name);
                    return data;
                } else {
                    console.warn(`❌ Path ${i + 1} failed with status:`, response.status, response.statusText);
                }
            } catch (fetchError) {
                console.warn(`❌ Path ${i + 1} failed with error:`, fetchError.message);
            }
        }
        
        // If all paths failed, try one more time with hardcoded fallback
        console.error('❌ ALL DATA PATHS FAILED!');
        console.error('Tried paths:', pathsToTry);
        console.error('Current URL:', window.location.href);
        
        // LAST RESORT: Hardcoded data fallback for known employees
        if (user === 'lauren-moore') {
            console.warn('⚠️ Using hardcoded fallback data for Lauren');
            return {
                name: "Lauren Moore",
                role: "Director",
                company: "Next Level Cleaning Ltd",
                email: "lauren@nextlevelcleaningltd.co.uk",
                phone: "+447700900001",
                website: "https://nextlevelcleaningltd.co.uk",
                profileImage: "profile.jpg",
                contactVcf: "contact.vcf",
                theme: "pink",
                description: "Professional commercial cleaning services",
                social: {
                    facebook: "https://www.facebook.com/NextLevelCleaningWirral",
                    instagram: "https://www.instagram.com/NextLevelCleaningWirral",
                    tiktok: "https://www.tiktok.com/@nextlevelcleaningwirral",
                    linkedin: "https://www.linkedin.com/company/nextlevelcleaningwirral"
                },
                contentStream: []
            };
        } else if (user === 'jenny-roscoe') {
            console.warn('⚠️ Using hardcoded fallback data for Jenny');
            return {
                name: "Jenny Roscoe",
                role: "Director",
                company: "Next Level Cleaning Ltd",
                email: "jenny@nextlevelcleaningltd.co.uk",
                phone: "+447700900002",
                website: "https://nextlevelcleaningltd.co.uk",
                profileImage: "profile.jpg",
                contactVcf: "contact.vcf",
                theme: "purple",
                description: "Professional commercial cleaning services",
                social: {
                    facebook: "https://www.facebook.com/NextLevelCleaningWirral",
                    instagram: "https://www.instagram.com/NextLevelCleaningWirral",
                    tiktok: "https://www.tiktok.com/@nextlevelcleaningwirral",
                    linkedin: "https://www.linkedin.com/company/nextlevelcleaningwirral"
                },
                contentStream: []
            };
        }
        
        throw new Error(`Failed to load data for ${user} from any path`);
        
    } catch (error) {
        console.error('❌ CRITICAL ERROR loading staff data:', error);
        console.error('Error details:', error.message);
        console.error('This means the page will show template defaults or error message');
        
        // LAST RESORT: Even if everything fails, try hardcoded fallback
        // Check URL one more time to determine which employee
        const path = window.location.pathname;
        const href = window.location.href;
        let fallbackUser = null;
        
        // Try to extract employee name from URL
        const categoryMatch = path.match(/\/id\/(director|manager|cleaner)\/([^\/]+)/);
        if (categoryMatch && categoryMatch[2]) {
            fallbackUser = categoryMatch[2];
        } else {
            // Can't determine employee - return null
            return null;
        }
        
        console.warn('⚠️ Using emergency fallback for:', fallbackUser);
        
        if (fallbackUser === 'lauren-moore') {
            return {
                name: "Lauren Moore",
                role: "Director",
                company: "Next Level Cleaning Ltd",
                email: "lauren@nextlevelcleaningltd.co.uk",
                phone: "+447700900001",
                website: "https://nextlevelcleaningltd.co.uk",
                profileImage: "profile.jpg",
                contactVcf: "contact.vcf",
                theme: "pink",
                description: "Professional commercial cleaning services",
                social: {
                    facebook: "https://www.facebook.com/NextLevelCleaningWirral",
                    instagram: "https://www.instagram.com/NextLevelCleaningWirral",
                    tiktok: "https://www.tiktok.com/@nextlevelcleaningwirral",
                    linkedin: "https://www.linkedin.com/company/nextlevelcleaningwirral"
                },
                contentStream: []
            };
        } else if (fallbackUser === 'jenny-roscoe') {
            return {
                name: "Jenny Roscoe",
                role: "Director",
                company: "Next Level Cleaning Ltd",
                email: "jenny@nextlevelcleaningltd.co.uk",
                phone: "+447700900002",
                website: "https://nextlevelcleaningltd.co.uk",
                profileImage: "profile.jpg",
                contactVcf: "contact.vcf",
                theme: "purple",
                description: "Professional commercial cleaning services",
                social: {
                    facebook: "https://www.facebook.com/NextLevelCleaningWirral",
                    instagram: "https://www.instagram.com/NextLevelCleaningWirral",
                    tiktok: "https://www.tiktok.com/@nextlevelcleaningwirral",
                    linkedin: "https://www.linkedin.com/company/nextlevelcleaningwirral"
                },
                contentStream: []
            };
        }
        
        return null;
    }
}

// Populate template with staff data
function populateTemplate(data) {
    if (!data) {
        console.error('populateTemplate called with no data!');
        // Show error instead of template defaults
        const staffName = document.getElementById('staffName');
        const staffRole = document.getElementById('staffRole');
        if (staffName) staffName.textContent = 'ERROR: Data not loaded';
        if (staffRole) staffRole.textContent = 'Please refresh the page';
        return;
    }
    
    console.log('Populating template with data:', data.name, data.role);
    
    // Apply theme
    if (data.theme) {
        document.body.setAttribute('data-theme', data.theme);
        console.log('Theme applied:', data.theme);
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = `${data.name} - Next Level Cleaning Ltd`;
        console.log('Page title updated:', pageTitle.textContent);
    }
    
    // Update profile image
    const profileImage = document.getElementById('profileImage');
    if (profileImage && data.profileImage) {
        profileImage.src = data.profileImage;
        profileImage.alt = data.name;
    }
    
    // Update name, role, company - CRITICAL: These must update or page shows template
    const staffName = document.getElementById('staffName');
    if (staffName) {
        // Clear any existing content first
        staffName.textContent = '';
        // Set the new name
        staffName.textContent = data.name;
        console.log('✅ Name element updated to:', data.name);
        // Force a re-render by reading and setting again
        const currentText = staffName.textContent;
        if (currentText !== data.name) {
            console.warn('⚠️ Name element text mismatch, forcing update');
            staffName.textContent = '';
            staffName.textContent = data.name;
        }
        // Final verification
        if (staffName.textContent !== data.name) {
            console.error('❌ CRITICAL: Name element still incorrect after update!');
            console.error('Expected:', data.name);
            console.error('Actual:', staffName.textContent);
            // Force one more time
            staffName.innerHTML = data.name;
        }
    } else {
        console.error('❌ CRITICAL: staffName element not found!');
    }
    
    const staffRole = document.getElementById('staffRole');
    if (staffRole) {
        // Clear any existing content first
        staffRole.textContent = '';
        // Set the new role
        staffRole.textContent = data.role;
        console.log('✅ Role element updated to:', data.role);
        // Force a re-render
        const currentText = staffRole.textContent;
        if (currentText !== data.role) {
            console.warn('⚠️ Role element text mismatch, forcing update');
            staffRole.textContent = '';
            staffRole.textContent = data.role;
        }
        // Final verification
        if (staffRole.textContent !== data.role) {
            console.error('❌ CRITICAL: Role element still incorrect after update!');
            console.error('Expected:', data.role);
            console.error('Actual:', staffRole.textContent);
            // Force one more time
            staffRole.innerHTML = data.role;
        }
    } else {
        console.error('❌ CRITICAL: staffRole element not found!');
    }
    
    const companyName = document.getElementById('companyName');
    if (companyName) companyName.textContent = data.company;
    
    // Update description
    const description = document.getElementById('description');
    if (description && data.description) {
        description.textContent = data.description;
        console.log('Description updated to:', data.description);
    }
    
    // CRITICAL: Verify all critical elements were updated
    const finalName = document.getElementById('staffName')?.textContent;
    const finalRole = document.getElementById('staffRole')?.textContent;
    
    if (finalName && (finalName === 'Loading...' || finalName === 'TEMPLATE NAME' || finalName === 'ERROR: Data not loaded')) {
        console.error('❌ CRITICAL ERROR: Name element still shows default/error!');
        console.error('Expected:', data.name);
        console.error('Actual:', finalName);
    }
    
    if (finalRole && (finalRole === 'Please wait...' || finalRole === 'TEMPLATE ROLE' || finalRole === 'Please refresh the page')) {
        console.error('❌ CRITICAL ERROR: Role element still shows default/error!');
        console.error('Expected:', data.role);
        console.error('Actual:', finalRole);
    }
    
    console.log('✅ Final verification - Name:', finalName, 'Role:', finalRole);
    
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

// QR Code display - loads pre-generated branded QR code images
function generateQR() {
    console.log('🔵 generateQR() called - loading static QR image');
    const qrContainer = document.getElementById('qr');
    if (!qrContainer) {
        console.error('QR container not found - #qr element missing');
        return;
    }
    
    // Clear existing content
    qrContainer.innerHTML = '';
    
    // Check if staff data is loaded and has qrImage field
    if (!staffData) {
        console.error('Staff data not loaded yet');
        qrContainer.innerHTML = '<p class="text">Loading employee data...</p>';
        // Try to load data if not already loaded
        loadStaffData().then(data => {
            if (data) {
                staffData = data;
                generateQR(); // Retry after data loads
            }
        });
        return;
    }
    
    // Check if employee has a QR image defined
    if (!staffData.qrImage) {
        console.warn('No QR image defined for employee:', staffData.name);
        qrContainer.innerHTML = '<p class="text">QR code not generated yet.</p>';
        return;
    }
    
    // Display the static QR code image
    try {
        qrContainer.style.cssText = 'display: block !important; visibility: visible !important; padding: 1rem !important; background: white !important; border-radius: 12px !important; text-align: center !important; min-height: 256px !important; width: 100% !important; box-sizing: border-box !important; position: relative !important; margin: 0 auto !important;';
        
        const qrImg = document.createElement('img');
        qrImg.src = staffData.qrImage;
        qrImg.alt = `${staffData.name} - QR Code`;
        qrImg.className = 'qr-static-image';
        qrImg.style.cssText = 'max-width: 100% !important; width: auto !important; height: auto !important; display: block !important; margin: 0 auto !important; border-radius: 8px !important;';
        
        // Handle image load errors
        qrImg.onerror = function() {
            console.error('Failed to load QR image:', staffData.qrImage);
            qrContainer.innerHTML = '<p class="text">QR code image not found. Please contact support.</p>';
        };
        
        qrImg.onload = function() {
            console.log('✅ QR code image loaded successfully:', staffData.qrImage);
        };
        
        qrContainer.appendChild(qrImg);
        
    } catch (error) {
        console.error('Error displaying QR code image:', error);
        qrContainer.innerHTML = '<p class="text">Error loading QR code. Please refresh and try again.</p>';
    }
}

// CRITICAL: Load data IMMEDIATELY when DOM is ready, don't wait for full page load
// This ensures data is loaded as fast as possible
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 DOM Content Loaded - Starting immediate data load...');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    // CRITICAL: Check if we're on an employee card page - should NEVER show template
    const user = getUserFromPath();
    if (!user || user === 'template') {
        console.error('❌ CRITICAL: On employee card page but user is:', user);
        const staffName = document.getElementById('staffName');
        const staffRole = document.getElementById('staffRole');
        if (staffName) staffName.textContent = 'ERROR: Invalid page';
        if (staffRole) staffRole.textContent = 'This URL is incorrect';
        return;
    }
    
    // Load data immediately
    staffData = await loadStaffData();
    if (staffData) {
        console.log('✅ Staff data loaded on DOMContentLoaded:', staffData.name);
        populateTemplate(staffData);
        
        // CRITICAL: Verify data was applied - if still showing "Loading..." or "TEMPLATE", something is wrong
        setTimeout(() => {
            const verifyName = document.getElementById('staffName')?.textContent;
            const verifyRole = document.getElementById('staffRole')?.textContent;
            if (verifyName === 'Loading...' || verifyName === 'TEMPLATE NAME' || verifyName === 'ERROR: Data not loaded') {
                console.error('❌ CRITICAL: Data loaded but page still shows default text!');
                console.error('Name element shows:', verifyName);
                console.error('Expected:', staffData.name);
                // Force update
                const nameEl = document.getElementById('staffName');
                const roleEl = document.getElementById('staffRole');
                if (nameEl) nameEl.textContent = staffData.name;
                if (roleEl) roleEl.textContent = staffData.role;
                console.log('✅ Forced update of name and role');
            }
        }, 100);
    } else {
        console.error('❌ Failed to load data on DOMContentLoaded');
        // Show error instead of template
        const staffName = document.getElementById('staffName');
        const staffRole = document.getElementById('staffRole');
        if (staffName) staffName.textContent = 'ERROR: Data not loaded';
        if (staffRole) staffRole.textContent = 'Please check console and refresh';
    }
});

// Also load on window load as backup
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
    
    // Load and populate staff data (backup - in case DOMContentLoaded didn't work)
    // Only load if data wasn't already loaded
    if (!staffData) {
        console.log('🔄 Starting data load (backup - DOMContentLoaded may have failed)...');
        staffData = await loadStaffData();
    }
    
    if (staffData) {
        console.log('✅ Staff data loaded successfully:', staffData.name);
        console.log('🔄 Populating template...');
        populateTemplate(staffData);
        console.log('✅ Template populated successfully');
        
        // CRITICAL: Force verify and update if needed
        setTimeout(() => {
            const verifyName = document.getElementById('staffName')?.textContent;
            const verifyRole = document.getElementById('staffRole')?.textContent;
            console.log('🔍 Verification - Name on page:', verifyName);
            console.log('🔍 Verification - Role on page:', verifyRole);
            
            // If still showing defaults, force update
            if (verifyName === 'Loading...' || verifyName === 'TEMPLATE NAME' || verifyName === 'ERROR: Data not loaded') {
                console.error('❌ CRITICAL: Template defaults still showing! Forcing update...');
                const nameEl = document.getElementById('staffName');
                const roleEl = document.getElementById('staffRole');
                if (nameEl) {
                    nameEl.textContent = staffData.name;
                    console.log('✅ Forced name update to:', staffData.name);
                }
                if (roleEl) {
                    roleEl.textContent = staffData.role;
                    console.log('✅ Forced role update to:', staffData.role);
                }
            }
            
            // Final check
            const finalName = document.getElementById('staffName')?.textContent;
            const finalRole = document.getElementById('staffRole')?.textContent;
            if (finalName === staffData.name && finalRole === staffData.role) {
                console.log('✅ SUCCESS: Page now shows correct data:', finalName, finalRole);
            } else {
                console.error('❌ FAILED: Page still shows incorrect data');
                console.error('Expected:', staffData.name, staffData.role);
                console.error('Actual:', finalName, finalRole);
            }
        }, 200);
    } else {
        console.error('❌ CRITICAL: No staff data loaded!');
        console.error('Current URL:', window.location.href);
        console.error('Current pathname:', window.location.pathname);
        console.error('This should NEVER happen on a production employee card!');
        
        // Show error message instead of template defaults
        const staffName = document.getElementById('staffName');
        const staffRole = document.getElementById('staffRole');
        if (staffName) {
            staffName.textContent = 'ERROR: Could not load data';
            console.log('✅ Set error message in name element');
        }
        if (staffRole) {
            staffRole.textContent = 'Please check console and refresh';
            console.log('✅ Set error message in role element');
        }
        
        // Verify error message was set
        setTimeout(() => {
            const checkName = document.getElementById('staffName')?.textContent;
            if (checkName === 'ERROR: Could not load data') {
                console.log('✅ Error message confirmed on page');
            } else {
                console.error('❌ Error message not set! Element shows:', checkName);
            }
        }, 100);
    }
});
