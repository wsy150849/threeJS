import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
let canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas }); // 创建渲染器
renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
); // 创建相机
camera.position.z = 15; // 相机位置
const scene = new THREE.Scene(); // 创建场景

const box = new THREE.BoxGeometry(1, 1, 1); // 创建盒子几何体
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
const material = colors.map(
  (i) => new THREE.MeshPhongMaterial({ color: colors }),
); // 创建材质
let cubes = [],
  cube;
Array.from({ length: 100 }).forEach((i) => {
  cube = new THREE.Mesh(box, material); // 创建网格
  cube.position.set(
    Math.random() * 15 - 2.5,
    Math.random() * 15 - 2.5,
    Math.random() * 15 - 2.5,
  ); // 设置网格位置
  cubes.push(cube);
  scene.add(cube); // 添加网格到场景
});

const light1 = new THREE.DirectionalLight(0xffffff, 1); // 创建方向光
const light2 = new THREE.DirectionalLight(0xffff00, 1); // 创建方向光
light1.position.set(1, 1, 1); // 设置方向光位置
light2.position.set(-1, 1, 1); // 设置方向光位置
scene.add(light1); // 添加方向光到场景
scene.add(light2); // 添加方向光到场景

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.addEventListener("change", () => {
  // 监听相机变化
  renderer.render(scene, camera); // 渲染场景
});

function animate() {
  //   cube.rotation.x += 0.01;
  cubes.forEach((i) => {
    i.rotation.y += Math.random() * 0.1;
  });
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera); // 渲染场景
}

animate();
renderer.render(scene, camera); // 渲染场景
