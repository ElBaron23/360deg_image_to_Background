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

const control = new OrbitControls(camera , canvas); // إضافة أدوات التحكم بالكاميرا للسماح بتدوير المشهد.

const renderer = new THREE.WebGLRenderer({
    canvas, // تعيين اللوحة (كانفاس) التي سيتم عرض المشهد عليها.
});
renderer.setSize(size.width , size.height); // ضبط حجم العرض وفقًا لحجم النافذة.

renderer.render(scene,camera); // رسم المشهد باستخدام الكاميرا.

const tick = ()=>{
    renderer.render(scene , camera); // إعادة رسم المشهد في كل إطار.
    window.requestAnimationFrame(tick); // استدعاء الدالة في الإطار التالي لإعادة الرسم.
}
tick(); // بدء الحلقة المتكررة لرسم المشهد.
