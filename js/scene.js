import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0B1020, 0.005);

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 30;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.container.appendChild(this.renderer.domElement);

        this.initPostProcessing();
        this.initLights();

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    initPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.width, this.height),
            1.2,  // softer strength
            0.6,  // wider radius
            0.7   // lower threshold for dreamier glow
        );
        this.composer.addPass(this.bloomPass);
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        const roseGoldLight = new THREE.PointLight(0xE6B8A2, 1.5, 100);
        roseGoldLight.position.set(0, 0, 10);
        this.scene.add(roseGoldLight);

        const lavenderLight = new THREE.PointLight(0xA78BFA, 1, 100);
        lavenderLight.position.set(10, 10, 10);
        this.scene.add(lavenderLight);

        const softBlushLight = new THREE.PointLight(0xF5C2D5, 1, 100);
        softBlushLight.position.set(-10, -10, 10);
        this.scene.add(softBlushLight);
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
        this.composer.setSize(this.width, this.height);
    }

    render() {
        this.composer.render();
    }
}
