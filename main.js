import * as THREE from 'three'; // استيراد مكتبة ثلاثة.js التي تستخدم لإنشاء مشاهد ثلاثية الأبعاد.
import { OrbitControls } from 'three/examples/jsm/Addons.js'; // استيراد أدوات التحكم بالكاميرا من مكتبة ثلاثية الأبعاد.

const cubeTextureLoader = new THREE.CubeTextureLoader(); // إنشاء محمل للخامات المكعبة لتحميل الخرائط البيئية.
const scene = new THREE.Scene(); // إنشاء مشهد ثلاثي الأبعاد لإضافة الكائنات والبيئة.
const canvas = document.getElementById('canvas'); // الحصول على عنصر اللوحة (كانفاس) من صفحة HTML لعرض المشهد عليه.

const environmentMap = cubeTextureLoader.load([
    "./img/px.png", // الجانب الإيجابي لمحور X (يمين)
    "./img/nx.png", // الجانب السلبي لمحور X (يسار)
    "./img/py.png", // الجانب الإيجابي لمحور Y (فوق)
    "./img/ny.png", // الجانب السلبي لمحور Y (تحت)
    "./img/pz.png", // الجانب الإيجابي لمحور Z (أمام)
    "./img/nz.png", // الجانب السلبي لمحور Z (خلف)
]);
scene.environmentMap = environmentMap; // تعيين الخريطة البيئية للمشهد.
scene.background = environmentMap; // تعيين الخلفية للمشهد باستخدام الخريطة البيئية.

const size = {
    width : window.innerWidth, // تحديد عرض المشهد ليكون بعرض النافذة.
    height: window.innerHeight, // تحديد ارتفاع المشهد ليكون بارتفاع النافذة.
}

window.addEventListener('resize',()=>{
    size.width = window.innerWidth; // تحديث عرض النافذة عند تغيير حجمها.
    size.height =  window.innerHeight; // تحديث ارتفاع النافذة عند تغيير حجمها.
    camera.aspect = size.width / size.height; // تحديث نسبة العرض إلى الارتفاع للكاميرا.
    camera.updateProjectionMatrix(); // تحديث مصفوفة الإسقاط للكاميرا لتطبيق التغييرات.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio , 2)); // ضبط دقة العرض وفقًا لجهاز المستخدم.
})

const camera = new THREE.PerspectiveCamera(75 ,size.width / size.height , 0.1 , 100); 
// إنشاء كاميرا منظور لتحديد ما يتم عرضه في المشهد.

camera.position.z = 20; // تحديد موقع الكاميرا على محور Z.

scene.add(camera); // إضافة الكاميرا إلى المشهد.

// --- New 3D Elements ---
// 1. Central Reflective Object (TorusKnot)
const knotGeometry = new THREE.TorusKnotGeometry(4, 1.2, 200, 32);
const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1,
    envMap: environmentMap, // Reflects the environment
    envMapIntensity: 1.5
});
const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
knotMesh.position.y = 1.5; // Move the 3D knot up
scene.add(knotMesh);

// 2. Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3. Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Mouse tracking for parallax
let mouseX = 0;
let mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});
// -----------------------

const control = new OrbitControls(camera , canvas); // إضافة أدوات التحكم بالكاميرا للسماح بتدوير المشهد.

const renderer = new THREE.WebGLRenderer({
    canvas, // تعيين اللوحة (كانفاس) التي سيتم عرض المشهد عليها.
});
renderer.setSize(size.width , size.height); // ضبط حجم العرض وفقًا لحجم النافذة.

renderer.render(scene,camera); // رسم المشهد باستخدام الكاميرا.

const clock = new THREE.Clock();

const tick = ()=>{
    const elapsedTime = clock.getElapsedTime();

    // Rotate objects
    knotMesh.rotation.y = elapsedTime * 0.2;
    knotMesh.rotation.x = elapsedTime * 0.1;
    particlesMesh.rotation.y = elapsedTime * -0.05;

    // Mouse parallax effect
    const targetX = mouseX * 0.005;
    const targetY = mouseY * 0.005;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    
    // We still want OrbitControls to work, so we shouldn't force lookAt every frame if we want orbit to work normally. 
    // But since it's a presentation background, gentle parallax is fine.
    
    control.update(); // Update orbit controls
    renderer.render(scene , camera); // إعادة رسم المشهد في كل إطار.
    window.requestAnimationFrame(tick); // استدعاء الدالة في الإطار التالي لإعادة الرسم.
}
tick(); // بدء الحلقة المتكررة لرسم المشهد.
