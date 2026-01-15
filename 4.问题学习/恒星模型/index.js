import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 300;
const scene = new THREE.Scene();
const helper = new THREE.AxesHelper(100); // 坐标轴助手 🔴 红X  🟢 绿Y  🔵 蓝Z
scene.add(helper);

// 宇宙来光
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);

// ☀️ 恒星模型
const geometry = new THREE.SphereGeometry(30, 50, 50);
const material = new THREE.MeshPhongMaterial({
  color: 0xffff00, // 基本颜色
  emissive: 0xff4400, // 自发光
  emissiveIntensity: 2, // 发光强度
  shininess: 1000, // 高光强度
});
const sun = new THREE.Mesh(geometry, material);
sun.position.set(0, 0, 0);
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(50, 50, 50); // 光源位置
// sunLight.position.copy(sun.position);
scene.add(sun);
scene.add(sunLight);
const sunhelper = new THREE.AxesHelper(100); // 坐标轴助手 🔴 红X  🟢 绿Y  🔵 蓝Z
sun.add(sunhelper);
// 恒星自传
const sunOrb = new OrbitControls(camera, renderer.domElement);
sunOrb.enableDamping = true;
sunOrb.dampingFactor = 0.05;
sunOrb.addEventListener("change", () => {
  renderer.render(scene, camera);
});

// 太阳系
const SunSystem = new THREE.Group();
SunSystem.position.copy(sun.position);
scene.add(SunSystem);

// 地月系 🌏
const EarthMoonSystem = new THREE.Group();
EarthMoonSystem.position.set(0, 0, 0); // 不要用 earth.position
SunSystem.add(EarthMoonSystem);

// 🌏 地球
const earthGeometry = new THREE.SphereGeometry(15, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  shininess: 100,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(200, 0, 0);
EarthMoonSystem.add(earth);
// const earthHepler = new THREE.AxesHelper(20); // 坐标轴助手 🔴 红X  🟢 绿Y  🔵 蓝Z
// earth.add(earthHepler);

// 月球
const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
const diffuseMap  = new THREE.TextureLoader().load("./i.png");
const normalMap  = new THREE.TextureLoader().load("./i.png");
const displacementMap  = new THREE.TextureLoader().load("./i.png");
const roughnessMap  = new THREE.TextureLoader().load("./i.png");
const aoMap  = new THREE.TextureLoader().load("./i.png");
const moonMaterial = new THREE.MeshStandardMaterial({
    map: diffuseMap,        // 颜色贴图
    // normalMap: normalMap,   // 法线贴图增加细节
    displacementMap: displacementMap, // 位移贴图
    displacementScale: 0.1, // 位移强度
    roughnessMap: roughnessMap, // 粗糙度贴图
    roughness: 0.9,
    metalness: 0.05,
    aoMap: aoMap,           // 环境光遮蔽贴图
    aoMapIntensity: 1.0
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(60, 0, 0);
earth.add(moon);
// const moonHepler = new THREE.AxesHelper(10); // 坐标轴助手 🔴 红X  🟢 绿Y  🔵 蓝Z
// moon.add(moonHepler);

// 🚀组
const rocketGroup = new THREE.Group();
scene.add(rocketGroup);
// 头部
const rocketHeadGeometry = new THREE.ConeGeometry(1, 2);
const rocketHeadMaterial = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  shininess: 50,
});
const rocketHead = new THREE.Mesh(rocketHeadGeometry, rocketHeadMaterial);
rocketHead.position.set(0, -4, 0);
rocketHead.rotation.x = Math.PI / 1;
rocketGroup.add(rocketHead);
// 身体
const { radiusTop, radiusBottom, height } = {
  radiusTop: 1,
  radiusBottom: 1,
  height: 6,
};
const rocketBodyGeometry = new THREE.CylinderGeometry(
  radiusTop,
  radiusBottom,
  height,
);
const rocketBodyMaterial = new THREE.MeshPhongMaterial({
  color: 0xaaaaaa,
  shininess: 50,
});
const rocketBody = new THREE.Mesh(rocketBodyGeometry, rocketBodyMaterial);
// rocketBody.position.set(30, 0 , 30)
rocketGroup.add(rocketBody);
rocketGroup.position.set(-30, 0, 0);
earth.add(rocketGroup);

// 空间站
import { ModularSpaceStation } from "./space_station.js";
const spaceStation = new ModularSpaceStation();
spaceStation.station.position.set(0, 60, 0);
earth.add(spaceStation.station);
// 添加空间站模块
spaceStation.addModule("HUB", { x: 0, y: 0, z: 0 });
spaceStation.addModule("LAB", { x: 10, y: 0, z: 0 });
spaceStation.addModule("LIVING", { x: 20, y: 0, z: 0 });
spaceStation.addModule("STORAGE", { x: 30, y: 0, z: 0 });
spaceStation.addModule("POWER", { x: 40, y: 0, z: 0 });

// 添加星空背景
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 2000;
}

starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
ambientLight.intensity = 0.1;
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 500;
earth.receiveShadow = true;
earth.castShadow = true;
moon.receiveShadow = true;
moon.castShadow = true;

function animate() {
  requestAnimationFrame(animate);
  // 太阳自转
  sun.rotation.z += 0.01;
  // 地球自转
  earth.rotation.z += 0.05;
  // 地球公转
  EarthMoonSystem.rotation.z += 0.01;
  // 月球自转
  moon.rotation.z += 0.05;
  // 月球绕地球公转
  // 如果用 moonSystem 容器可以旋转它

  renderer.render(scene, camera);
}
animate();

renderer.render(scene, camera);
