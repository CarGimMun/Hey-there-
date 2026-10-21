import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// EDIT THESE THREE ENTRIES: replace titles, descriptions, tags and URLs with your real GitHub projects.
const projects = [
  {
    number: '01', category: 'AI · HEALTH LITERACY', title: 'AIClaro',
    description: 'Exploring how AI can make clinical discharge information easier to understand — connecting language technology with patient-centred care.',
    tags: ['AI', 'HEALTH', 'PYTHON'], url: 'https://github.com/CarGimMun'
  },
  {
    number: '02', category: 'BIOMEDICAL DATA · VISUALISATION', title: 'Signals & Stories',
    description: 'A space for a biomedical data, signal-processing or monitoring project. Replace this text with the question, method and result of your own work.',
    tags: ['DATA', 'PYTHON', 'VISUALS'], url: 'https://github.com/CarGimMun'
  },
  {
    number: '03', category: 'HUMAN MOVEMENT · RESEARCH', title: 'Human in Motion',
    description: 'A space for a neurorehabilitation, movement-analysis or experimental project. Show what you explored and what you learned.',
    tags: ['BIOMED', 'RESEARCH', 'MOTION'], url: 'https://github.com/CarGimMun'
  }
];

const aboutProject = {
  number: 'ME', category: 'BIOMEDICAL ENGINEER · CREATIVE EXPLORER',
  title: 'Carmen, in progress.', description: 'Biomedical Engineering graduate studying Biomedical Engineering and Medical Physics at TUM. Interested in the meeting point of health, data, AI and visual storytelling.',
  tags: ['CURIOSITY', 'SCIENCE', 'DESIGN'], url: '#about'
};

const card = {
  index: document.querySelector('#card-index'),
  category: document.querySelector('#card-category'),
  title: document.querySelector('#card-title'),
  description: document.querySelector('#card-description'),
  tags: document.querySelector('#card-tags'),
  link: document.querySelector('#card-link')
};

