import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// CSS styles
const styles = {
  solarBody: {
    padding: 0,
    margin: 0,
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
  },
  mainContainer: {
    margin: 0,
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
  },
  infoPanel: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '15px',
    borderRadius: '10px',
    maxWidth: '300px',
    display: 'none',
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  infoContent: {
    fontSize: '14px',
    lineHeight: 1.4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: '24px',
    zIndex: 1000
  }
};

// Custom Orbit Controls class
class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.enabled = true;
    this.target = new THREE.Vector3();
    this.enableDamping = false;
    this.dampingFactor = 0.05;
    this.enableZoom = true;
    this.zoomSpeed = 1.0;
    this.enableRotate = true;
    this.rotateSpeed = 1.0;
    this.enablePan = true;
    this.panSpeed = 1.0;

    // Current position in spherical coordinates
    this.spherical = new THREE.Spherical();
    this.sphericalDelta = new THREE.Spherical();

    // For zooming
    this.scale = 1;
    this.zoomChanged = false;

    // Mouse button state
    this.isRotating = false;

    // Events
    this.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this));
    this.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.domElement.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.domElement.addEventListener('pointerleave', this.onPointerUp.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));

    // Initial update
    this.update();
  }

  onPointerDown(event) {
    if (!this.enabled) return;

    if (event.button === 0) {
      this.isRotating = true;
      this.handleMouseDownRotate(event);
    }
  }

  onPointerMove(event) {
    if (!this.enabled || !this.isRotating) return;
    this.handleMouseMoveRotate(event);
    this.update();
  }

  onPointerUp() {
    this.isRotating = false;
  }

  onMouseWheel(event) {
    if (!this.enabled || !this.enableZoom) return;

    event.preventDefault();

    this.scale *= (event.deltaY > 0) ? 1.1 : 0.9;
    this.zoomChanged = true;
    this.update();
  }

  onContextMenu(event) {
    if (!this.enabled) return;
    event.preventDefault();
  }

  handleMouseDownRotate(event) {
    this.rotateStart = {
      x: event.clientX,
      y: event.clientY
    };
  }

  handleMouseMoveRotate(event) {
    this.rotateEnd = {
      x: event.clientX,
      y: event.clientY
    };

    this.rotateDelta = {
      x: (this.rotateEnd.x - this.rotateStart.x) * this.rotateSpeed,
      y: (this.rotateEnd.y - this.rotateStart.y) * this.rotateSpeed
    };

    this.sphericalDelta.theta -= 2 * Math.PI * this.rotateDelta.x / this.domElement.clientHeight;
    this.sphericalDelta.phi -= 2 * Math.PI * this.rotateDelta.y / this.domElement.clientHeight;

    this.rotateStart = this.rotateEnd;
  }

  update() {
    const position = this.camera.position;
    const offset = position.clone().sub(this.target);

    // Convert to spherical
    this.spherical.setFromVector3(offset);

    // Apply rotation changes
    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;

    // Restrict phi to avoid flipping
    this.spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, this.spherical.phi));

    // Apply zoom
    this.spherical.radius *= this.scale;

    // Restrict radius to reasonable values
    this.spherical.radius = Math.max(0.1, Math.min(1000, this.spherical.radius));

    // Apply changes to camera position
    offset.setFromSpherical(this.spherical);
    position.copy(this.target).add(offset);

    this.camera.lookAt(this.target);

    // Reset changes
    this.sphericalDelta.set(0, 0, 0);
    this.scale = 1;

    return true;
  }
}

