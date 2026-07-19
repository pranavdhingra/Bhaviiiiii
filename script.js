/**
 * ------------------------------------------------------------------
 *   Bhaviiiiii - Script logic (Storytelling, Safari & Web3Forms Update)
 * ------------------------------------------------------------------
 */

// REPLACE THIS WITH YOUR WEB3FORMS ACCESS KEY (e.g. "12345678-abcd-1234-abcd-1234567890ab")
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

document.addEventListener("DOMContentLoaded", () => {
    // Prevent scrolling while loading
    document.body.classList.add("loading");

    // Initialize Components
    initLoadingScreen();
    initMouseGlow();
    initBackgroundParticles();
    initScrollEffects();
    initFavouritePictureSequence();
    initDiaryModal();
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

    setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add("fade-out");
        if (mainContent) mainContent.classList.remove("hidden");
        document.body.classList.remove("loading");

        if (heroImage) {
            heroImage.style.transform = "scale(1)";
        }

        setTimeout(() => {
            const reveals = document.querySelectorAll(".hero-content .text-reveal, .hero-content .text-reveal-delay-1, .hero-content .text-reveal-delay-2");
            reveals.forEach(el => {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
                el.style.filter = "blur(0)";
            });
        }, 300);

        setTimeout(() => {
            if (loadingScreen) loadingScreen.remove();
        }, 1500);
    }, 6500);
}

/* 
==================================================================
   2. INTERACTIVE MOUSE GLOW
==================================================================
*/
function initMouseGlow() {
    const mouseGlow = document.getElementById("mouse-glow");
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let isMoving = false;

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
            this.size = Math.random() * 2.2 + 0.4;
            this.speedY = Math.random() * 0.35 + 0.12;
            this.speedX = Math.random() * 0.25 - 0.125;
            this.opacity = Math.random() * 0.35 + 0.15;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.01 + 0.004;
        }

        update() {
            this.y -= this.speedY;
            this.swayAngle += this.swaySpeed;
            this.x += this.speedX + Math.sin(this.swayAngle) * 0.12;

            if (this.y < 100) {
                this.opacity -= 0.004;
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
            ctx.shadowColor = "rgba(212, 175, 55, 0.25)";
            ctx.fill();
        }
    }

    const particleCount = Math.min(50, Math.floor((width * height) / 22000));
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
            const nextSec = document.getElementById("chapter-1-section");
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
        threshold: 0.08
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
                    
                    // Assign loaded source as blurred background strictly on blurred-bg-container items
                    const blurredBg = img.closest(".blurred-bg-container");
                    if (blurredBg) {
                        blurredBg.style.backgroundImage = `url('${img.src}')`;
                    }
                    
                    // Section 6 background synchronization
                    if (img.id === "fav-pic-img") {
                        const bg = document.getElementById("fav-pic-bg");
                        if (bg) {
                            bg.style.backgroundImage = `url('${img.src}')`;
                            bg.style.opacity = "1";
                        }
                    }
                });
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "250px 0px" });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/* 
==================================================================
   5. MY FAVOURITE PICTURE SEQUENCE (SECTION 6)
==================================================================
*/
function initFavouritePictureSequence() {
    const favSection = document.getElementById("fav-picture-section");
    const text1 = document.getElementById("fav-text-1");
    const text2 = document.getElementById("fav-text-2");

    if (!favSection || !text1 || !text2) return;

    let sequenceTriggered = false;

    const favObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !sequenceTriggered) {
                sequenceTriggered = true;
                runTextSequence();
            }
        });
    }, { threshold: 0.35 });

    favObserver.observe(favSection);

    function runTextSequence() {
        setTimeout(() => {
            text1.classList.add("active");
        }, 1200);

        setTimeout(() => {
            text1.classList.remove("active");
        }, 7200);

        setTimeout(() => {
            text2.classList.add("active");
        }, 8700);
    }
}