function selectProject(which) {
  const data = which === 'about' ? aboutProject : projects[Number(which)];
  if (!data) return;
  card.index.textContent = `SELECTED / ${data.number}`;
  card.category.textContent = data.category;
  card.title.innerHTML = data.title.replace(/ & /g, ' &amp; ').replace(/, /g, ',<br>');
  card.description.textContent = data.description;
  card.tags.innerHTML = '';
  data.tags.forEach(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    card.tags.appendChild(span);
  });
  card.link.href = data.url;
  card.link.innerHTML = (which === 'about' ? 'MEET THE HUMAN' : 'EXPLORE PROJECT') + ' <span>↗</span>';
  card.link.target = data.url.startsWith('http') ? '_blank' : '';
  card.link.rel = data.url.startsWith('http') ? 'noreferrer' : '';
  document.querySelectorAll('.chamber-marker').forEach(b => b.classList.toggle('active', b.dataset.project === String(which)));
}
document.querySelectorAll('.chamber-marker').forEach(button => {
  button.addEventListener('click', () => selectProject(button.dataset.project));
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Three.js scene: loads assets/heart.glb if you add a model; otherwise uses a stylised 3D heart shape.
const host = document.querySelector('#heart-canvas');
let scene, camera, renderer, heart, mixer, clock, fallbackHeart;
let pointerDown = false, lastX = 0, lastY = 0, userRotated = false;
let targetRotationY = 0, targetRotationX = 0;

function makeFallbackHeart() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.7);
  shape.bezierCurveTo(-0.1, -0.45, -1.05, 0.15, -0.92, 0.75);
  shape.bezierCurveTo(-0.83, 1.22, -0.25, 1.28, 0, 0.76);
  shape.bezierCurveTo(0.35, 1.32, 0.95, 1.13, 0.97, 0.68);
  shape.bezierCurveTo(1.0, 0.18, 0.25, -0.43, 0, -0.7);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.42, bevelEnabled: true, bevelSegments: 7, steps: 2, bevelSize: 0.13, bevelThickness: 0.13, curveSegments: 24 });
  geometry.center();
  const material = new THREE.MeshPhysicalMaterial({ color: 0x9d2027, roughness: 0.31, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.2, emissive: 0x310509, emissiveIntensity: 0.42 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = 0.12;
  mesh.scale.set(1.05, 1.05, 0.95);
  const group = new THREE.Group();
  group.add(mesh);

  // Fine luminous vessel-like curves make the fallback feel designed rather than like a flat icon.
  const vesselMaterial = new THREE.MeshStandardMaterial({ color: 0xff514a, emissive: 0x8b1019, emissiveIntensity: 1.5, roughness: 0.35 });
  const paths = [
    [[-0.48,0.65,0.2],[-0.35,0.95,0.26],[-0.14,1.08,0.23],[0.03,0.94,0.22]],
    [[0.05,0.84,0.22],[0.22,1.12,0.23],[0.42,1.18,0.19],[0.57,1.03,0.18]],
    [[-0.3,0.54,0.24],[-0.58,0.3,0.23],[-0.54,0.04,0.22]],
    [[0.27,0.55,0.24],[0.54,0.31,0.23],[0.59,0.02,0.22]]
  ];
  paths.forEach(points => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.025, 7, false), vesselMaterial);
    group.add(tube);
  });
  return group;
}

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 6.3);
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  host.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffd8d1, 1.8));
  const key = new THREE.PointLight(0xff5b53, 42, 14); key.position.set(-3, 3, 4); scene.add(key);
  const rim = new THREE.PointLight(0x9d2635, 34, 12); rim.position.set(3, -1, -2); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffe7d9, 2.2); fill.position.set(0, 4, 5); scene.add(fill);

  fallbackHeart = makeFallbackHeart();
  scene.add(fallbackHeart);
  heart = fallbackHeart;
  clock = new THREE.Clock();

  // To use a downloaded model, put it at assets/heart.glb. If absent or incompatible, the custom heart remains visible.
  const loader = new GLTFLoader();
  loader.load('assets/heart.glb', gltf => {
    scene.remove(fallbackHeart);
    heart = gltf.scene;
    heart.scale.setScalar(1.45);
    const box = new THREE.Box3().setFromObject(heart);
    const center = box.getCenter(new THREE.Vector3());
    heart.position.sub(center);
    scene.add(heart);
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(heart);
      gltf.animations.forEach(clip => mixer.clipAction(clip).play());
    }
  }, undefined, () => {
    // Keep the custom 3D heart as a graceful fallback until a model is added.
  });

  host.addEventListener('pointerdown', e => { pointerDown = true; lastX = e.clientX; lastY = e.clientY; host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', e => {
    if (!pointerDown || !heart) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    targetRotationY += dx * 0.008; targetRotationX += dy * 0.005;
    targetRotationX = Math.max(-0.55, Math.min(0.55, targetRotationX));
    lastX = e.clientX; lastY = e.clientY; userRotated = true;
  });
  host.addEventListener('pointerup', () => pointerDown = false);
  host.addEventListener('pointercancel', () => pointerDown = false);
  host.addEventListener('wheel', e => { camera.position.z = Math.max(4.2, Math.min(8, camera.position.z + e.deltaY * 0.003)); }, { passive: true });
  window.addEventListener('resize', resize);
  animate();
}
function resize() {
  if (!renderer || !camera) return;
  const w = host.clientWidth, h = host.clientHeight;
  camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
}
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  if (heart) {
    if (!pointerDown && !userRotated) targetRotationY = Math.sin(t * 0.22) * 0.12;
    heart.rotation.y += (targetRotationY - heart.rotation.y) * 0.06;
    heart.rotation.x += (targetRotationX - heart.rotation.x) * 0.06;
    const beat = 1 + 0.022 * Math.pow(Math.max(0, Math.sin(t * 3.1)), 8) + 0.012 * Math.pow(Math.max(0, Math.sin(t * 3.1 - .65)), 12);
    heart.scale.setScalar((heart === fallbackHeart ? 1 : 1.45) * beat);
  }
  if (mixer) mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}
try { initScene(); } catch (err) {
  host.innerHTML = '<div class="model-fallback-message">3D preview is unavailable in this browser. The rest of the portfolio still works.</div>';
  console.error(err);
}
selectProject(0);
