/**
 * Cursor Dot - Animated Dot Cursor Effect
 * Creates an interactive glowing dot that follows the mouse cursor
 */

class CursorDot {
  constructor() {
    this.canvas = document.getElementById('cursor-canvas');
    if (!this.canvas) return;

    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Mouse position
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };

    // Create dot
    this.createDot();

    // Event listeners
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('resize', () => this.onWindowResize());

    // Start animation loop
    this.animate();
  }

  createDot() {
    // Create a group to hold the dot
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Create main dot sphere
    const dotGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const dotMaterial = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      emissive: 0x1e40af,
      wireframe: false,
      shininess: 100,
    });
    this.dot = new THREE.Mesh(dotGeometry, dotMaterial);
    this.group.add(this.dot);

    // Create outer glow ring
    const ringGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0x7c3aed,
      emissive: 0x6d28d9,
      wireframe: false,
      shininess: 100,
    });
    this.ring = new THREE.Mesh(ringGeometry, ringMaterial);
    this.ring.rotation.x = Math.PI / 4;
    this.group.add(this.ring);

    // Create second rotating ring
    const ring2Geometry = new THREE.TorusGeometry(0.5, 0.03, 16, 100);
    const ring2Material = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      wireframe: false,
      shininess: 100,
    });
    this.ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    this.ring2.rotation.y = Math.PI / 3;
    this.group.add(this.ring2);

    // Add lighting
    const light1 = new THREE.PointLight(0xffffff, 1, 100);
    light1.position.set(5, 5, 5);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0x2563eb, 0.5, 100);
    light2.position.set(-5, -5, 5);
    this.scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
  }

  onMouseMove(event) {
    // Convert mouse position to normalized device coordinates (-1 to 1)
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth mouse following
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;

    // Position dot based on mouse
    this.group.position.x = this.mouse.x * 2;
    this.group.position.y = this.mouse.y * 2;

    // Rotate rings
    this.ring.rotation.x += 0.01;
    this.ring.rotation.y += 0.005;

    this.ring2.rotation.x -= 0.008;
    this.ring2.rotation.y += 0.012;

    // Subtle scale animation for dot
    const scale = 1 + Math.sin(Date.now() * 0.002) * 0.15;
    this.dot.scale.set(scale, scale, scale);

    // Pulse effect for rings
    const ringScale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
    this.ring.scale.set(ringScale, ringScale, ringScale);
    this.ring2.scale.set(ringScale * 0.95, ringScale * 0.95, ringScale * 0.95);

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CursorDot();
  });
} else {
  new CursorDot();
}
