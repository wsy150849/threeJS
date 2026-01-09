import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");
// 1.创建场景
const scene = new THREE.Scene();
scene.background = null;
// 2.创建相机
const fov = 75; // 垂直方向为75度
const aspect = canvas.clientWidth / canvas.clientHeight; // 画布的宽高比
const near = 0.1;
const far = 10; // near和far代表近平面和远平面，它们限制了摄像机面朝方向的可绘区域
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2; // 将相机位置设置为z轴上的2单位
// 3.创建渲染器
const renderer = new THREE.WebGLRenderer({
  canvas, // 渲染器要渲染的画布
  antialias: true, // 开启抗锯齿
});
renderer.setClearAlpha(0.5); // 设置清除颜色的透明度
renderer.setSize(canvas.clientWidth, canvas.clientHeight); // 设置渲染器的渲染区域大小
renderer.setPixelRatio(window.devicePixelRatio); // 设置渲染器的像素比
// 4.创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 5.创建材质
const material = new THREE.MeshPhongMaterial({
  color: 0x000000, // 材质颜色
  specular: 0xffffff, // 材质高光颜色
  shininess: 100, // 材质高光指数
  metalness: 1.0, // 材质金属度
  roughness: 0.8, // 材质粗糙度
  flatShading: true, // 开启平面着色
  emissive: 0xc7b7a8, // 材质自发光颜色
  emissiveIntensity: 0.5, // 材质自发光强度
});
// 6.创建网格
const mesh = new THREE.Mesh(geometry, material);
// 7.将网格添加到场景中
scene.add(mesh);
// 8.渲染场景
renderer.render(scene, camera);

// 11. 创建光源
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(1, 1, 1);
scene.add(light1);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-1, -1, -1);
scene.add(light2);
const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(0, 1, 0);
scene.add(light3);


// 12. 创建控制器
const controls = new OrbitControls(camera, renderer.domElement); // 实例化控制器
// 配置控制器
controls.enableDamping = true; // 开启阻尼效果
controls.dampingFactor = 0.05; // 阻尼系数
controls.minDistance = 1; // 最小距离
controls.maxDistance = 5; // 最大距离

// 9. 动画
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // 更新控制器状态
  renderer.render(scene, camera);
}
animate();
