export class AnimationController {
    constructor(sceneManager, objects) {
        this.sceneManager = sceneManager;
        this.objects = objects;
        
        // Initialize Splitting
        Splitting();
        
        this.initScrollAnimations();
        this.initIntroAnimations();
        this.initButtonInteractions();
    }

    initIntroAnimations() {
        const tl = gsap.timeline();
        
        // Setup initial states
        gsap.set('.title .char', { opacity: 0, y: 50, rotateX: -90 });
        gsap.set('.name .char', { opacity: 0, scale: 0, filter: "blur(10px)" });
        
        tl.to('.title .char', {
            duration: 1.5,
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.05,
            ease: 'back.out(1.7)',
            delay: 0.5
        })
        .to('.name .char', {
            duration: 1,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            stagger: 0.05,
            ease: 'power3.out'
        }, "-=1")
        .to('.subtitle', {
            duration: 1,
            autoAlpha: 1,
            y: 0,
            ease: 'power2.out'
        });

        // 3D Intro Camera Movement
        gsap.from(this.sceneManager.camera.position, {
            z: 100,
            y: 20,
            duration: 3,
            ease: "power3.inOut"
        });
    }

    initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        const scenes = document.querySelectorAll('.scene');
        
        // Fade in texts in sections
        scenes.forEach((scene, i) => {
            if (i === 0) return; // Skip first scene as intro handles it
            
            const title = scene.querySelector('.section-title');
            const text = scene.querySelector('.section-text');

            if(title && text) {
                gsap.to([title, text], {
                    scrollTrigger: {
                        trigger: scene,
                        start: "top 60%",
                        end: "top 20%",
                        toggleActions: "play none none reverse"
                    },
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out"
                });
            }
        });

        // Camera movement based on scroll
        gsap.to(this.sceneManager.camera.position, {
            scrollTrigger: {
                trigger: "#smooth-content",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            },
            z: 15,
            x: -5,
            y: -10,
            ease: "none"
        });

        gsap.to(this.sceneManager.camera.rotation, {
            scrollTrigger: {
                trigger: "#smooth-content",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            },
            y: 0.5,
            x: 0.2,
            ease: "none"
        });
    }

    initButtonInteractions() {
        const btn = document.getElementById('celebrate-btn');
        const finaleMsg = document.getElementById('finale-message');

        btn.addEventListener('click', () => {
            // Hide button
            gsap.to(btn, { duration: 0.5, scale: 0, opacity: 0, onComplete: () => btn.classList.add('hidden') });
            
            // Show finale message
            finaleMsg.classList.remove('hidden');
            gsap.fromTo(finaleMsg, { scale: 0, opacity: 0 }, { duration: 2, scale: 1, opacity: 1, ease: 'elastic.out(1, 0.3)', delay: 1 });

            // Boom Effect
            gsap.to(this.sceneManager.bloomPass, {
                strength: 3.5,
                duration: 0.5,
                yoyo: true,
                repeat: 3
            });
            gsap.to(this.sceneManager.bloomPass, {
                strength: 2.0,
                duration: 2,
                delay: 2
            });

            // Camera Pullback
            gsap.to(this.sceneManager.camera.position, {
                z: 50,
                x: 0,
                y: 0,
                duration: 3,
                ease: 'power4.out'
            });
            gsap.to(this.sceneManager.camera.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 3,
                ease: 'power4.out'
            });

            // Show Heart
            gsap.to(this.objects.heart.group.scale, {
                x: 0.5,
                y: 0.5,
                z: 0.5,
                duration: 2,
                ease: 'elastic.out(1, 0.5)',
                delay: 1.5
            });

            // Increase particle speed temporarily
            gsap.to(this.objects.particles.particles.material.uniforms.time, {
                value: "+=50",
                duration: 3,
                ease: 'power2.inOut'
            });

            // Trigger Massive HTML Confetti and Balloons
            if(this.objects.decorations) {
                this.objects.decorations.triggerCelebrate();
            }
        });
    }
}
