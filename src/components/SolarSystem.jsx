import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    zIndex: 10,
  }
};

const SolarSystemWithModels = () => {
  const containerRef = useRef(null);
  const infoPanelRef = useRef(null);
  const infoTitleRef = useRef(null);
  const infoContentRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
// planet data with realistic proportions
const planetData = [
  {
    name: "Sun",
    distance: 0,
    semiMajorAxis: 0,
    eccentricity: 0,
    inclination: 0,
    axialTilt: 7.25,
    rotationSpeed: 0.001,
    orbitSpeed: 0,
    initialAngle: 0,
    description: "The Sun is the star at the center of our Solar System. It's a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field.",
    modelPath: 'src/Models/Sun.glb',
    modelScale: 5 // Sun is about 109 times Earth's diameter
  },
  {
    name: "Mercury",
    semiMajorAxis: 3600, // 0.39 AU scaled
    eccentricity: 0.2056,
    inclination: 7.0,
    axialTilt: 0.03,
    rotationSpeed: 0.004,
    orbitSpeed: 0.008,
    initialAngle: 1.2,
    color: 0xa9a9a9,
    description: "Mercury is the smallest and innermost planet in the Solar System. It completes an orbit around the Sun every 88 Earth days.",
    modelPath: 'src/Models/Mercury.glb',
    modelScale: 1 // Mercury is about 0.38 times Earth's diameter
  },
  {
    name: "Venus", 
    semiMajorAxis: 5600, // 0.72 AU scaled
    eccentricity: 0.0068,
    inclination: 3.39,
    axialTilt: 177.4,
    rotationSpeed: 0.002,
    orbitSpeed: 0.006,
    initialAngle: 3.7,
    color: 0xe6e6e6,
    description: "Venus is the second planet from the Sun and Earth's closest planetary neighbor. It's similar in structure and size to Earth, but its thick atmosphere traps heat in a runaway greenhouse effect.",
    modelPath: 'src/Models/Venus.glb',
    modelScale: 1.6666666666666667 // Venus is about 0.95 times Earth's diameter
  },
  {
    name: "Earth",
    semiMajorAxis: 7600, // 1 AU (baseline)
    eccentricity: 0.0167,
    inclination: 0.0,
    axialTilt: 23.44,
    rotationSpeed: 0.01,
    orbitSpeed: 0.005,
    initialAngle: 5.1,
    color: 0x3366ff,
    description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is water-covered.",
    modelPath: 'src/Models/Earth.glb',
    modelScale: 2 // Earth is our reference point (1x)
  },
  {
    name: "Moon",
    modelPath: "src/Models/Moon.glb",
    semiMajorAxis: 500, // Scaled distance from Earth
    eccentricity: 0.0549,
    inclination: 5.14, 
    axialTilt: 6.68, 
    rotationSpeed: 0.01, 
    orbitSpeed: 0.05, 
    isMoon: true, 
    parentPlanet: "Earth", // Parent planet for moons
    modelScale: 0.6, // Moon is about 0.27 times Earth's diameter
    description: "The Moon is Earth's only natural satellite. It is the fifth-largest satellite in the Solar System and the largest among planetary satellites relative to the size of the planet that it orbits."
  },
  {
    name: "Mars",
    semiMajorAxis: 9600, // 1.52 AU scaled
    eccentricity: 0.0934,
    inclination: 1.85,
    axialTilt: 25.19,
    rotationSpeed: 0.008,
    orbitSpeed: 0.004,
    initialAngle: 0.6,
    color: 0xcc3300,
    description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Known as the 'Red Planet' due to its reddish appearance from iron oxide on its surface.",
    modelPath: 'src/Models/Mars.glb',
    modelScale: 1.3 // Mars is about 0.53 times Earth's diameter
  },
  {
    name: "Jupiter",
    semiMajorAxis: 11600, // 5.2 AU scaled
    eccentricity: 0.0484,
    inclination: 1.31,
    axialTilt: 3.13,
    rotationSpeed: 0.01,
    orbitSpeed: 0.002,
    initialAngle: 2.2,
    color: 0xe6b800,
    description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It's a gas giant with a mass two and a half times that of all the other planets combined.",
    modelPath: 'src/Models/Jupiter.glb',
    modelScale: 3.3 // Jupiter is about 11.2 times Earth's diameter
  },
  {
    name: "Saturn",
    semiMajorAxis: 13600, // 9.58 AU scaled
    eccentricity: 0.0539,
    inclination: 2.49,
    axialTilt: 26.73,
    rotationSpeed: 0.008,
    orbitSpeed: 0.0015,
    initialAngle: 4.8,
    color: 0xd9c36c,
    description: "Saturn is the sixth planet from the Sun and has the most extensive ring system of any planet. It's known for its prominent rings, which are mostly made of ice particles with a smaller amount of rocky debris.",
    modelPath: 'src/Models/Saturn.glb',
    modelScale: 2.35 // Saturn is about 9.45 times Earth's diameter (not including rings)
  },
  {
    name: "Uranus",
    semiMajorAxis: 15600, // 19.2 AU scaled
    eccentricity: 0.0473,
    inclination: 0.77,
    axialTilt: 97.77,
    rotationSpeed: 0.012,
    orbitSpeed: 0.001,
    initialAngle: 3.2,
    color: 0x99ccff,
    description: "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. Like the other gas giants, it has no solid surface.",
    modelPath: 'src/Models/Uranus.glb',
    modelScale: 2.6 // Uranus is about 4 times Earth's diameter
  },
  {
    name: "Neptune",
    semiMajorAxis: 17600, // 30.1 AU scaled
    eccentricity: 0.0086,
    inclination: 1.77,
    axialTilt: 28.32,
    rotationSpeed: 0.01,
    orbitSpeed: 0.0008,
    initialAngle: 1.8,
    color: 0x0066ff,
    description: "Neptune is the eighth and farthest planet from the Sun. It's the fourth-largest planet by diameter and the densest giant planet. Neptune's atmosphere features active and visible weather patterns.",
    modelPath: 'src/Models/Neptune.glb',
    modelScale: 2.3 // Neptune is about 3.88 times Earth's diameter
  }
];


  useEffect(() => {
    if (!containerRef.current) return;

   // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 45000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Camera position - moved further back to see the expanded solar system
    camera.position.set(0, 2000, 5000);

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 2, 10000);
    scene.add(sunLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Solar system tilt group
    const solarSystem = new THREE.Group();
    scene.add(solarSystem);

    // Starfield background
    function createStars() {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.2,
        sizeAttenuation: false
      });

      const starsVertices = [];
      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 120000 - 60000;
        const y = Math.random() * 120000 - 60000;
        const z = Math.random() * 120000 - 60000;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const starField = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(starField);
    }
    createStars();

    // Create planets array to store loaded meshes and data
    const planets = [];

    // Loading Manager
    const manager = new THREE.LoadingManager();
    manager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(`Started loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`);
    };
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(`Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`);
      setLoadingProgress(Math.round((itemsLoaded / itemsTotal) * 100));
    };
    manager.onError = (url) => {
      console.error('There was an error loading ' + url);
    };
    manager.onLoad = () => {
      console.log('Loading complete!');
      setIsLoading(false); // Hide loading overlay

      // Start the animation loop after all models are loaded
      animate();
    };

    // GLTF Loader
    const loader = new GLTFLoader(manager);

    // Load models and set up the scene structure
    planetData.forEach(planet => {
      // Create planet orbit group
      const planetOrbitGroup = new THREE.Group();
      solarSystem.add(planetOrbitGroup);

      // Load the model
      loader.load(
        planet.modelPath,
        (gltf) => {
          const model = gltf.scene;

          // Scale the loaded model to match the planet's real relative size
          const scaleFactor = planet.modelScale;
          model.scale.set(scaleFactor, scaleFactor, scaleFactor);

          // Add the loaded model to its orbit group
          planetOrbitGroup.add(model);

          // Apply axial tilt to the model itself
          model.rotation.z = (planet.axialTilt * Math.PI) / 180;

          // Store planet data and the loaded model
          planets.push({
            mesh: model, // Use the loaded model as the 'mesh'
            orbitGroup: planetOrbitGroup,
            data: planet
          });

          // Create orbit path for planets, not for the sun
          if (planet.name !== "Sun") {
            const orbit = createEllipticalOrbit(
              planet.semiMajorAxis,
              planet.eccentricity,
              0 // We'll handle inclination at the group level
            );
            planetOrbitGroup.add(orbit);

            // Apply inclination to the entire orbit group
            planetOrbitGroup.rotation.x = (planet.inclination * Math.PI) / 180;
          }
        },
        undefined, // onProgress callback is handled by the manager
        (error) => {
          console.error('An error occurred while loading the model:', error);
        }
      );
    });

    // Function to create elliptical orbit path
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
        opacity: 0.5,
        linewidth: 3
      });

      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      return orbit;
    }

    // Raycaster for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedPlanet = null;

    function onMouseClick(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Get all planet meshes
      const allObjects = [];
      planets.forEach(p => {
        p.mesh.traverse((child) => {
          if (child.isMesh) {
            allObjects.push(child);
            // Store back-reference to planet data for easier lookup
            child.userData.planetIndex = planets.indexOf(p);
          }
        });
      });

      const intersects = raycaster.intersectObjects(allObjects);

      if (intersects.length > 0) {
        const clickedPlanetIndex = intersects[0].object.userData.planetIndex;
        const planet = planets[clickedPlanetIndex];
        
        if (planet) {
          if (infoPanelRef.current && infoTitleRef.current && infoContentRef.current) {
            infoTitleRef.current.textContent = planet.data.name;
            infoContentRef.current.textContent = planet.data.description;
            infoPanelRef.current.style.display = 'block';

            // Highlight the selected planet's model
            if (selectedPlanet && selectedPlanet !== planet) {
              // Restore previous scale if there was a previously selected planet
              if (selectedPlanet.initialScale) {
                selectedPlanet.mesh.scale.copy(selectedPlanet.initialScale);
              }
            }

            selectedPlanet = planet;
            // Store initial scale before changing for highlighting
            if (!selectedPlanet.initialScale) {
              selectedPlanet.initialScale = selectedPlanet.mesh.scale.clone();
            }
            // Subtle highlight effect for the selected planet
            selectedPlanet.mesh.scale.multiplyScalar(1.05);
          }
        }
      } else {
        if (infoPanelRef.current) {
          infoPanelRef.current.style.display = 'none';
        }
        if (selectedPlanet && selectedPlanet.initialScale) {
          selectedPlanet.mesh.scale.copy(selectedPlanet.initialScale);
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

      const M = (time * planet.data.orbitSpeed * 2 * Math.PI) + initialAngle;

      // Solve Kepler's equation for eccentric anomaly E
      let E = M;
      for (let i = 0; i < 5; i++) {
        E = M + e * Math.sin(E);
      }

      // Calculate position on the ellipse
      const x = a * (Math.cos(E) - e);
      const z = a * Math.sqrt(1 - e * e) * Math.sin(E);

      return { x, z };
    }

    // Animation loop - only starts after models are loaded
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01; // Time increment

      planets.forEach(planet => {
        // Rotate planet model around its local Y axis (simulating rotation)
        planet.mesh.rotation.y += planet.data.rotationSpeed;

        if (planet.data.name !== "Sun" && !planet.data.isMoon) {
          const position = calculateEllipticalPosition(planet, time);

          // Position the planet on its orbit
          planet.mesh.position.x = position.x;
          planet.mesh.position.y = 0;
          planet.mesh.position.z = position.z;
        } else if (planet.data.isMoon) {
          // Find Earth's orbit group to attach the moon to
          const earth = planets.find(p => p.data.name === "Earth");
            if (earth) {
              // Simple circular orbit around Earth for now
              const angle = time * planet.data.orbitSpeed;
              const distance = planet.data.semiMajorAxis; // Distance from Earth
              planet.mesh.position.x = earth.mesh.position.x + distance * Math.cos(angle);
              planet.mesh.position.y = earth.mesh.position.y; // Assuming orbit is in the same plane as Earth for simplicity
              planet.mesh.position.z = earth.mesh.position.z + distance * Math.sin(angle);
            }
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    // Cleanup function
    return () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };

  }, []);

  return (
    <div style={styles.solarBody}>
       {isLoading && (
        <div style={styles.loadingOverlay}>
          Loading Models: {loadingProgress}%
        </div>
      )}
      <div ref={containerRef} style={styles.mainContainer}>
        <div ref={infoPanelRef} style={styles.infoPanel}>
          <div ref={infoTitleRef} style={styles.infoTitle}>Planet Name</div>
          <div ref={infoContentRef} style={styles.infoContent}>Description goes here.</div>
        </div>
      </div>
    </div>
  );
};

export default SolarSystemWithModels;