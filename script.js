/**
 * ------------------------------------------------------------------
 *   Bhaviiiiii - Script logic
 * ------------------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {
    // Prevent scrolling while loading
    document.body.classList.add("loading");

    // Initialize Components
    initLoadingScreen();
    initMouseGlow();
    initBackgroundParticles();
    initScrollEffects();
    initMusicPlayer();
    initVideoSection();
    initStarsSection();
    initFinalSection();
});

/* 
==================================================================
   1. LOADING SCREEN
==================================================================
*/
function initLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");
    const heroImage = document.getElementById("hero-img");

    // Make loading overlay screen last 6.5s to complete text sequences
    setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add("fade-out");
        if (mainContent) mainContent.classList.remove("hidden");
        document.body.classList.remove("loading");

        // Subtle scale-in effect on hero image on entry
        if (heroImage) {
            heroImage.style.transform = "scale(1)";
        }

        // Trigger hero text reveal
        setTimeout(() => {
            const reveals = document.querySelectorAll(".hero-content .text-reveal, .hero-content .text-reveal-delay-1, .hero-content .text-reveal-delay-2");
            reveals.forEach(el => el.style.opacity = "1");
            reveals.forEach(el => el.style.transform = "translateY(0)");
            reveals.forEach(el => el.style.filter = "blur(0)");
        }, 300);

        // Remove loading screen from DOM after transition
        setTimeout(() => {
            if (loadingScreen) loadingScreen.remove();
        }, 1500);
    }, 6500);
}

/* 
==================================================================
   2. INTERACTIVE MOUSE GLOW & TILT CARDS
==================================================================
*/
function initMouseGlow() {
    const mouseGlow = document.getElementById("mouse-glow");
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let isMoving = false;

    // Smooth glow trailing logic (lerp)
    function updateGlowPosition() {
        if (!mouseGlow) return;
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        
        glowX += dx * 0.08;
        glowY += dy * 0.08;

        mouseGlow.style.left = `${glowX}px`;
        mouseGlow.style.top = `${glowY}px`;

        requestAnimationFrame(updateGlowPosition);
    }
    requestAnimationFrame(updateGlowPosition);

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isMoving && mouseGlow) {
            isMoving = true;
            mouseGlow.classList.add("active");
        }
    });

    window.addEventListener("mouseout", () => {
        if (mouseGlow) mouseGlow.classList.remove("active");
        isMoving = false;
    });

    // --- 3D Tilt Card Effects ---
    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach(card => {
        const glow = card.querySelector(".card-glow");

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (glow) {
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
            }

            const width = rect.width;
            const height = rect.height;
            const centerX = width / 2;
            const centerY = height / 2;
            
            const maxRotationX = 8;
            const maxRotationY = 8;

            const rotateX = ((centerY - y) / centerY) * maxRotationX;
            const rotateY = ((x - centerX) / centerX) * maxRotationY;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
        });
    });
}

