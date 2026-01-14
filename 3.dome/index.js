import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({ canvas }); // 创建渲染器
renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器大小

const scene = new THREE.Scene(); // 创建场景
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // 创建相机
camera.position.z = 5; // 相机位置

const geometry = new THREE.SphereGeometry(0.4, 32, 32); // 创建球体几何体
// 将几何体转为非索引（toNonIndexed），并为每个顶点添加颜色属性
const coloredGeometry = geometry.toNonIndexed();
coloredGeometry.computeBoundingBox();
const posAttr = coloredGeometry.getAttribute("position");
const vertCount = posAttr.count;
const colors = new Float32Array(vertCount * 3);
const minY = coloredGeometry.boundingBox.min.y;
const maxY = coloredGeometry.boundingBox.max.y;
for (let i = 0; i < vertCount; i++) {
  const y = posAttr.getY(i);
  const t = (y - minY) / (maxY - minY); // 0..1 从底部到顶部
  const col = new THREE.Color().setHSL(0.6 * t, 1.0, 0.5); // 根据高度生成渐变色
  colors[i * 3] = col.r;
  colors[i * 3 + 1] = col.g;
  colors[i * 3 + 2] = col.b;
}
coloredGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

let cubes = [], cube;
Array.from({ length: 100 }).forEach(() => {
  const material = new THREE.MeshPhongMaterial({
    vertexColors: true,
    shininess: 50,
  }); // 使用顶点颜色的材质
  cube = new THREE.Mesh(coloredGeometry, material); // 创建网格，使用带颜色的几何体
  cube.position.set(
    Math.random() * 10 - 1.5,
    Math.random() * 10 - 1.5,
    Math.random() * 10 - 1.5
  );
  scene.add(cube);
  cubes.push(cube);
});

const light = new THREE.DirectionalLight(0xffffff, 1); // 创建方向光
const light1 = new THREE.DirectionalLight(0xffffff, 1); // 创建方向光
light.position.set(1, 1, 1); // 设置方向光位置
light1.position.set(-1, -1, -1); // 设置方向光位置
scene.add(light); // 添加方向光到场景
scene.add(light1); // 添加方向光到场景

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.addEventListener("change", () => {
  // 监听相机变化
  renderer.render(scene, camera); // 渲染场景
});

function animate() {
  cubes.forEach((i) => {
    i.rotation.y += Math.random() * 0.1;
    i.rotation.x += Math.random() * 0.1;
  });
  //
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera); // 渲染场景
}
animate();

renderer.render(scene, camera); // 渲染场景
