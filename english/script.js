document.addEventListener('DOMContentLoaded', function() {
    // Navbar Toggler
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Animate sections on scroll
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.3, // Percentage of element visible to trigger
        rootMargin: "0px 0px -50px 0px" // Shrink bottom margin to trigger slightly earlier
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate progress bars on scroll
    const skillCards = document.querySelectorAll('.skill-card');
    const skillOptions = {
        threshold: 0.5, // When 50% of the card is visible
    };

    const animateSkillBars = new IntersectionObserver(function(entries, animateSkillBars) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const progress = progressBar.dataset.progress;
                progressBar.style.width = progress + '%';
                // Stop observing after animation
                animateSkillBars.unobserve(entry.target);
            }
        });
    }, skillOptions);

    skillCards.forEach(card => {
        animateSkillBars.observe(card);
    });

    // Typewriter effect for hero subtitle (already in CSS, but can be dynamic with JS if needed)
    // For now, the CSS animation handles it. If you need dynamic text, uncomment and adjust:
    /*
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = ''; // Clear initial text
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroSubtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 70); // Typing speed
        }
    }
    // Only start typing if it's the hero subtitle, after a small delay
    if (heroSubtitle) {
        setTimeout(typeWriter, 1500); // Delay before starting
    }
    */

    // Simple parallax effect for hero section (optional, can be performance heavy)
    /*
    const heroSection = document.getElementById('home');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = -scrollPosition * 0.5 + 'px'; // Adjust multiplier for effect strength
    });
    */

    // Dynamic background video fallback if needed (e.g., for mobile optimization)
    // This is optional, as CSS starfield is a good fallback already.
    const starsVideo = document.getElementById('stars-video');
    if (starsVideo) {
        starsVideo.play().catch(error => {
            console.log("Video autoplay prevented:", error);
            // Optionally hide video and ensure CSS starfield is fully visible
            starsVideo.style.display = 'none';
            document.querySelector('.stars').style.opacity = 1;
            document.querySelector('.twinkling').style.opacity = 0.8;
            document.querySelector('.clouds').style.opacity = 0.5;
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {
    // ... (Kode yang sudah ada untuk hamburger menu, typewriter, fade-in sections, progress bar) ...

    // Discord Presence (menggunakan Lanyard API)
    // GANTI DENGAN DISCORD ID ANDA!
    const DISCORD_USER_ID = '789021305185632256'; // Temukan ID pengguna Discord Anda

    const discordPresenceContainer = document.getElementById('discord-presence-container');

    if (discordPresenceContainer && DISCORD_USER_ID !== '789021305185632256') {
        discordPresenceContainer.classList.add('loading');
        discordPresenceContainer.innerHTML = '<p>Memuat status Discord...</p>';

        fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
            .then(response => response.json())
            .then(data => {
                discordPresenceContainer.classList.remove('loading');
                if (data.success) {
                    const discordData = data.data;
                    const activities = discordData.activities;
                    const customStatus = activities.find(act => act.type === 4); // Custom Status
                    const richPresence = activities.find(act => act.type === 0 || act.type === 1 || act.type === 2); // Playing, Streaming, Listening

                    let statusText = '';
                    let activityContent = '';

                    // Get user status color
                    let statusClass = 'status-offline';
                    if (discordData.discord_status === 'online') statusClass = 'status-online';
                    else if (discordData.discord_status === 'idle') statusClass = 'status-idle';
                    else if (discordData.discord_status === 'dnd') statusClass = 'status-dnd';


                    if (customStatus && customStatus.state) {
                        statusText = `<p>${customStatus.state}</p>`;
                    } else if (discordData.listening_to_spotify) {
                        statusText = `<p>Mendengarkan Spotify: ${discordData.spotify.artist} - ${discordData.spotify.song}</p>`;
                    } else if (richPresence) {
                        activityContent += `
                            <div class="discord-activity">
                                <p>${richPresence.name}</p>
                                ${richPresence.details ? `<p>Detail: ${richPresence.details}</p>` : ''}
                                ${richPresence.state ? `<p>Status: ${richPresence.state}</p>` : ''}
                            </div>
                        `;
                    } else if (discordData.discord_status === 'online') {
                        statusText = '<p>Sedang Online</p>';
                    } else if (discordData.discord_status === 'idle') {
                        statusText = '<p>Sedang Idle</p>';
                    } else if (discordData.discord_status === 'dnd') {
                        statusText = '<p>Jangan Diganggu</p>';
                    } else {
                        statusText = '<p>Sedang Offline</p>';
                    }

                    discordPresenceContainer.innerHTML = `
                        <div class="status-wrapper">
                            <img src="https://cdn.discordapp.com/avatars/${discordData.discord_user.id}/${discordData.discord_user.avatar}.png?size=128" alt="${discordData.discord_user.username}" class="profile-pic">
                            <div class="discord-status ${statusClass}"></div>
                        </div>
                        <div class="discord-info">
                            <h4>${discordData.discord_user.global_name || discordData.discord_user.username}</h4>
                            ${statusText}
                            ${activityContent}
                        </div>
                    `;
                } else {
                    discordPresenceContainer.innerHTML = '<p>Gagal memuat status Discord atau pengguna tidak online.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching Discord presence:', error);
                discordPresenceContainer.classList.remove('loading');
                discordPresenceContainer.innerHTML = '<p>Terjadi kesalahan saat memuat status Discord.</p>';
            });

        // Set interval untuk refresh setiap 30 detik (opsional, hati-hati dengan batasan API)
        // setInterval(fetchDiscordPresence, 30000); // uncomment this line to refresh presence
    } else if (discordPresenceContainer) {
        discordPresenceContainer.innerHTML = '<p>Mohon masukkan Discord User ID Anda di script.js untuk menampilkan presence.</p>';
        discordPresenceContainer.style.justifyContent = 'center';
    }


    // ... (Sisa kode yang sudah ada) ...
});
// script.js

// === Hamburger Menu ===
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    if (hamburger && navMenu) { // Check if elements exist before manipulating
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }
}));