/* 
==================================================================
   3. FLOATING AMBER PARTICLES BACKGROUND
==================================================================
*/
function initBackgroundParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let particles = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 20;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.4 + 0.15;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.opacity = Math.random() * 0.4 + 0.15;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.01 + 0.005;
        }

        update() {
            this.y -= this.speedY;
            this.swayAngle += this.swaySpeed;
            this.x += this.speedX + Math.sin(this.swayAngle) * 0.15;

            if (this.y < 100) {
                this.opacity -= 0.005;
            }

            if (this.y < 0 || this.opacity <= 0 || this.x < -10 || this.x > width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = "rgba(212, 175, 55, 0.3)";
            ctx.fill();
        }
    }

    const particleCount = Math.min(60, Math.floor((width * height) / 18000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        if (!canvas.parentNode) return;
        ctx.clearRect(0, 0, width, height);
        
        const grad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, Math.max(width, height));
        grad.addColorStop(0, "#0c0c0c");
        grad.addColorStop(1, "#030303");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        ctx.shadowBlur = 0;
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/* 
==================================================================
   4. SCROLL PROGRESS, PARALLAX, AND ENTRY REVEALS
==================================================================
*/
function initScrollEffects() {
    const scrollBar = document.getElementById("scroll-progress-bar");
    const heroImage = document.getElementById("hero-img");
    const scrollIndicator = document.getElementById("scroll-indicator");

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        
        if (scrollBar) {
            scrollBar.style.width = `${scrolled}%`;
        }

        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollTop * 0.35}px) scale(${1 + scrollTop * 0.0003})`;
        }

        if (scrollIndicator) {
            if (scrollTop > 100) {
                scrollIndicator.style.opacity = "0";
                scrollIndicator.style.pointerEvents = "none";
            } else {
                scrollIndicator.style.opacity = "1";
                scrollIndicator.style.pointerEvents = "auto";
            }
        }
    });

    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", () => {
            const nextSec = document.getElementById("understanding-section");
            if (nextSec) {
                nextSec.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Scroll Reveal Observers
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const revealTitles = document.querySelectorAll(".section-title");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                
                const title = entry.target.querySelector(".section-title");
                if (title) title.classList.add("revealed");

                const starsText = entry.target.querySelector(".stars-text");
                const starsTitle = entry.target.querySelector(".stars-title");
                if (starsTitle) starsTitle.classList.add("revealed");
                if (starsText) starsText.classList.add("revealed");

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
    revealTitles.forEach(t => revealObserver.observe(t));

    // Lazy load image elements
    const lazyImages = document.querySelectorAll(".lazy-load");
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute("data-src");
                img.addEventListener("load", () => {
                    img.classList.add("loaded");
                });
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "200px 0px" });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/* 
==================================================================
   5. FLOATING MUSIC PLAYER & FADE CONTROLLERS
==================================================================
*/
function initMusicPlayer() {
    const audio = document.getElementById("bg-music");
    const toggleBtn = document.getElementById("music-toggle");
    const playIcon = document.getElementById("icon-play");
    const pauseIcon = document.getElementById("icon-pause");
    const progressCircle = document.querySelector(".progress-ring__circle");

    if (!audio || !toggleBtn) return;

    // Load saved music position from localStorage
    const savedTime = localStorage.getItem("bhavi_music_time");
    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    // Save playing position periodically
    audio.addEventListener("timeupdate", () => {
        if (!audio.paused) {
            localStorage.setItem("bhavi_music_time", audio.currentTime);
        }

        // SVG progress ring calculations
        const percentage = audio.currentTime / audio.duration;
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage * circumference);
        progressCircle.style.strokeDashoffset = isNaN(offset) ? circumference : offset;
    });

    function playAudio() {
        audio.play().then(() => {
            playIcon.classList.add("hidden");
            pauseIcon.classList.remove("hidden");
        }).catch(err => {
            console.log("Audio autoplay prevented: ", err);
        });
    }

    function pauseAudio() {
        audio.pause();
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
    }

    toggleBtn.addEventListener("click", () => {
        if (audio.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    });

    // Smooth fade controller for clashing audio tracks
    window.fadeBgMusic = function(targetVolume, durationMs) {
        clearInterval(audio.fadeInterval);
        const startVolume = audio.volume;
        const diff = targetVolume - startVolume;
        const steps = 25;
        const stepTime = durationMs / steps;
        let currentStep = 0;

        audio.fadeInterval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(0, Math.min(1, startVolume + (diff * (currentStep / steps))));
            if (currentStep >= steps) {
                clearInterval(audio.fadeInterval);
                audio.volume = targetVolume;
                if (targetVolume === 0 && !audio.paused) {
                    audio.pause();
                } else if (targetVolume > 0 && audio.paused) {
                    audio.play().catch(e => console.log("Play failed on fade in:", e));
                }
            }
        }, stepTime);
    };
}

/* 
==================================================================
   6. CINEMATIC VIDEO (AUTOPLAY / VISIBILITY / UNMUTE OVERLAY)
==================================================================
*/
function initVideoSection() {
    const video = document.getElementById("final-video");
    const overlay = document.getElementById("video-audio-overlay");
    const container = document.getElementById("video-container");

    if (!video || !container) return;

    let userInteracted = false;

    // Scroll Observer to play when visible and pause when leaving
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                attemptPlayVideo();
            } else {
                video.pause();
                // Restore background music if we scroll away
                if (!video.muted && window.fadeBgMusic) {
                    window.fadeBgMusic(0.8, 1000);
                }
            }
        });
    }, { threshold: 0.15 });

    videoObserver.observe(container);

    function attemptPlayVideo() {
        // Attempt playing unmuted first
        video.muted = false;
        video.play().then(() => {
            // Unmuted playback allowed! Hide click overlay
            overlay.classList.add("hidden");
            if (window.fadeBgMusic) {
                window.fadeBgMusic(0, 1000); // Fade out clashing music
            }
        }).catch(() => {
            // Blocked. Play muted and reveal "Tap once" overlay
            video.muted = true;
            if (overlay) overlay.classList.remove("hidden");
            video.play().catch(e => console.log("Muted play failed:", e));
        });
    }

    // Tap to unmute / toggle play handler
    container.addEventListener("click", () => {
        if (video.muted) {
            userInteracted = true;
            video.muted = false;
            if (overlay) overlay.classList.add("hidden");
            if (window.fadeBgMusic) {
                window.fadeBgMusic(0, 1000); // Fade background music completely
            }
            video.play().catch(e => console.log(e));
        } else {
            // Regular play/pause toggle when already unmuted
            if (video.paused) {
                video.play();
                if (window.fadeBgMusic) window.fadeBgMusic(0, 800);
            } else {
                video.pause();
                if (window.fadeBgMusic) window.fadeBgMusic(0.8, 800);
            }
        }
    });

    // When video completes, trigger the transition screen
    video.addEventListener("ended", () => {
        triggerOutro();
    });
}

/* 
==================================================================
   7. STARS SECTION (Canvas Stars + Twinkling Stars)
==================================================================
*/
function initStarsSection() {
    const canvas = document.getElementById("stars-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let stars = [];
    let shootingStars = [];

    window.addEventListener("resize", () => {
        if (!canvas) return;
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.2;
            this.opacity = Math.random();
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
        }

        update() {
            this.opacity += this.twinkleSpeed * this.twinkleDirection;
            if (this.opacity >= 1) {
                this.opacity = 1;
                this.twinkleDirection = -1;
            } else if (this.opacity <= 0.05) {
                this.opacity = 0.05;
                this.twinkleDirection = 1;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * (height * 0.5);
            this.length = Math.random() * 80 + 30;
            this.speedX = Math.random() * 8 + 4;
            this.speedY = Math.random() * 3 + 1.5;
            this.opacity = 1;
            this.fadeSpeed = Math.random() * 0.015 + 0.01;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            const grad = ctx.createLinearGradient(
                this.x, this.y, 
                this.x - this.length, this.y - (this.length * (this.speedY/this.speedX))
            );
            grad.addColorStop(0, `rgba(255, 238, 200, ${this.opacity})`);
            grad.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.length, this.y - (this.length * (this.speedY/this.speedX)));
            ctx.stroke();
        }
    }

    const starCount = Math.min(250, Math.floor((width * height) / 4000));
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    for (let i = 0; i < 2; i++) {
        shootingStars.push(new ShootingStar());
    }

    function animateStars() {
        const rect = canvas.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            ctx.clearRect(0, 0, width, height);

            const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
            spaceGrad.addColorStop(0, "#000000");
            spaceGrad.addColorStop(1, "#030308");
            ctx.fillStyle = spaceGrad;
            ctx.fillRect(0, 0, width, height);

            stars.forEach(s => {
                s.update();
                s.draw();
            });

            shootingStars.forEach(ss => {
                ss.update();
                ss.draw();
            });
        }
        requestAnimationFrame(animateStars);
    }
    requestAnimationFrame(animateStars);
}

/* 
==================================================================
   8. FINAL SECTION & OUTRO RESOLUTION TRANSITIONS
==================================================================
*/
let globalOutroCanvasActive = false;

function initFinalSection() {
    const btnScrollBelieve = document.getElementById("final-btn-believe");
    const btnScrollClose = document.getElementById("final-btn-close");

    const btnOutroBelieve = document.getElementById("outro-btn-believe");
    const btnOutroClose = document.getElementById("outro-btn-close");

    // Add ripples and route clicks
    setupRippleListener(btnScrollBelieve, () => triggerOutro("believe"));
    setupRippleListener(btnScrollClose, () => triggerOutro("close"));

    setupRippleListener(btnOutroBelieve, () => runFinalResolution("believe"));
    setupRippleListener(btnOutroClose, () => runFinalResolution("close"));
}

function setupRippleListener(btn, callback) {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.classList.add("btn-ripple");
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        btn.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

        setTimeout(callback, 500);
    });
}

// Unified transition to outro black screen
window.triggerOutro = function(directChoice = null) {
    const outroScreen = document.getElementById("outro-screen");
    const bgCanvas = document.getElementById("particles-canvas");
    const video = document.getElementById("final-video");

    if (!outroScreen) return;

    // Pause video & music
    if (video) video.pause();
    if (window.fadeBgMusic) {
        window.fadeBgMusic(0, 2000); // fade out completely
    }

    // Stop global particle background
    if (bgCanvas) bgCanvas.remove();

    outroScreen.classList.remove("hidden");
    outroScreen.offsetHeight; // force redraw
    outroScreen.classList.add("revealed");

    if (directChoice) {
        // Skip letter and go directly to resolution choice
        const letter = document.getElementById("outro-letter-content");
        if (letter) {
            letter.classList.add("hidden");
        }
        runFinalResolution(directChoice);
    }
};

function runFinalResolution(choice) {
    const letter = document.getElementById("outro-letter-content");
    const resBelieve = document.getElementById("resolution-believe");
    const resClose = document.getElementById("resolution-close");

    if (letter) {
        letter.classList.add("fade-out");
        setTimeout(() => {
            letter.classList.add("hidden");
        }, 1500);
    }

    setTimeout(() => {
        if (choice === "believe" && resBelieve) {
            resBelieve.classList.remove("hidden");
            resBelieve.offsetHeight;
            resBelieve.classList.add("revealed");
            runOutroParticles("believe");
        } else if (choice === "close" && resClose) {
            resClose.classList.remove("hidden");
            resClose.offsetHeight;
            resClose.classList.add("revealed");
            runOutroParticles("close");
        }
    }, 800);
}

function runOutroParticles(choice) {
    const outroCanvas = document.getElementById("outro-particles-canvas");
    if (!outroCanvas) return;
    const ctx = outroCanvas.getContext("2d");

    let oWidth = outroCanvas.width = window.innerWidth;
    let oHeight = outroCanvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        if (!outroCanvas) return;
        oWidth = outroCanvas.width = window.innerWidth;
        oHeight = outroCanvas.height = window.innerHeight;
    });

    let particles = [];
    globalOutroCanvasActive = true;

    class Sparkle {
        constructor(startX, startY) {
            this.x = startX;
            this.y = startY;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = choice === "believe" ? (Math.random() * 4.5 + 2) : (Math.random() * 2.5 + 0.8);
            
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
            
            this.size = Math.random() * 2 + 1;
            this.gravity = choice === "believe" ? -0.015 : 0.01; // Floating upward for love, falling for close
            this.opacity = 1;
            this.fade = choice === "believe" ? (Math.random() * 0.007 + 0.003) : (Math.random() * 0.009 + 0.005);
            
            this.isHeart = choice === "believe" && Math.random() > 0.75;
            this.rot = Math.random() * Math.PI * 2;
            this.rotSpeed = Math.random() * 0.04 - 0.02;
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.rot += this.rotSpeed;
            
            this.speedX *= 0.98;
            this.speedY *= 0.98;

            this.opacity -= this.fade;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.globalAlpha = Math.max(0, this.opacity);

            ctx.shadowBlur = choice === "believe" ? 12 : 5;
            ctx.shadowColor = `rgba(212, 175, 55, ${this.opacity * 0.5})`;

            if (this.isHeart) {
                // Vector heart
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-5, -5, -10, 0, -10, 5);
                ctx.bezierCurveTo(-10, 10, 0, 15, 0, 18);
                ctx.bezierCurveTo(0, 15, 10, 10, 10, 5);
                ctx.bezierCurveTo(10, 0, 5, -5, 0, 0);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fillStyle = choice === "believe" ? 
                    `rgba(212, 175, 55, ${this.opacity})` : 
                    `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Exploding burst
    const initialCount = choice === "believe" ? 140 : 80;
    for (let i = 0; i < initialCount; i++) {
        particles.push(new Sparkle(oWidth / 2, oHeight * 0.45));
    }

    // Continuous floating dust stream
    const streamInterval = setInterval(() => {
        if (!globalOutroCanvasActive) {
            clearInterval(streamInterval);
            return;
        }
        if (particles.length < 250) {
            if (choice === "believe") {
                // Rise from bottom
                particles.push(new Sparkle(Math.random() * oWidth, oHeight + 10));
            } else {
                // Muted ashes falling from top
                particles.push(new Sparkle(Math.random() * oWidth, -10));
            }
        }
    }, 140);

    function animateOutro() {
        if (!outroCanvas.parentNode) return;
        ctx.clearRect(0, 0, oWidth, oHeight);
        
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, oWidth, oHeight);

        particles.forEach((p, idx) => {
            p.update();
            p.draw();
            if (p.opacity <= 0) {
                particles.splice(idx, 1);
            }
        });

        requestAnimationFrame(animateOutro);
    }
    requestAnimationFrame(animateOutro);
}
