import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import getStarField from './getStarField';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const controls = new OrbitControls(camera, renderer.domElement);

const sunLight = new THREE.DirectionalLight(0xfffffff);
scene.add(sunLight);
sunLight.position.set(-2, 0.5, 2);
const earthMesh = new THREE.IcosahedronGeometry(1, 7);
const fallbackMaterial = new THREE.MeshStandardMaterial({
  color: '#faebd7',
  wireframe: false,
});

const earthGroup = new THREE.Group();
const earth = new THREE.Mesh(earthMesh, fallbackMaterial);
earthGroup.rotation.z = (23.4 * Math.PI) / 180;
earthGroup.add(earth);
scene.add(earthGroup);

const loader = new THREE.TextureLoader();
// const lightMat = new THREE.MeshBasicMaterial({
//   opacity: 0.4,
//   map: loader.load('/earthlights1k.jpg'),
//   blending: THREE.AdditiveBlending,
//   transparent: true,
// });

// const cloudMat = new THREE.MeshStandardMaterial({
//   transparent: true,
//   opacity: 0.6,
//   map: loader.load('/earthcloudmap.jpg'),
//   blending: THREE.AdditiveBlending,
// });

// const cloudsMesh = new THREE.Mesh(earthMesh, cloudMat);
// // earthGroup.add(cloudsMesh);

// const lightsMesh = new THREE.Mesh(earthMesh, lightMat);
// earthGroup.add(lightsMesh);

camera.position.z = 5;

loader.load(
  '/moonmap4k.jpg',
  (texture) => {
    earth.material.map = texture;
    earth.material.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.error('Texture failed to load:', error);
  }
);

const stars = getStarField({ numStars: 1000 });
scene.add(stars);
const objGeo = new THREE.SphereGeometry();
const objMat = new THREE.MeshStandardMaterial({
  color: 'blue',
});
const obj = new THREE.Mesh(objGeo, objMat);
scene.add(obj);
obj.position.set(10, 10, 2);

const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
  mousePosition.x = e.clientX / window.innerWidth;
  mousePosition.y = e.clientY / window.innerHeight;
});

const rayCaster = new THREE.Raycaster();
// Animation loop
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.01;
  // lightsMesh.rotation.y += 0.01;
  // cloudsMesh.rotation.y += 0.01;
  controls.update();

  renderer.render(scene, camera);
}
animate();
