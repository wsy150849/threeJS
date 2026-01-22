import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//#region 创建场景
const canvas = document.getElementById('canvas');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({
  color: 0x000000,
  specular: 0xffffff,
  shininess: 100,
  metalness: 1.0,
  roughness: 0.8,
  flatShading: true,
  emissive: 0xc7b7a8,
  emissiveIntensity: 0.5,
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const orb = new OrbitControls(camera, renderer.domElement);
orb.enableDamping = true;
orb.dampingFactor = 0.25;
orb.enableZoom = false;

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-10, -10, -10);
scene.add(light2);

const animate = () => {
  requestAnimationFrame(animate);
  orb.update();
  renderer.render(scene, camera);
};
animate();

// #endregion

// 创建射线投射器
const raycaster = new THREE.Raycaster();
// 设置射线起点
raycaster.ray.origin = new THREE.Vector3(10, 10, 10);
// 设置射线方向
raycaster.ray.direction = new THREE.Vector3(-1, -1, -1).normalize();

// 测试射线是否与模型相交
const intersection = raycaster.intersectObject(cube, true);
console.log('查看是否相交:', intersection);
if (intersection.length > 0) {
  console.log('相交点坐标:', intersection[0].point);
  console.log('相交面法线:', intersection[0].face.normal);
  console.log('相交面索引:', intersection[0].faceIndex);
  console.log('相交面uv坐标:', intersection[0].uv);
  console.log("交叉对象", intersection[0].object);
  console.log("射线原点和交叉点距离", intersection[0].distance);
  intersection[0].object.material.color.set(0xff00ff)
}
renderer.render(scene, camera);

// 为什么屏幕坐标要转标准设备坐标？
// 因为射线投射器需要标准化设备坐标来计算射线方向