// === Typewriter Effect ===
function typewriterEffect(element, text, delay = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }
    type();
}

const heroSubtitle = document.querySelector('.hero-subtitle.typewriter');
if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    heroSubtitle.textContent = ''; // Clear content for typewriter effect
    typewriterEffect(heroSubtitle, originalText);
}

// === Scroll Fade-in Animation ===
const sections = document.querySelectorAll('.section.fade-in, .hero.fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the item is visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Hanya unobserve jika elemen tidak akan berubah lagi statusnya (misal: hanya fade-in sekali)
            // Untuk elemen yang mungkin masuk/keluar viewport berkali-kali (misal: header), jangan unobserve.
            if (entry.target.id !== 'home') { // Contoh: biarkan 'home' section tetap diobservasi jika ada animasi khusus
                 observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// === Progress Bar Animation ===
function animateProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const progress = bar.dataset.progress;
        const width = parseFloat(progress);
        if (!isNaN(width)) {
            bar.style.width = width + '%';
            bar.style.transition = 'width 1.5s ease-out';
            bar.style.opacity = '1';
        }
    });
}

// Observe skill section to animate progress bars when in view
const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% of skills section is visible
    skillsObserver.observe(skillsSection);
}

// === Smooth Scrolling for Navigation ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Smooth scroll to the target element
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });

            // Optional: Update URL hash without jumping
            history.pushState(null, null, targetId);
        }
    });
});


// === Initial Page Load & Language Selection Handling ===
document.addEventListener('DOMContentLoaded', () => {
    // Check if the current page is the main language selection page (index.html)
    // and if so, ensure the overlay is active.
    const languageSelectionOverlay = document.getElementById('language-selection-overlay');
    const transitionOverlay = document.getElementById('transition-overlay');

    if (languageSelectionOverlay) {
        // Only activate if on the language selection page itself
        languageSelectionOverlay.classList.add('active');
        // Ensure the body doesn't scroll while the overlay is active
        document.body.style.overflow = 'hidden';
    } else {
        // If not on the language selection page, check for transition state from previous page
        // This handles cases where a user navigates back or refreshes a language-specific page
        const isTransitioning = sessionStorage.getItem('isTransitioning');
        if (isTransitioning === 'true' && transitionOverlay) {
            transitionOverlay.classList.add('active');
            // Give a short delay before fading out the transition overlay
            setTimeout(() => {
                transitionOverlay.classList.remove('active');
                sessionStorage.removeItem('isTransitioning'); // Clean up session storage
            }, 500); // Shorter than the transition duration to avoid a blank screen
        }
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Apply fade-in for page content after potential language selection/transition
    // This is for id.html and en.html
    const mainContentElements = document.querySelectorAll('.hero, .section');
    mainContentElements.forEach(el => {
        el.classList.add('fade-in'); // Ensure base fade-in class is present
        // Add 'visible' class after a short delay to trigger fade-in animation
        setTimeout(() => {
            el.classList.add('visible');
        }, 100); // Small delay to allow CSS to register
    });

    // Animate background elements if they exist
    const starsVideo = document.getElementById('stars-video');
    if (starsVideo) {
        starsVideo.play();
    }
});


// === Language Selection Function (for index.html) ===
// This function should ideally be in index.html's <script> tag or a separate JS file
// included ONLY by index.html to avoid conflicts, but if included here,
// ensure it's called only when the elements are present.
window.selectLanguage = function(lang) {
    const languageSelectionOverlay = document.getElementById('language-selection-overlay');
    const transitionOverlay = document.getElementById('transition-overlay');

    if (languageSelectionOverlay) {
        languageSelectionOverlay.classList.remove('active'); // Hide selection overlay
        document.body.style.overflow = 'hidden'; // Keep scroll locked during transition
    }

    if (transitionOverlay) {
        transitionOverlay.classList.add('active'); // Activate transition overlay
        sessionStorage.setItem('isTransitioning', 'true'); // Mark for next page load
    }

    setTimeout(() => {
        if (lang === 'id') {
            window.location.href = 'id.html';
        } else {
            window.location.href = 'en.html';
        }
    }, 800); // Matches CSS transition-overlay duration
};


// === Add specific handlers for language switching WITHIN id.html/en.html if needed ===
// If you ever add a language switcher button *inside* id.html or en.html,
// you would add a similar function here that triggers the transition overlay
// and then redirects to the other language page.
// Example:
/*
function switchLanguageTo(targetLang) {
    const transitionOverlay = document.getElementById('transition-overlay');
    if (transitionOverlay) {
        transitionOverlay.classList.add('active');
        sessionStorage.setItem('isTransitioning', 'true');
    }
    setTimeout(() => {
        if (targetLang === 'id') {
            window.location.href = 'id.html';
        } else {
            window.location.href = 'en.html';
        }
    }, 800);
}
*/ 
// === Floating Music Player ===
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("music-toggle");
    const controls = document.getElementById("music-controls");
    const playPauseBtn = document.getElementById("play-pause");
    const audio = document.getElementById("bg-music");
    const volumeSlider = document.getElementById("volume-slider");

    let isPlaying = false;

    toggleBtn.addEventListener("click", () => {
        controls.classList.toggle("hidden");
    });

    playPauseBtn.addEventListener("click", () => {
        if (!isPlaying) {
            audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
        isPlaying = !isPlaying;
    });

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
    });
});