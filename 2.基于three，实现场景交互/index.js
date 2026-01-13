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
const materials = [
  new THREE.MeshPhongMaterial({ color: 0x00ff00 }), // 左
  new THREE.MeshPhongMaterial({ color: 0x0000ff }), // 上
  new THREE.MeshPhongMaterial({ color: 0xffff00 }), // 下
  new THREE.MeshPhongMaterial({ color: 0xff00ff }), // 前
  material,
  new THREE.MeshPhongMaterial({ color: 0x00ffff }), // 后
];
// 6.创建网格
const cube = new THREE.Mesh(geometry, materials);
// 7.将网格添加到场景中
scene.add(cube);
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
// 监听交互变化
let lastZoom = camera.position.length();
let lastRotation = { x: 0, y: 0 };
controls.addEventListener("change", function () {
  // 获取当前缩放值（基于相机距离）
  const currentZoom = camera.position.length();
  const zoomDelta = currentZoom - lastZoom;

  if (Math.abs(zoomDelta) > 0.001) {
    console.log("缩放变化:", {
      缩放比例: currentZoom / lastZoom,
      缩放差值: zoomDelta,
      当前距离: currentZoom,
    });
    lastZoom = currentZoom;
  }

  // 获取旋转角度（使用球坐标转换）
  const spherical = new THREE.Spherical();
  spherical.setFromVector3(camera.position);

  const rotationX = spherical.phi; // 垂直角度
  const rotationY = spherical.theta; // 水平角度

  const rotationDelta = {
    x: rotationX - lastRotation.x,
    y: rotationY - lastRotation.y,
  };

  if (Math.abs(rotationDelta.x) > 0.01 || Math.abs(rotationDelta.y) > 0.01) {
    console.log("旋转变化:", {
      水平角度: THREE.MathUtils.radToDeg(rotationY),
      垂直角度: THREE.MathUtils.radToDeg(rotationX),
      旋转差值: {
        x: THREE.MathUtils.radToDeg(rotationDelta.x),
        y: THREE.MathUtils.radToDeg(rotationDelta.y),
      },
    });
    lastRotation = { x: rotationX, y: rotationY };
  }
});

// // 创建变换控制器
// const transformControls = new TransformControls(camera, renderer.domElement);
// transformControls.attach(mesh); // 附加到立方体
// scene.add(transformControls);

// // 监听变换事件
// transformControls.addEventListener('change', () => {
//     console.log('立方体变换参数:', {
//         position: mesh.position.toArray(),
//         scale: mesh.scale.toArray(),
//         rotation: [
//             THREE.MathUtils.radToDeg(mesh.rotation?.x || 0),
//             THREE.MathUtils.radToDeg(mesh.rotation?.y || 0),
//             THREE.MathUtils.radToDeg(mesh.rotation?.z || 0)
//         ],
//         quaternion: mesh.quaternion.toArray()
//     });
// });

// // 监听拖拽开始/结束
// transformControls.addEventListener('dragging-changed', (event) => {
//     controls.enabled = !event.value; // 禁用 OrbitControls 当 TransformControls 激活时
// });

const socket = new WebSocket("ws://localhost:8080");
socket.onopen = () => {
  console.log("连接成功");
};
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("收到数据:", data);

  // 根据接收到的数据更新场景
  if (data.sender === "scene2") {
    cube.position.x = data.x || 0;
    cube.position.y = data.y || 0;
    cube.rotation.x = data.rotationX || 0;
    cube.rotation.y = data.rotationY || 0;
  }
};

socket.onerror = (error) => {
  console.error("WebSocket 错误:", error);
};

socket.onclose = () => {
  console.log("WebSocket 连接关闭");
};

// 点击事件
window.addEventListener("click", (event) => {
  // Three.js 射线检测
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(cube);

  if ( socket.readyState === WebSocket.OPEN) {
    // 发送数据给服务器
    const data = {
      sender: "scene1",
      x: cube.position.x,
      y: cube.position.y,
      rotationX: cube.rotation.x,
      rotationY: cube.rotation.y,
      clicked: true,
      timestamp: Date.now(),
    };
    socket.send(JSON.stringify(data));

    // 视觉反馈
    cube.material.color.setHex(0x0000ff);
    setTimeout(() => {
      cube.material.color.setHex(0x00ff00);
    }, 300);
  }
});
