/**
 * Ngoăn - Trái Cây Gọt Sẵn: Visual Effects & Sound Engine
 * Floating Fruit Parallax, Juice Splashes, Audio Synthesizer
 */

// --- Web Audio API Sound Synthesizer (No external audio files needed) ---
class NgoanSoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Playful bubble/pop sound
    playPop() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {
            console.warn(e);
        }
    }

    // Crunchy fresh fruit bite sound
    playCrunch() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            // Generate crisp frequency burst
            const bufferSize = this.ctx.sampleRate * 0.08;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2200, now);
            filter.Q.setValueAtTime(3, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch (e) {
            console.warn(e);
        }
    }

    // Juicy splash sound
    playSplash() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.18);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {
            console.warn(e);
        }
    }

    // Success celebration chime
    playSuccess() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, index) => {
                const now = this.ctx.currentTime + index * 0.08;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.35);
            });
        } catch (e) {
            console.warn(e);
        }
    }
}

window.ngoanSound = new NgoanSoundEngine();

// --- Floating Fruit Physics & Background Canvas ---
class FloatingFruits {
    constructor() {
        this.canvas = document.getElementById('fruitCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.splashes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;
        this.fruitIcons = ['🍉', '🥝', '🥭', '🍓', '🍇', '🍍', '🍊', '🥑', '🍃', '✨'];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Spawn ambient floating fruits
        const count = window.innerWidth < 768 ? 14 : 28;
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(true));
        }

        // Mouse Parallax
        window.addEventListener('mousemove', (e) => {
            this.targetMouseX = (e.clientX - window.innerWidth / 2) * 0.04;
            this.targetMouseY = (e.clientY - window.innerHeight / 2) * 0.04;
        });

        // Click juice splash
        window.addEventListener('click', (e) => {
            this.createClickSplash(e.clientX, e.clientY);
        });

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(randomY = false) {
        const icon = this.fruitIcons[Math.floor(Math.random() * this.fruitIcons.length)];
        return {
            x: Math.random() * this.canvas.width,
            y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 40,
            size: Math.random() * 22 + 18,
            speedY: -(Math.random() * 0.8 + 0.3),
            speedX: (Math.random() - 0.5) * 0.6,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.45 + 0.25,
            icon: icon,
            oscillationOffset: Math.random() * Math.PI * 2,
            oscillationSpeed: Math.random() * 0.02 + 0.01,
            depth: Math.random() * 0.8 + 0.2
        };
    }

    createClickSplash(x, y) {
        const colors = ['#22C55E', '#FF4B6E', '#FF9F1C', '#FACC15', '#A855F7', '#38BDF8'];
        const numDroplets = 12;

        for (let i = 0; i < numDroplets; i++) {
            const angle = (Math.PI * 2 / numDroplets) * i + (Math.random() * 0.4 - 0.2);
            const speed = Math.random() * 5 + 2.5;
            this.splashes.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                life: 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Smooth parallax
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Render ambient floating fruits
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.oscillationOffset) * 0.4;
            p.oscillationOffset += p.oscillationSpeed;
            p.rotation += p.rotSpeed;

            // Apply parallax based on depth
            const renderX = p.x + this.mouseX * p.depth * 10;
            const renderY = p.y + this.mouseY * p.depth * 10;

            if (p.y < -50 || p.x < -60 || p.x > this.canvas.width + 60) {
                this.particles[i] = this.createParticle(false);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(renderX, renderY);
            this.ctx.rotate(p.rotation);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.font = `${p.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.icon, 0, 0);
            this.ctx.restore();
        }

        // Render juice splashes
        for (let i = this.splashes.length - 1; i >= 0; i--) {
            const s = this.splashes[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vy += 0.15; // gravity
            s.vx *= 0.96;
            s.life -= 0.035;

            if (s.life <= 0) {
                this.splashes.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.radius * s.life, 0, Math.PI * 2);
            this.ctx.fillStyle = s.color;
            this.ctx.globalAlpha = s.life * 0.8;
            this.ctx.fill();
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// 3D Tilt Card Effect
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'transform 0.1s ease-out';
        });
    });
}

// Flying fruit animation towards the floating cart badge
function animateFlyToCart(sourceElement) {
    const cartBtn = document.getElementById('floatingCartBtn');
    if (!cartBtn || !sourceElement) return;

    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = cartBtn.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.className = 'flyer-fruit';
    flyer.innerHTML = '🍉';
    flyer.style.cssText = `
        position: fixed;
        left: ${sourceRect.left + sourceRect.width / 2}px;
        top: ${sourceRect.top + sourceRect.height / 2}px;
        font-size: 28px;
        z-index: 99999;
        pointer-events: none;
        transition: all 0.75s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));
    `;

    document.body.appendChild(flyer);

    // Trigger animation next frame
    requestAnimationFrame(() => {
        flyer.style.left = `${targetRect.left + targetRect.width / 2 - 14}px`;
        flyer.style.top = `${targetRect.top + targetRect.height / 2 - 14}px`;
        flyer.style.transform = 'scale(0.3) rotate(360deg)';
        flyer.style.opacity = '0.5';
    });

    setTimeout(() => {
        flyer.remove();
        cartBtn.classList.add('cart-bump');
        if (window.ngoanSound) window.ngoanSound.playCrunch();
        setTimeout(() => cartBtn.classList.remove('cart-bump'), 400);
    }, 750);
}

window.FloatingFruits = FloatingFruits;
window.initTiltEffect = initTiltEffect;
window.animateFlyToCart = animateFlyToCart;