const SolarSystem = () => {
  const containerRef = useRef(null);
  const infoPanelRef = useRef(null);
  const infoTitleRef = useRef(null);
  const infoContentRef = useRef(null);
  const loadingRef = useRef(null);
  
  // Planet data with realistic values
  // Using AU (Astronomical Units) scale with wider spacing
  // Radius values adjusted to better show relative sizes (though still not completely to scale)
  // Real radius scale would make Sun too large and planets too small to see
  // Eccentricity: 0 = perfect circle, higher = more elliptical
  // Inclination: orbital tilt in degrees relative to ecliptic plane
  // axialTilt: planet's rotation axis tilt in degrees
  // initialAngle: starting position in orbit (in radians, 0-2π)
  const planetData = [
    {
      name: "Sun",
      radius: 15,  // Sun is ~109 times Earth's radius, scaled down for visualization
      distance: 0,
      semiMajorAxis: 0,
      eccentricity: 0,
      inclination: 0,
      axialTilt: 7.25,  // Solar tilt relative to ecliptic
      rotationSpeed: 0.002,
      orbitSpeed: 0,
      initialAngle: 0,
      color: 0xffdd00,
      modelFile: "Sun.glb",
      scale: 15,
      description: "The Sun is the star at the center of our Solar System. It's a nearly perfect sphere of hot plasma, with a diameter about 109 times that of Earth. The Sun's mass is about 330,000 times that of Earth, constituting about 99.86% of the total mass of the Solar System."
    },
    {
      name: "Mercury",
      radius: 0.38,  // 0.38 times Earth's radius
      semiMajorAxis: 50,  // 0.39 AU in our scale
      eccentricity: 0.2056,  // Most eccentric of the planets
      inclination: 7.0,
      axialTilt: 0.03,
      rotationSpeed: 0.004,
      orbitSpeed: 0.008,
      initialAngle: 1.2,  // ~69 degrees
      color: 0xa9a9a9,
      modelFile: "Mercury.glb",
      scale: 0.38,
      description: "Mercury is the smallest and innermost planet in the Solar System. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets. Mercury has the most eccentric orbit of all planets with an eccentricity of 0.2056."
    },
    {
      name: "Venus",
      radius: 0.95,  // 0.95 times Earth's radius
      semiMajorAxis: 90,  // 0.72 AU in our scale
      eccentricity: 0.0068,
      inclination: 3.4,
      axialTilt: 177.4,  // Retrograde rotation
      rotationSpeed: 0.002,
      orbitSpeed: 0.006,
      initialAngle: 3.7,  // ~212 degrees
      color: 0xe6e6e6,
      modelFile: "Venus.glb",
      scale: 0.95,
      description: "Venus is the second planet from the Sun. It has the most circular orbit of any planet with an eccentricity of just 0.0068. Venus rotates in the opposite direction to most planets (retrograde rotation) and has an axial tilt of 177.4 degrees."
    },
    {
      name: "Earth",
      radius: 1,  // Reference size = 1
      semiMajorAxis: 125,  // 1 AU in our scale
      eccentricity: 0.0167,
      inclination: 0.0,  // Earth defines the ecliptic plane
      axialTilt: 23.44,
      rotationSpeed: 0.01,
      orbitSpeed: 0.005,
      initialAngle: 5.1,  // ~292 degrees
      color: 0x3366ff,
      modelFile: "Earth.glb",
      scale: 1,
      description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. Earth's orbit has a small eccentricity of 0.0167, making it nearly circular. Its axial tilt of 23.44° causes the seasons."
    },
    {
      name: "Mars",
      radius: 0.53,  // 0.53 times Earth's radius
      semiMajorAxis: 190,  // 1.52 AU in our scale
      eccentricity: 0.0934,
      inclination: 1.85,
      axialTilt: 25.19,
      rotationSpeed: 0.008,
      orbitSpeed: 0.004,
      initialAngle: 0.6,  // ~34 degrees
      color: 0xcc3300,
      modelFile: "Mars.glb",
      scale: 0.53,
      description: "Mars is the fourth planet from the Sun. Its distinctive reddish appearance is due to iron oxide on its surface. Mars has a moderately eccentric orbit with an eccentricity of 0.0934 and an axial tilt (25.19°) similar to Earth's."
    },
    {
      name: "Jupiter",
      radius: 11.2,  // 11.2 times Earth's radius
      semiMajorAxis: 300,  // 5.2 AU in our scale
      eccentricity: 0.0484,
      inclination: 1.31,
      axialTilt: 3.13,
      rotationSpeed: 0.02,
      orbitSpeed: 0.002,
      initialAngle: 2.2,  // ~126 degrees
      color: 0xe6b800,
      modelFile: "Jupiter.glb",
      scale: 11.2,
      description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. Despite its size, Jupiter has a very small axial tilt of just 3.13°. Its orbit has an eccentricity of 0.0484 and an inclination of 1.31° to the ecliptic."
    },
    {
      name: "Saturn",
      radius: 9.45,  // 9.45 times Earth's radius
      semiMajorAxis: 425,  // 9.58 AU in our scale
      eccentricity: 0.0539,
      inclination: 2.49,
      axialTilt: 26.73,
      rotationSpeed: 0.018,
      orbitSpeed: 0.0015,
      initialAngle: 4.8,  // ~275 degrees
      color: 0xd9c36c,
      modelFile: "Saturn.glb",
      scale: 9.45,
      description: "Saturn is the sixth planet from the Sun and known for its prominent ring system. Its orbit has an eccentricity of 0.0539 and an inclination of 2.49°. Saturn's axial tilt of 26.73° gives it seasons similar to Earth's."
    },
    {
      name: "Uranus",
      radius: 4.0,  // 4.0 times Earth's radius
      semiMajorAxis: 575,  // 19.22 AU in our scale
      eccentricity: 0.0473,
      inclination: 0.77,
      axialTilt: 97.77,  // Extreme axial tilt - rotates on its side
      rotationSpeed: 0.012,
      orbitSpeed: 0.001,
      initialAngle: 3.2,  // ~183 degrees
      color: 0x99ccff,
      modelFile: "Uranus.glb",
      scale: 4.0,
      description: "Uranus is the seventh planet from the Sun. Its most distinctive feature is its extreme axial tilt of 97.77°, causing it to rotate nearly on its side. Uranus's orbit has an eccentricity of 0.0473 and a low inclination of 0.77°."
    },
    {
      name: "Neptune",
      radius: 3.88,  // 3.88 times Earth's radius
      semiMajorAxis: 700,  // 30.05 AU in our scale
      eccentricity: 0.0086,
      inclination: 1.77,
      axialTilt: 28.32,
      rotationSpeed: 0.01,
      orbitSpeed: 0.0008,
      initialAngle: 1.8,  // ~103 degrees
      color: 0x0066ff,
      modelFile: "Neptune.glb",
      scale: 3.88,
      description: "Neptune is the eighth and farthest planet from the Sun. Its orbit has an eccentricity of 0.0086 and an inclination of 1.77°. Neptune's axial tilt of 28.32° gives it seasons similar to Earth and Saturn, though each season lasts about 40 years."
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Camera position - increased distance to see the expanded solar system
    camera.position.set(0, 100, 300);

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    // Main light (Sun)
    const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
    scene.add(sunLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Solar system tilt
    const solarSystem = new THREE.Group();
    scene.add(solarSystem);

    // Starfield background
    function createStars() {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        sizeAttenuation: false
      });
      
      const starsVertices = [];
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        starsVertices.push(x, y, z);
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);
    }

    createStars();

    // Create planets
    const planets = [];
    const orbits = [];

    // Function to create elliptical orbit
    function createEllipticalOrbit(semiMajorAxis, eccentricity, inclination) {
      const segments = 128;
      const points = [];
      
      // Calculate semi-minor axis: b = a * sqrt(1 - e²)
      const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
      
      // Calculate focus distance: c = a * e
      const focusDistance = semiMajorAxis * eccentricity;
      
      // Create ellipse path
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = semiMajorAxis * Math.cos(theta) - focusDistance; // Shift to put Sun at focus
        const y = 0;
        const z = semiMinorAxis * Math.sin(theta);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      // Create curve and geometry
      const curve = new THREE.CatmullRomCurve3(points);
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(segments)
      );
      
      const orbitMaterial = new THREE.LineBasicMaterial({ 
        color: 0x666666, 
        transparent: true,
        opacity: 0.5
      });
      
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      
      // Apply inclination (tilt to orbit)
      orbit.rotation.x = (inclination * Math.PI) / 180;
      
      return orbit;
    }

    // Initialize GLTF loader
    const loader = new GLTFLoader();
    let modelsLoaded = 0;
    const totalModels = planetData.length;

    // Update loading progress
    function updateLoadingProgress() {
      modelsLoaded++;
      if (loadingRef.current) {
        loadingRef.current.textContent = `Loading models: ${modelsLoaded}/${totalModels}`;
        
        // Hide loading overlay when all models are loaded
        if (modelsLoaded === totalModels) {
          setTimeout(() => {
            if (loadingRef.current) {
              loadingRef.current.style.display = 'none';
            }
          }, 500);
        }
      }
    }

    // Load 3D model function
    function loadPlanetModel(planet, planetOrbitGroup) {
      return new Promise((resolve) => {
        // Log the model path for debugging
        const modelPath = `./models/${planet.modelFile}`; // Changed from ../models to ./models
        console.log(`Attempting to load: ${modelPath}`);
        
        loader.load(
          modelPath,
          (gltf) => {
            const model = gltf.scene;
            
            // Scale the model according to planet radius
            model.scale.set(planet.scale, planet.scale, planet.scale);
            
            // Apply axial tilt
            model.rotation.z = (planet.axialTilt * Math.PI) / 180;
            
            // Add model to the orbit group
            planetOrbitGroup.add(model);
            
            console.log(`Successfully loaded ${planet.name} model`);
            updateLoadingProgress();
            resolve(model);
          },
          // Progress callback
          (xhr) => {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(`${planet.name} loading: ${Math.round(percentComplete)}%`);
          },
          // Error callback
          (error) => {
            console.error(`Error loading model for ${planet.name}:`, error);
            
            // Fallback to basic sphere if model loading fails
            console.log(`Creating fallback sphere for ${planet.name}`);
            const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
            const planetMaterial = planet.name === "Sun" 
              ? new THREE.MeshBasicMaterial({ color: planet.color }) 
              : new THREE.MeshPhongMaterial({ color: planet.color });
            
            const fallbackMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            planetOrbitGroup.add(fallbackMesh);
            
            updateLoadingProgress();
            resolve(fallbackMesh);
          }
        );
      });
    }

    // Load all planet models
    async function loadAllPlanets() {
      for (const planet of planetData) {
        // Create planet orbit group
        const planetOrbitGroup = new THREE.Group();
        solarSystem.add(planetOrbitGroup);

        // Create orbit path for planets, not for the sun
        if (planet.name !== "Sun") {
          const orbit = createEllipticalOrbit(
            planet.semiMajorAxis, 
            planet.eccentricity,
            0 // We'll handle inclination at the group level
          );
          planetOrbitGroup.add(orbit);
          orbits.push(orbit);
          
          // Apply inclination to the entire orbit group
          planetOrbitGroup.rotation.x = (planet.inclination * Math.PI) / 180;
        }
        
        // Load 3D model
        const planetMesh = await loadPlanetModel(planet, planetOrbitGroup);
        
        // Store planet data
        planets.push({
          mesh: planetMesh,
          orbitGroup: planetOrbitGroup,
          data: planet
        });
      }
    }

    // Start loading planets
    loadAllPlanets();

    // Raycaster for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedPlanet = null;

    function onMouseClick(event) {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update the raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Get all planet meshes and their children (for 3D models)
      const planetObjects = [];
      planets.forEach(planet => {
        // Add the mesh itself
        planetObjects.push(planet.mesh);
        
        // If it's a 3D model, it will have children. Add them too
        if (planet.mesh.children && planet.mesh.children.length > 0) {
          planet.mesh.traverse((child) => {
            if (child.isMesh) {
              planetObjects.push(child);
              child.userData.parentPlanet = planet; // Store reference to the parent planet
            }
          });
        }
      });
      
      // Check for intersections
      const intersects = raycaster.intersectObjects(planetObjects);
      
      if (intersects.length > 0) {
        // Find which planet was clicked
        const clickedObject = intersects[0].object;
        
        // Get the parent planet (either directly or from userData)
        const planet = clickedObject.userData.parentPlanet || 
                        planets.find(p => p.mesh === clickedObject);
        
        if (planet) {
          // Show info panel
          if (infoPanelRef.current && infoTitleRef.current && infoContentRef.current) {
            infoTitleRef.current.textContent = planet.data.name;
            infoContentRef.current.textContent = planet.data.description;
            infoPanelRef.current.style.display = 'block';
            
            // Highlight the selected planet
            if (selectedPlanet && selectedPlanet !== planet) {
              selectedPlanet.mesh.scale.set(1, 1, 1);
            }
            
            selectedPlanet = planet;
            // Slightly increase scale to highlight the selected planet
            const highlightScale = planet.data.scale * 1.1 || 1.1;
            selectedPlanet.mesh.scale.set(highlightScale, highlightScale, highlightScale);
          }
        }
      } else {
        // Hide panel if clicked outside
        if (infoPanelRef.current) {
          infoPanelRef.current.style.display = 'none';
        }
        if (selectedPlanet) {
          const originalScale = selectedPlanet.data.scale || 1;
          selectedPlanet.mesh.scale.set(originalScale, originalScale, originalScale);
          selectedPlanet = null;
        }
      }
    }

    window.addEventListener('click', onMouseClick, false);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Function to calculate planet position on elliptical orbit
    function calculateEllipticalPosition(planet, time) {
      const a = planet.data.semiMajorAxis;
      const e = planet.data.eccentricity;
      const initialAngle = planet.data.initialAngle || 0;
      
      // Mean anomaly (simple time-based progression around orbit plus initial position)
      const M = (time * planet.data.orbitSpeed * 2 * Math.PI) + initialAngle;
      
      // Approximate the eccentric anomaly (E) using a simple iterative approach
      let E = M;
      for (let i = 0; i < 5; i++) {
        E = M + e * Math.sin(E);
      }
      
      // Calculate position using parametric form of ellipse
      const x = a * (Math.cos(E) - e);
      const z = a * Math.sqrt(1 - e * e) * Math.sin(E);
      
      return { x, z };
    }

    // Animation loop with time tracking
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01; // Time increment
      
      // Update planet positions and rotations
      planets.forEach(planet => {
        // Rotate planet around own axis
        planet.mesh.rotation.y += planet.data.rotationSpeed;
        
        // Calculate orbital position for planets
        if (planet.data.name !== "Sun") {
          // Calculate position on orbital plane (before inclination)
          const position = calculateEllipticalPosition(planet, time);
          
          // Apply position in orbit plane coordinates
          planet.mesh.position.x = position.x;
          planet.mesh.position.y = 0;
          planet.mesh.position.z = position.z;
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      
      // Clean up Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (object.material.map) {
            object.material.map.dispose();
          }
          object.material.dispose();
        }
      });
      
      renderer.dispose();
      
      // Remove the canvas element
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={styles.solarBody}>
      <div ref={containerRef} style={styles.mainContainer}>
        <div ref={loadingRef} style={styles.loadingOverlay}>Loading models: 0/9</div>
        <div ref={infoPanelRef} style={styles.infoPanel}>
          <div ref={infoTitleRef} style={styles.infoTitle}>Planet Name</div>
          <div ref={infoContentRef} style={styles.infoContent}>Description goes here.</div>
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;