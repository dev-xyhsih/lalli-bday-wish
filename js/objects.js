import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene, count = 5000) {
        this.scene = scene;
        this.count = count;
        
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.count * 3);
        const colors = new Float32Array(this.count * 3);
        const sizes = new Float32Array(this.count);

        const colorGold = new THREE.Color(0xE6B8A2); // Rose Gold
        const colorCyan = new THREE.Color(0xA78BFA); // Lavender
        const colorMagenta = new THREE.Color(0xF5C2D5); // Soft Blush
        
        for(let i = 0; i < this.count * 3; i+=3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i+1] = (Math.random() - 0.5) * 200;
            positions[i+2] = (Math.random() - 0.5) * 200;

            const r = Math.random();
            let c;
            if(r < 0.33) c = colorGold;
            else if(r < 0.66) c = colorCyan;
            else c = colorMagenta;

            colors[i] = c.r;
            colors[i+1] = c.g;
            colors[i+2] = c.b;

            sizes[i/3] = Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for glowy particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
            },
            vertexShader: `
                uniform float time;
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    pos.y += sin(time * 0.5 + pos.x * 0.05) * 2.0;
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    float glow = 1.0 - (dist * 2.0);
                    gl_FragColor = vec4(vColor * glow, glow * 0.8);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    update(time) {
        this.particles.material.uniforms.time.value = time;
        this.particles.rotation.y = time * 0.02;
        this.particles.rotation.x = time * 0.01;
    }
}

export class FloatingCrystals {
    constructor(scene) {
        this.scene = scene;
        this.crystals = [];
        this.group = new THREE.Group();

        const geometry = new THREE.OctahedronGeometry(1, 0);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xFDFCFB, // Warm White
            metalness: 0.5,
            roughness: 0.2,
            transmission: 0.9,
            ior: 1.5,
            thickness: 0.5,
            envMapIntensity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.2
        });

        for(let i = 0; i < 20; i++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40 - 20
            );
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            const scale = Math.random() * 2 + 0.5;
            mesh.scale.set(scale, scale, scale);
            
            this.crystals.push({
                mesh: mesh,
                speed: Math.random() * 0.02 + 0.01,
                rotSpeed: Math.random() * 0.02 + 0.01
            });
            this.group.add(mesh);
        }
        
        this.scene.add(this.group);
    }

    update(time) {
        this.crystals.forEach((c, i) => {
            c.mesh.position.y += Math.sin(time + i) * 0.01;
            c.mesh.rotation.x += c.rotSpeed;
            c.mesh.rotation.y += c.rotSpeed;
        });
        this.group.rotation.y = time * 0.05;
    }
}

export class FinaleHeart {
    constructor(scene) {
        this.scene = scene;
        
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo( x + 5, y + 5 );
        heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
        heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
        heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
        heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
        heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
        heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

        const geometry = new THREE.ExtrudeGeometry( heartShape, {
            depth: 2,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1
        } );

        const material = new THREE.MeshPhysicalMaterial({
            color: 0xE6B8A2, // Rose Gold
            emissive: 0xA78BFA, // Lavender glow
            emissiveIntensity: 0.3, // Softer glow
            metalness: 0.4,
            roughness: 0.3,
            clearcoat: 0.8,
            clearcoatRoughness: 0.2
        });

        this.mesh = new THREE.Mesh(geometry, material);
        geometry.computeBoundingBox();
        const centerOffsetX = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        const centerOffsetY = -0.5 * ( geometry.boundingBox.max.y - geometry.boundingBox.min.y );
        
        // Wrap in a group to handle rotation around center
        this.group = new THREE.Group();
        this.mesh.position.set( centerOffsetX, centerOffsetY, 0 );
        this.mesh.rotation.x = Math.PI; // Flip it upright
        this.group.add(this.mesh);

        this.group.position.set(0, 0, 0);
        this.group.scale.set(0, 0, 0); // hidden initially
        
        this.scene.add(this.group);
    }
    
    update(time) {
        this.group.rotation.y = Math.sin(time) * 0.2;
    }
}
