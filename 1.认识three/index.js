import * as THREE from 'three'

const canvas = document.getElementById('canvas')
// 1.创建场景
const scene = new THREE.Scene()
scene.background = null
// 2.创建相机
const fov = 75; // 垂直方向为75度
const aspect = canvas.clientWidth / canvas.clientHeight;  // 画布的宽高比
const near = 0.1;
const far = 5; // near和far代表近平面和远平面，它们限制了摄像机面朝方向的可绘区域
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2 // 将相机位置设置为z轴上的2单位
// 3.创建渲染器
const renderer = new THREE.WebGLRenderer({
  canvas, // 渲染器要渲染的画布
  antialias: true // 开启抗锯齿
})
renderer.setClearAlpha(0.5) // 设置清除颜色的透明度
renderer.setSize(canvas.clientWidth, canvas.clientHeight) // 设置渲染器的渲染区域大小
renderer.setPixelRatio(window.devicePixelRatio) // 设置渲染器的像素比
// 4.创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 5.创建材质
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
// 6.创建网格
const mesh = new THREE.Mesh(geometry, material)
// 7.将网格添加到场景中
scene.add(mesh)
// 8.渲染场景
renderer.render(scene, camera)

// 9. 动画
function animate() {
  requestAnimationFrame(animate)
  // 10. 旋转网格
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()

// 11. 创建光源
const light1 = new THREE.DirectionalLight(0xffffff, 1)
light1.position.set(1, 1, 1)
scene.add(light1)
const light2 = new THREE.DirectionalLight(0xffffff, 1)
light2.position.set(-1, -1, -1)
scene.add(light2)
