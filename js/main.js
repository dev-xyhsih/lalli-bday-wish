import * as THREE from 'three';
import { SceneManager } from './scene.js';
import { ParticleSystem, FloatingCrystals, FinaleHeart } from './objects.js';
import { AnimationController } from './animations.js';
import { DecorationManager } from './decorations.js';

let sceneManager;
let objects = {};
let animationController;
let lenis;
let clock = new THREE.Clock();

function init() {
    // 1. Initialize Lenis Smooth Scroll
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: true, // Enables smooth scroll on mobile devices
        touchMultiplier: 2,
        infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger for better performance and mobile handling
    if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
    }

    if (window.gsap) {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. Initialize Three.js Scene
    sceneManager = new SceneManager('canvas-container');

    // 3. Add Objects
    objects.particles = new ParticleSystem(sceneManager.scene, 10000);
    objects.crystals = new FloatingCrystals(sceneManager.scene);
    objects.heart = new FinaleHeart(sceneManager.scene);
    objects.decorations = new DecorationManager();

    // 4. Initialize Animations
    animationController = new AnimationController(sceneManager, objects);

    // 5. Audio Control
    const bgMusic = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    let isPlaying = false;

    muteBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            muteBtn.textContent = 'Play Music';
        } else {
            bgMusic.play();
            muteBtn.textContent = 'Pause Music';
        }
        isPlaying = !isPlaying;
    });

    // Handle mouse movement for parallax
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // 6. Render Loop
    function tick() {
        const elapsedTime = clock.getElapsedTime();
        
        // Update objects
        if(objects.particles) objects.particles.update(elapsedTime);
        if(objects.crystals) objects.crystals.update(elapsedTime);
        if(objects.heart) objects.heart.update(elapsedTime);

        // Apply gentle parallax to camera based on mouse
        if(sceneManager && sceneManager.camera) {
            sceneManager.camera.position.x += (mouseX * 2 - sceneManager.camera.position.x) * 0.05;
            sceneManager.camera.position.y += (mouseY * 2 - sceneManager.camera.position.y) * 0.05;
        }

        // Render scene via composer
        if(sceneManager) sceneManager.render();

        requestAnimationFrame(tick);
    }

    tick();
}

// Start everything
window.addEventListener('load', init);
