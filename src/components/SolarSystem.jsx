import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
  controls: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: 'white',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '12px',
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
  
  
  // Planet data
  const planetData = [
    {
      name: "Sun",
      radius: 10,
      distance: 0,
      rotationSpeed: 0.002,
      orbitSpeed: 0,
      texture: "sun",
      color: 0xffdd00,
      description: "The Sun is the star at the center of our Solar System. It's a nearly perfect sphere of hot plasma, with a diameter about 109 times that of Earth. The Sun's mass is about 330,000 times that of Earth, constituting about 99.86% of the total mass of the Solar System."
    },
    {
      name: "Mercury",
      radius: 1,
      distance: 30,
      rotationSpeed: 0.004,
      orbitSpeed: 0.008,
      texture: "mercury",
      color: 0xa9a9a9,
      description: "Mercury is the smallest and innermost planet in the Solar System. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets. Despite being close to the Sun, it's not the hottest planet - that distinction belongs to Venus."
    },
    {
      name: "Venus",
      radius: 1.8,
      distance: 50,
      rotationSpeed: 0.002,
      orbitSpeed: 0.006,
      texture: "venus",
      color: 0xe6e6e6,
      description: "Venus is the second planet from the Sun and is Earth's closest planetary neighbor. It's often called Earth's sister planet because of their similar size and mass. However, Venus has a thick, toxic atmosphere filled with carbon dioxide and sulfuric acid clouds."
    },
    {
      name: "Earth",
      radius: 2,
      distance: 75,
      rotationSpeed: 0.01,
      orbitSpeed: 0.005,
      texture: "earth",
      color: 0x3366ff,
      description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water. Earth's atmosphere consists of 78% nitrogen, 21% oxygen, and 1% other gases."
    },
    {
      name: "Mars",
      radius: 1.5,
      distance: 100,
      rotationSpeed: 0.008,
      orbitSpeed: 0.004,
      texture: "mars",
      color: 0xcc3300,
      description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Mars is often called the 'Red Planet' due to its reddish appearance, caused by iron oxide (rust) on its surface. Mars has two small moons, Phobos and Deimos."
    },
    {
      name: "Jupiter",
      radius: 5,
      distance: 140,
      rotationSpeed: 0.02,
      orbitSpeed: 0.002,
      texture: "jupiter",
      color: 0xe6b800,
      description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It's a gas giant with a mass one-thousandth that of the Sun but two-and-a-half times the mass of all the other planets combined. Jupiter has 79 known moons, including the four large Galilean moons."
    },
    {
      name: "Saturn",
      radius: 4.5,
      distance: 190,
      rotationSpeed: 0.018,
      orbitSpeed: 0.0015,
      texture: "saturn",
      color: 0xd9c36c,
      description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It's known for its prominent ring system, which consists of seven rings with several gaps and divisions between them. Saturn has 82 known moons."
    },
    {
      name: "Uranus",
      radius: 3.6,
      distance: 250,
      rotationSpeed: 0.012,
      orbitSpeed: 0.001,
      texture: "uranus",
      color: 0x99ccff,
      description: "Uranus is the seventh planet from the Sun. It has the third-largest diameter and fourth-largest mass in the Solar System. Uranus's atmosphere is similar to Jupiter's and Saturn's, being primarily composed of hydrogen and helium. It rotates on its side, with an axial tilt of 98 degrees."
    },
    {
      name: "Neptune",
      radius: 3.4,
      distance: 320,
      rotationSpeed: 0.01,
      orbitSpeed: 0.0008,
      texture: "neptune",
      color: 0x0066ff,
      description: "Neptune is the eighth and farthest planet from the Sun. It's the fourth-largest planet by diameter and the third-most-massive. Neptune is 17 times the mass of Earth and slightly more massive than Uranus. It's known for its strong winds and Great Dark Spot."
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

    // Camera position
    camera.position.set(0, 20, 50);

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
    //light directional 
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Solar system tilt
    const solarSystem = new THREE.Group();
    solarSystem.rotation.x = Math.PI * 0.08; // Slight tilt
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

    planetData.forEach(planet => {
      // Create orbit path
      if (planet.distance > 0) {
        const orbitGeometry = new THREE.RingGeometry(planet.distance - .5, planet.distance + .5, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x444444, 
          side: THREE.DoubleSide,
          transparent: false,
          opacity: 1
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        solarSystem.add(orbit);
        orbits.push(orbit);
      }
      
      // Create planet
      const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
      
      let planetMaterial;
      if (planet.name === "Sun") {
        planetMaterial = new THREE.MeshBasicMaterial({ 
          color: planet.color,
          emissive: 0xff5500,
          emissiveIntensity: 0.5
        });
      } else {
        planetMaterial = new THREE.MeshPhongMaterial({ 
          color: planet.color,
          shininess: 30,
          specular: 0x333333
        });
      }
      
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Add to solar system
      const planetOrbit = new THREE.Group();
      solarSystem.add(planetOrbit);
      
      // Position
      planetMesh.position.x = planet.distance;
      planetOrbit.add(planetMesh);
      
      // Add Saturn's rings if needed
      if (planet.name === "Saturn") {
        const ringGeometry = new THREE.RingGeometry(planet.radius * 1.5, planet.radius * 2.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xd9c36c,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planetMesh.add(ring);
      }
      
      // Store planet data
      planets.push({
        mesh: planetMesh,
        orbit: planetOrbit,
        data: planet
      });
    });

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
      
      // Get all planet meshes
      const planetMeshes = planets.map(p => p.mesh);
      
      // Check for intersections
      const intersects = raycaster.intersectObjects(planetMeshes);
      
      if (intersects.length > 0) {
        // Find which planet was clicked
        const clickedMesh = intersects[0].object;
        const planet = planets.find(p => p.mesh === clickedMesh);
        
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
            selectedPlanet.mesh.scale.set(1.1, 1.1, 1.1);
          }
        }
      } else {
        // Hide panel if clicked outside
        if (infoPanelRef.current) {
          infoPanelRef.current.style.display = 'none';
        }
        if (selectedPlanet) {
          selectedPlanet.mesh.scale.set(1, 1, 1);
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

    // Animation loop
    function animate() {
      const animationId = requestAnimationFrame(animate);
      
      // Update planet positions and rotations
      planets.forEach(planet => {
        // Rotate around own axis
        planet.mesh.rotation.y += planet.data.rotationSpeed;
        
        // Orbit around the sun
        if (planet.data.orbitSpeed > 0) {
          planet.orbit.rotation.y += planet.data.orbitSpeed;
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
        <div ref={infoPanelRef} style={styles.infoPanel}>
          <div ref={infoTitleRef} style={styles.infoTitle}>Planet Name</div>
          <div ref={infoContentRef} style={styles.infoContent}>Description goes here.</div>
        </div>
        <div style={styles.controls}>
          Controls:<br/>
          Mouse Drag: Rotate view<br/>
          Mouse Wheel: Zoom in/out<br/>
          Click on planet: Show info
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;