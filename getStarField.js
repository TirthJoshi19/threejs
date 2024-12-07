import * as THREE from 'three';

export default function getStarField({ numStars = 500 } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25; // Random radius between 25 and 50
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u; // Random angle in xy-plane
    const phi = Math.acos(2 * v - 1); // Random angle from z-axis

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6, // Fixed hue for color
      minDist: radius, // Unused in this case but could be useful later
    };
  }

  const vertices = [];
  const colors = [];
  const positions = [];
  let col;

  for (let i = 0; i < numStars; i++) {
    const p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);

    col = new THREE.Color().setHSL(hue, 0.5, Math.random()); // Star color
    vertices.push(pos.x, pos.y, pos.z); // Add star position (x, y, z)
    colors.push(col.r, col.g, col.b); // Add star color (r, g, b)
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const texture = new THREE.TextureLoader().load('/star.jpeg'); // Assuming 'star.png' is the texture
  const mat = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    map: texture,
    transparent: true, // For smoother star edges
  });

  // Create points object
  const starField = new THREE.Points(geo, mat);

  return starField; // Return the star field to add it to the scene
}
