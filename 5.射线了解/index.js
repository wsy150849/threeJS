import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
light1.position.set(1, 1, 1);
scene.add(light1);

const animate = () => {
  requestAnimationFrame(animate);
  orb.update();
  renderer.render(scene, camera);
};
animate();

// 射线了解

// 创建射线对象
const ray = new THREE.Ray();
// 设置射线起点
ray.origin = new THREE.Vector3(10, 10, 10);
// 设置射线方向
ray.direction = new THREE.Vector3(-1, -1, -1).normalize();

// 三角形
const p1 = new THREE.Vector3(0, 0, 0);
const p2 = new THREE.Vector3(1, 0, 0);
const p3 = new THREE.Vector3(0, 1, 0);

const point = new THREE.Vector3();
// 使用射线与三角形相交测试
const intersection = ray.intersectTriangle(p1, p2, p3, true, point);
console.log('交叉点坐标:', point);
console.log('查看是否相交:', intersection);

renderer.render(scene, camera);