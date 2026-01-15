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
camera.position.x = -35; // 相机位置
// camera.position.y = -35; // 相机位置
camera.position.z = 35; // 相机位置

scene.add(camera)

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
Array.from({ length: 1 }).forEach(() => {
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
light.position.set(50, 50, 50); // 设置方向光位置
light.target.position.set(0, 0, 0); // 
light1.position.set(50, -50, -50); // 设置方向光位置
light1.target.position.set(0, 0, 0); // 
// scene.add(light); // 添加方向光到场景// 👇 光方向可视化
const helper = new THREE.DirectionalLightHelper(light, 3)
scene.add(helper)
scene.add(light.target)
// #region 👇 光方向可视化,使用线和块来表示光源和光的路径，观察方便
const helper1 = new THREE.DirectionalLightHelper(light1, 3)
scene.add(helper1)
scene.add(light1); // 添加方向光到场景
scene.add(light1.target)
// #endregion

// #region --- 使用箭头来表示光线的方向，在3D中看起来并不是特别方便
const dir = new THREE.Vector3()
dir.subVectors(light1.target.position, light1.position).normalize() // 理解：计算从光源到目标点的方向向量，并归一化，归一化是为了方便表示方向，因为方向并不在乎远近
const arrow = new THREE.ArrowHelper(dir, light1.position,50, 0xffaa00)

const toCube = new THREE.Vector3()
toCube.subVectors(cubes[0].position, light1.position).normalize()
const dot = dir.dot(toCube)

cubes[0].material.color.setRGB(Math.max(dot, 0),Math.max(dot, 0),Math.max(dot, 0))
console.log("🚀 ~ dot:", dot)
const cubeArrow = new THREE.ArrowHelper(toCube, light1.position,50, 0xff4400) // 指向cube的方向
scene.add(arrow)
scene.add(cubeArrow)

const axesHelper = new THREE.AxesHelper(5) // 坐标轴助手 🔴 红X  🟢 绿Y  🔵 蓝Z
scene.add(axesHelper)
// #endregion

const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
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