/* 
==================================================================
   6. DIARY STACKED PAGES ZOOM MODAL (SECTION 7)
==================================================================
*/
function initDiaryModal() {
    const pages = document.querySelectorAll(".diary-open-image");
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalClose = document.getElementById("modal-close");
    const modalWrapper = document.getElementById("modal-wrapper");

    const btnIn = document.getElementById("zoom-in");
    const btnOut = document.getElementById("zoom-out");
    const btnReset = document.getElementById("zoom-reset");

    if (pages.length === 0 || !modal || !modalImg) return;

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

    pages.forEach(page => {
        page.closest(".diary-open-page").addEventListener("click", () => {
            modalImg.src = page.src;
            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            resetTransforms();
        });
    });

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        resetTransforms();
    }

    modalClose.addEventListener("click", closeModal);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target === modalWrapper) {
            closeModal();
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });

    function zoom(amount) {
        scale = Math.max(0.7, Math.min(5, scale + amount));
        applyTransforms();
    }

    btnIn.addEventListener("click", () => zoom(0.3));
    btnOut.addEventListener("click", () => zoom(-0.3));
    btnReset.addEventListener("click", resetTransforms);

    modalWrapper.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomStep = 0.08;
        if (e.deltaY < 0) {
            zoom(zoomStep);
        } else {
            zoom(-zoomStep);
        }
    }, { passive: false });

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
   7. FINAL VIDEO SCROLL CONTROLS & AUTO-END TIMEOUT
==================================================================
*/
function initVideoSection() {
    const video = document.getElementById("final-video");
    const overlay = document.getElementById("video-audio-overlay");
    const container = document.getElementById("video-container");

    if (!video || !container) return;

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                attemptPlayVideo();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.15 });

    videoObserver.observe(container);

    function attemptPlayVideo() {
        video.muted = false;
        video.play().then(() => {
            overlay.classList.add("hidden");
        }).catch(() => {
            video.muted = true;
            if (overlay) overlay.classList.remove("hidden");
            video.play().catch(e => console.log("Muted play blocked:", e));
        });
    }

    container.addEventListener("click", () => {
        if (video.muted) {
            video.muted = false;
            if (overlay) overlay.classList.add("hidden");
            video.play().catch(e => console.log(e));
        } else {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    });

    video.addEventListener("ended", () => {
        setTimeout(() => {
            triggerOutro();
        }, 2000);
    });
}

/* 
==================================================================
   8. STARS SECTION
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
   9. OUTRO RESOLUTIONS (WITH SILENT WEB3FORMS INTEGRATION)
==================================================================
*/
let globalOutroCanvasActive = false;

function initFinalSection() {
    const btnScrollBelieve = document.getElementById("final-btn-believe");
    const btnScrollClose = document.getElementById("final-btn-close");

    const btnOutroBelieve = document.getElementById("outro-btn-believe");
    const btnOutroClose = document.getElementById("outro-btn-close");

    // Positive flows
    setupRippleListener(btnScrollBelieve, () => triggerOutro("believe"));
    setupRippleListener(btnOutroBelieve, () => runFinalResolution("believe"));

    // Closure flows wrapped in background email dispatcher
    setupRippleListener(btnScrollClose, () => {
        submitCloseFeedback(() => {
            triggerOutro("close");
        });
    });

    setupRippleListener(btnOutroClose, () => {
        submitCloseFeedback(() => {
            runFinalResolution("close");
        });
    });

    // FaceTime action fallback click bindings
    const facetimeBtn = document.getElementById("facetime-btn");
    if (facetimeBtn) {
        facetimeBtn.addEventListener("click", () => {
            window.location.href = "facetime://9996500577";
            
            setTimeout(() => {
                const waBtn = document.getElementById("facetime-message-btn");
                if (waBtn) {
                    waBtn.classList.remove("hidden");
                    waBtn.offsetHeight;
                    waBtn.classList.add("revealed");
                }
            }, 1500);
        });
    }
}

/**
 * Silent Web3Forms API background submit helper
 */
function submitCloseFeedback(callback) {
    const requestData = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "Bhavi Website Response",
        message: 'The visitor clicked "Close This Chapter".',
        time: new Date().toLocaleString(),
        device: navigator.userAgent,
        page: window.location.href
    };

    let completed = false;
    function proceed() {
        if (!completed) {
            completed = true;
            callback();
        }
    }

    // Safety timeout: If submission hangs or takes too long, resolve anyway
    const safetyTimeout = setTimeout(() => {
        console.log("Web3Forms submission safety timeout reached. Proceeding...");
        proceed();
    }, 1200);

    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Web3Forms success:", data);
        clearTimeout(safetyTimeout);
        proceed();
    })
    .catch(err => {
        console.error("Web3Forms submission error:", err);
        clearTimeout(safetyTimeout);
        proceed();
    });
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

