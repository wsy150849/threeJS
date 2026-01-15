import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ---------- 基础渲染器和相机 ----------
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(200, 150, 200);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ---------- 坐标轴辅助 ----------
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);

// ---------- 环境光 ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambientLight);

// ---------- 太阳 ----------
const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
const sunMaterial = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  emissive: 0xffaa00,
  emissiveIntensity: 1.5,
  shininess: 1000,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0);
scene.add(sun);
sun.add(axesHelper);

// ---------- 太阳光（方向光模拟太阳光） ----------
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(50, 50, 50); // 光源位置
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 500;
sunLight.shadow.camera.left = -200;
sunLight.shadow.camera.right = 200;
sunLight.shadow.camera.top = 200;
sunLight.shadow.camera.bottom = -200;
scene.add(sunLight);

// ---------- 太阳系容器 ----------
const SunSystem = new THREE.Group();
scene.add(SunSystem);
SunSystem.add(sun);

// ---------- 地球公转容器 ----------
const EarthOrbit = new THREE.Group();
SunSystem.add(EarthOrbit);

// ---------- 地球 ----------
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  shininess: 100,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(100, 0, 0);
earth.castShadow = true;
earth.receiveShadow = true;
EarthOrbit.add(earth);

// ---------- 月球公转容器 ----------
const MoonOrbit = new THREE.Group();
MoonOrbit.position.set(0, 0, 0); // 相对于地球
earth.add(MoonOrbit);

// ---------- 月球 ----------
const moonGeometry = new THREE.SphereGeometry(2, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  shininess: 50,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(20, 0, 0); // 离地球20单位
moon.castShadow = true;
moon.receiveShadow = true;
MoonOrbit.add(moon);

// ---------- 动画循环 ----------
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  // 太阳自转
  SunSystem.rotation.y += 0.01;

  // 地球自转
  earth.rotation.y += 0.05;

  // 地球公转
  EarthOrbit.rotation.y += 0.01;

  // 月球自转
  moon.rotation.y += 0.05;

  // 月球绕地球公转
  MoonOrbit.rotation.y += 0.02;

  renderer.render(scene, camera);
}

animate();
