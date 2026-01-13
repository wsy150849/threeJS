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
const far = 5; // near和far代表近平面和远平面，它们限制了摄像机面朝方向的可绘区域
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
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
// 6.创建网格
const cube = new THREE.Mesh(geometry, material);
// 7.将网格添加到场景中
scene.add(cube);
// 8.渲染场景
renderer.render(scene, camera);

// 12. 创建控制器
const controls = new OrbitControls(camera, renderer.domElement); // 实例化控制器
// 配置控制器
controls.enableDamping = true; // 开启阻尼效果
controls.dampingFactor = 0.05; // 阻尼系数
controls.minDistance = 1; // 最小距离
controls.maxDistance = 5; // 最大距离

// 初始化 WebSocket 连接
let socket;
const init = () => {
  socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("连接成功");
  };
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("收到数据:", data);

    // 根据接收到的数据更新场景
    if (data.sender === "scene1") {
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
};
init();
// 9. 动画
function animate() {
  requestAnimationFrame(animate);
  // 10. 旋转网格
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update(); // 更新控制器状态
  renderer.render(scene, camera);
  // 发送数据给服务器
  const data = {
    sender: "scene2",
    x: cube.position.x,
    y: cube.position.y,
    rotationX: cube.rotation.x,
    rotationY: cube.rotation.y,
    clicked: false,
    timestamp: Date.now(),
  };
  // if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data));
}
animate();

controls.addEventListener("change", function () {
  // 发送数据给服务器
  const data = {
    sender: "scene2",
    x: cube.position.x,
    y: cube.position.y,
    rotationX: cube.rotation.x,
    rotationY: cube.rotation.y,
    clicked: false,
    timestamp: Date.now(),
  };
  console.log("🚀 ~ data:", data);
  socket.send(JSON.stringify(data));
});
// 11. 创建光源
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(1, 1, 1);
scene.add(light1);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-1, -1, -1);
scene.add(light2);

// 点击事件
window.addEventListener("click", (event) => {
  // Three.js 射线检测
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(cube);

  if (socket.readyState === WebSocket.OPEN) {
    // 发送数据给服务器
    const data = {
      sender: "scene2",
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
let reconnectAttempts = 0;
let maxReconnectAttempts = 5;
function attemptReconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    const delay = Math.min(1000 * reconnectAttempts, 10000);

    console.log(`${reconnectAttempts}秒后尝试重连...`);

    setTimeout(() => {
      init();
    }, delay);
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    console.log("页面回到前台，检查连接...");
    // 检查连接状态，如果断开则重连
    if (socket.readyState === WebSocket.CLOSED) {
      attemptReconnect();
    }
  } else {
    console.log("页面进入后台，断开连接...");
    // 断开连接
    socket.close();
  }
}
document.addEventListener("visibilitychange", handleVisibilityChange);
