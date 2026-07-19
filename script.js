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
    initDiaryModal();
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
        loadingScreen.classList.add("fade-out");
        mainContent.classList.remove("hidden");
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
            loadingScreen.remove();
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
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        
        // Easing interpolation factor
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
        
        if (!isMoving) {
            isMoving = true;
            mouseGlow.classList.add("active");
        }
    });

    window.addEventListener("mouseout", () => {
        mouseGlow.classList.remove("active");
        isMoving = false;
    });

    // --- 3D Tilt Card Effects ---
    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach(card => {
        const glow = card.querySelector(".card-glow");

        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse coordinates relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Positioning relative spotlight glow inside card
            if (glow) {
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
            }

            // Tilt calculations
            const width = rect.width;
            const height = rect.height;
            const centerX = width / 2;
            const centerY = height / 2;
            
            // Max degrees of rotation
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
    const ctx = canvas.getContext("2d");

    let particles = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.reset();
            // Start scattered randomly on creation
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 20;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.4 + 0.15; // Slow upward drift
            this.speedX = Math.random() * 0.3 - 0.15; // Muted sway
            this.opacity = Math.random() * 0.4 + 0.15;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.01 + 0.005;
        }

        update() {
            this.y -= this.speedY;
            this.swayAngle += this.swaySpeed;
            this.x += this.speedX + Math.sin(this.swayAngle) * 0.15;

            // Fade out near the top
            if (this.y < 100) {
                this.opacity -= 0.005;
            }

            // Reset when invisible or offscreen
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

    // Spawn moderate amount of particles to avoid lagging mobile devices
    const particleCount = Math.min(60, Math.floor((width * height) / 18000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        // Exit loop if canvas is removed from DOM
        if (!canvas.parentNode) return;

        ctx.clearRect(0, 0, width, height);
        
        // Base dark radial gradient backdrop
        const grad = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, Math.max(width, height));
        grad.addColorStop(0, "#0c0c0c");
        grad.addColorStop(1, "#030303");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Render particles
        ctx.shadowBlur = 0; // Reset for canvas fill performance
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

    // Scroll progress bar
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        
        if (scrollBar) {
            scrollBar.style.width = `${scrolled}%`;
        }

        // Hero Image Parallax zoom/slide
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollTop * 0.35}px) scale(${1 + scrollTop * 0.0003})`;
        }

        // Hide scroll indicator mouse once user scrolls down
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

    // Scroll indicator click scroll to Section 2
    if (scrollIndicator) {
        scrollIndicator.addEventListener("click", () => {
            const nextSec = document.getElementById("understanding-section");
            if (nextSec) {
                nextSec.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const revealTitles = document.querySelectorAll(".section-title");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.12 // Trigger when 12% is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                
                // If it contains custom section-title reveal inside it
                const title = entry.target.querySelector(".section-title");
                if (title) {
                    title.classList.add("revealed");
                }

                // If stars text triggers
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
   5. FLOATING MUSIC PLAYER & RESUMING STATE
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
            console.log("Audio autoplay prevented or errored: ", err);
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

    // Simple fade-out mechanism for audio (helper function)
    window.fadeOutAudio = function(durationMs) {
        const startVolume = audio.volume;
        const steps = 30;
        const intervalTime = durationMs / steps;
        let currentStep = 0;

        const volumeInterval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(0, startVolume * (1 - (currentStep / steps)));
            if (currentStep >= steps) {
                clearInterval(volumeInterval);
                audio.pause();
            }
        }, intervalTime);
    };
}

/* 
==================================================================
   6. DIARY PAGE ZOOM MODAL
==================================================================
*/
function initDiaryModal() {
    const songImg = document.getElementById("song-img");
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalClose = document.getElementById("modal-close");
    const modalWrapper = document.getElementById("modal-wrapper");

    // Zoom Buttons
    const btnIn = document.getElementById("zoom-in");
    const btnOut = document.getElementById("zoom-out");
    const btnReset = document.getElementById("zoom-reset");

    if (!songImg || !modal || !modalImg) return;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX = 0, startY = 0;

    function applyTransforms() {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function resetTransforms() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        applyTransforms();
    }

    // Open Modal
    songImg.closest(".diary-page").addEventListener("click", () => {
        modalImg.src = songImg.src;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Lock scroll
        resetTransforms();
    });

    // Close Modal
    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Restore scroll
        resetTransforms();
    }

    modalClose.addEventListener("click", closeModal);
    
    // Close on background click
    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target === modalWrapper) {
            closeModal();
        }
    });

    // Close on Esc key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });

    // Zoom in/out logic
    function zoom(amount) {
        scale = Math.max(0.7, Math.min(5, scale + amount));
        applyTransforms();
    }

    btnIn.addEventListener("click", () => zoom(0.3));
    btnOut.addEventListener("click", () => zoom(-0.3));
    btnReset.addEventListener("click", resetTransforms);

    // Mouse wheel zoom support
    modalWrapper.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomStep = 0.08;
        if (e.deltaY < 0) {
            zoom(zoomStep);
        } else {
            zoom(-zoomStep);
        }
    }, { passive: false });

    // Drag / Pan Image inside Modal Wrapper
    modalWrapper.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyTransforms();
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Touch support (Pinch-to-zoom & Swipe Drag)
    let initialTouchDist = 0;

    modalWrapper.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            initialTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    });

    modalWrapper.addEventListener("touchmove", (e) => {
        if (isDragging && e.touches.length === 1) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            applyTransforms();
        } else if (e.touches.length === 2) {
            e.preventDefault();
            const currentDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const scaleFactor = currentDist / initialTouchDist;
            scale = Math.max(0.7, Math.min(5, scale * scaleFactor));
            initialTouchDist = currentDist;
            applyTransforms();
        }
    }, { passive: false });

    modalWrapper.addEventListener("touchend", () => {
        isDragging = false;
    });
}

/* 
==================================================================
   7. STARS SECTION (Canvas Stars + Twinkling Stars)
==================================================================
*/
function initStarsSection() {
    const canvas = document.getElementById("stars-canvas");
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
            this.y = Math.random() * (height * 0.5); // Spawn in upper half
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

    // Star count adjusted to canvas dimensions
    const starCount = Math.min(250, Math.floor((width * height) / 4000));
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    // Max 2 shooting stars floating around
    for (let i = 0; i < 2; i++) {
        shootingStars.push(new ShootingStar());
    }

    function animateStars() {
        // Stop animating if star section canvas is completely out of viewport
        const rect = canvas.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            ctx.clearRect(0, 0, width, height);

            // Draw deep space background gradient
            const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
            spaceGrad.addColorStop(0, "#000000");
            spaceGrad.addColorStop(1, "#030308");
            ctx.fillStyle = spaceGrad;
            ctx.fillRect(0, 0, width, height);

            // Update & Draw stars
            stars.forEach(s => {
                s.update();
                s.draw();
            });

            // Twinkle shooting stars
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
   8. FINAL SECTION BUTTON CLICK & OUTRO PARTICLES
==================================================================
*/
function initFinalSection() {
    const finalBtn = document.getElementById("final-btn");
    const outroScreen = document.getElementById("outro-screen");
    const outroCanvas = document.getElementById("outro-particles-canvas");

    if (!finalBtn || !outroScreen || !outroCanvas) return;

    finalBtn.addEventListener("click", (e) => {
        // --- BUTTON RIPPLE EFFECT ---
        const rect = finalBtn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.classList.add("btn-ripple");
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        finalBtn.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);

        // --- INITIATE OUTRO ---
        setTimeout(() => {
            // Fade out audio slowly
            if (window.fadeOutAudio) {
                window.fadeOutAudio(2500);
            }

            // Reveal Outro overlay screen
            outroScreen.classList.remove("hidden");
            // Force redraw for css opacity transition
            outroScreen.offsetHeight;
            outroScreen.classList.add("revealed");

            // Stop global page background canvas
            const bgCanvas = document.getElementById("particles-canvas");
            if (bgCanvas) bgCanvas.remove();

            // Run explosion particles
            runOutroParticles();
        }, 550);
    });

    function runOutroParticles() {
        const ctx = outroCanvas.getContext("2d");
        let oWidth = outroCanvas.width = window.innerWidth;
        let oHeight = outroCanvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            if (!outroCanvas) return;
            oWidth = outroCanvas.width = window.innerWidth;
            oHeight = outroCanvas.height = window.innerHeight;
        });

        let particles = [];

        class Sparkle {
            constructor(startX, startY) {
                this.x = startX;
                this.y = startY;
                
                // Explode outwards radially
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1.5;
                
                this.speedX = Math.cos(angle) * speed;
                this.speedY = Math.sin(angle) * speed;
                
                this.size = Math.random() * 2 + 1;
                this.gravity = 0.02;
                this.opacity = 1;
                this.fade = Math.random() * 0.008 + 0.004;
                
                // Random heart or circle
                this.isHeart = Math.random() > 0.85;
                this.rot = Math.random() * Math.PI * 2;
                this.rotSpeed = Math.random() * 0.05 - 0.025;
            }

            update() {
                this.speedY += this.gravity;
                this.x += this.speedX;
                this.y += this.speedY;
                this.rot += this.rotSpeed;
                
                // Slowly decay drift speed
                this.speedX *= 0.98;
                this.speedY *= 0.98;

                this.opacity -= this.fade;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rot);
                ctx.globalAlpha = Math.max(0, this.opacity);

                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(212, 175, 55, ${this.opacity * 0.5})`;

                if (this.isHeart) {
                    // Draw a vector heart
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(-5, -5, -10, 0, -10, 5);
                    ctx.bezierCurveTo(-10, 10, 0, 15, 0, 18);
                    ctx.bezierCurveTo(0, 15, 10, 10, 10, 5);
                    ctx.bezierCurveTo(10, 0, 5, -5, 0, 0);
                    ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                    ctx.fill();
                } else {
                    // Draw clean sparkles
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = Math.random() > 0.5 ? 
                        `rgba(212, 175, 55, ${this.opacity})` : 
                        `rgba(255, 255, 255, ${this.opacity})`;
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        // Generate immediate burst center screen, then stream floating stars
        const initialCount = 120;
        for (let i = 0; i < initialCount; i++) {
            particles.push(new Sparkle(oWidth / 2, oHeight * 0.45));
        }

        // Continuous streaming floating upwards particles (like ashes/dust in wind)
        const streamInterval = setInterval(() => {
            if (particles.length < 250) {
                // Spawn a few from bottom
                particles.push(new Sparkle(Math.random() * oWidth, oHeight + 10));
            }
        }, 120);

        function animateOutro() {
            ctx.clearRect(0, 0, oWidth, oHeight);
            
            // Clean absolute black overlay backdrop
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
        
        // Safety timeout to clean up interval streamer after 1 minute
        setTimeout(() => {
            clearInterval(streamInterval);
        }, 60000);
    }
}
