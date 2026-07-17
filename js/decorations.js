export class DecorationManager {
    constructor() {
        this.container = document.getElementById('decorations-container');
        this.emojis = ['💖', '🌸', '✨', '🎀', '🎈', '🧸', '🍰', '🎁', '🌷', '🦋', '🫧', '🌼'];
        this.hearts = ['💖', '💕', '💓', '💗', '💘'];
        
        // Start passive floating decorations
        setInterval(() => this.spawnRandomDecoration(), 800);
        setInterval(() => this.spawnHeart(), 600);
    }

    createFloatingElement(emoji, animationClass, durationStr, sizeStr, startLeft) {
        const el = document.createElement('div');
        el.className = `floating-emoji ${animationClass}`;
        el.textContent = emoji;
        el.style.left = startLeft;
        el.style.fontSize = sizeStr;
        el.style.animationDuration = durationStr;
        this.container.appendChild(el);

        // Remove after animation completes
        setTimeout(() => {
            if(el.parentElement) el.parentElement.removeChild(el);
        }, parseFloat(durationStr) * 1000);
        return el;
    }

    spawnRandomDecoration() {
        const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        const size = (Math.random() * 20 + 15) + 'px';
        const left = Math.random() * 100 + 'vw';
        const duration = (Math.random() * 15 + 10) + 's';
        
        this.createFloatingElement(emoji, 'float-up', duration, size, left);
    }

    spawnHeart() {
        const heart = this.hearts[Math.floor(Math.random() * this.hearts.length)];
        const size = (Math.random() * 30 + 20) + 'px';
        const left = Math.random() * 100 + 'vw';
        const duration = (Math.random() * 12 + 8) + 's';
        
        const el = this.createFloatingElement(heart, 'float-up-sway', duration, size, left);
        el.style.opacity = Math.random() * 0.5 + 0.3; // semi-transparent
    }

    triggerCelebrate() {
        // Massive canvas-confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const colors = ['#F5C2D5', '#A78BFA', '#E6B8A2', '#FDFCFB']; // Pink, Lavender, Gold, White

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            
            // Confetti from everywhere
            if (window.confetti) {
                window.confetti({
                    ...defaults,
                    particleCount,
                    colors: colors,
                    origin: { x: Math.random(), y: Math.random() - 0.2 }
                });
            }
        }, 250);

        // Spawn a burst of cute HTML elements
        for(let i=0; i<80; i++) {
            setTimeout(() => {
                const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
                const size = (Math.random() * 50 + 20) + 'px';
                const left = Math.random() * 100 + 'vw';
                const dur = (Math.random() * 5 + 3) + 's';
                
                this.createFloatingElement(emoji, 'float-burst', dur, size, left);
            }, Math.random() * 1500);
        }
    }
}
