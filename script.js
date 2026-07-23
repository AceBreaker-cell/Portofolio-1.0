document.addEventListener('DOMContentLoaded', function() {
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

    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.3, 
        rootMargin: "0px 0px -50px 0px" 
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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const skillCards = document.querySelectorAll('.skill-card');
    const skillOptions = {
        threshold: 0.5, 
    };

    const animateSkillBars = new IntersectionObserver(function(entries, animateSkillBars) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const progress = progressBar.dataset.progress;
                progressBar.style.width = progress + '%';
                animateSkillBars.unobserve(entry.target);
            }
        });
    }, skillOptions);

    skillCards.forEach(card => {
        animateSkillBars.observe(card);
    });
    const starsVideo = document.getElementById('stars-video');
    if (starsVideo) {
        starsVideo.play().catch(error => {
            console.log("Video autoplay prevented:", error);
            starsVideo.style.display = 'none';
            document.querySelector('.stars').style.opacity = 1;
            document.querySelector('.twinkling').style.opacity = 0.8;
            document.querySelector('.clouds').style.opacity = 0.5;
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {
    const DISCORD_USER_ID = '789021305185632256'; 

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

    } else if (discordPresenceContainer) {
        discordPresenceContainer.innerHTML = '<p>Mohon masukkan Discord User ID Anda di script.js untuk menampilkan presence.</p>';
        discordPresenceContainer.style.justifyContent = 'center';
    }

});
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    if (hamburger && navMenu) { 
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }
}));

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
    heroSubtitle.textContent = ''; 
    typewriterEffect(heroSubtitle, originalText);
}

// === Scroll Fade-in Animation ===
const sections = document.querySelectorAll('.section.fade-in, .hero.fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.id !== 'home') { 
                 observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

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

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 }); 
    skillsObserver.observe(skillsSection);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            history.pushState(null, null, targetId);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const languageSelectionOverlay = document.getElementById('language-selection-overlay');
    const transitionOverlay = document.getElementById('transition-overlay');

    if (languageSelectionOverlay) {
        languageSelectionOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        
        const isTransitioning = sessionStorage.getItem('isTransitioning');
        if (isTransitioning === 'true' && transitionOverlay) {
            transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                transitionOverlay.classList.remove('active');
                sessionStorage.removeItem('isTransitioning'); 
            }, 500); 
        }
        document.body.style.overflow = ''; 
    }

    const mainContentElements = document.querySelectorAll('.hero, .section');
    mainContentElements.forEach(el => {
        el.classList.add('fade-in'); 
        
        setTimeout(() => {
            el.classList.add('visible');
        }, 100); 
    });

    const starsVideo = document.getElementById('stars-video');
    if (starsVideo) {
        starsVideo.play();
    }
});

window.selectLanguage = function(lang) {
    const languageSelectionOverlay = document.getElementById('language-selection-overlay');
    const transitionOverlay = document.getElementById('transition-overlay');

    if (languageSelectionOverlay) {
        languageSelectionOverlay.classList.remove('active'); 
        document.body.style.overflow = 'hidden'; 
    }

    if (transitionOverlay) {
        transitionOverlay.classList.add('active'); 
        sessionStorage.setItem('isTransitioning', 'true'); 
    }

    setTimeout(() => {
        if (lang === 'id') {
            window.location.href = 'id.html';
        } else {
            window.location.href = 'en.html';
        }
    }, 800); 
};

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