window.triggerOutro = function(directChoice = null) {
    const outroScreen = document.getElementById("outro-screen");
    const bgCanvas = document.getElementById("particles-canvas");
    const video = document.getElementById("final-video");

    if (!outroScreen) return;

    if (video) video.pause();
    if (bgCanvas) bgCanvas.remove();

    outroScreen.classList.remove("hidden");
    outroScreen.offsetHeight;
    outroScreen.classList.add("revealed");

    if (directChoice) {
        const letter = document.getElementById("outro-letter-content");
        if (letter) {
            letter.classList.add("hidden");
        }
        runFinalResolution(directChoice);
    } else {
        runCinematicLetterSequence();
    }
};

function runCinematicLetterSequence() {
    const seq1 = document.getElementById("outro-text-seq-1");
    const seq2 = document.getElementById("outro-text-seq-2");
    const seq3 = document.getElementById("outro-text-seq-3");
    const seq4 = document.getElementById("outro-text-seq-4");

    if (!seq1 || !seq2 || !seq3 || !seq4) return;

    seq1.classList.add("active");

    setTimeout(() => {
        seq1.classList.remove("active");
        seq1.classList.add("hidden-fade");
    }, 9200);

    setTimeout(() => {
        seq2.classList.remove("hidden");
        seq2.offsetHeight;
        seq2.classList.add("active");
    }, 10700);

    setTimeout(() => {
        seq2.classList.remove("active");
        seq2.classList.add("hidden-fade");
    }, 16700);

    setTimeout(() => {
        seq3.classList.remove("hidden");
        seq3.offsetHeight;
        seq3.classList.add("active");
    }, 18200);

    setTimeout(() => {
        seq3.classList.remove("active");
        seq3.classList.add("hidden-fade");
    }, 26200);

    setTimeout(() => {
        seq4.classList.remove("hidden");
        seq4.offsetHeight;
        seq4.classList.add("active");
        
        const buttons = seq4.querySelector(".outro-buttons");
        if (buttons) {
            buttons.style.opacity = "1";
            buttons.style.transform = "translateY(0)";
        }
    }, 27700);
}

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

            setTimeout(() => {
                const actions = document.getElementById("facetime-actions");
                if (actions) {
                    actions.classList.remove("hidden");
                    actions.offsetHeight;
                    actions.classList.add("revealed");
                }
            }, 2000);

            setTimeout(() => {
                const loveMsg = document.getElementById("believe-love-msg");
                if (loveMsg) {
                    loveMsg.classList.remove("hidden");
                    loveMsg.offsetHeight;
                    loveMsg.classList.add("revealed");
                }
            }, 4500);

        } else if (choice === "close" && resClose) {
            resClose.classList.remove("hidden");
            resClose.offsetHeight;
            resClose.classList.add("revealed");
            runOutroParticles("close");

            setTimeout(() => {
                const textWrapper = document.getElementById("close-text-wrapper");
                if (textWrapper) {
                    textWrapper.classList.add("fade-out");
                    
                    setTimeout(() => {
                        textWrapper.classList.add("hidden");
                        
                        setTimeout(() => {
                            const loveMsg = document.getElementById("close-love-msg");
                            if (loveMsg) {
                                loveMsg.classList.remove("hidden");
                                loveMsg.offsetHeight;
                                loveMsg.classList.add("revealed");
                            }
                        }, 2000);

                    }, 1800);
                }
            }, 3500);
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
            this.gravity = choice === "believe" ? -0.015 : 0.01;
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

    const initialCount = choice === "believe" ? 140 : 80;
    for (let i = 0; i < initialCount; i++) {
        particles.push(new Sparkle(oWidth / 2, oHeight * 0.45));
    }

    const streamInterval = setInterval(() => {
        if (!globalOutroCanvasActive) {
            clearInterval(streamInterval);
            return;
        }
        if (particles.length < 250) {
            if (choice === "believe") {
                particles.push(new Sparkle(Math.random() * oWidth, oHeight + 10));
            } else {
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
