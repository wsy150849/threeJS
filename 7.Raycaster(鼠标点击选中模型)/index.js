import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//#region 创建场景
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

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-10, -10, -10);
scene.add(light2);

const animate = () => {
  requestAnimationFrame(animate);
  orb.update();
  renderer.render(scene, camera);
};
animate();

// #endregion

renderer.domElement.addEventListener('click', e => {
  // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
  const ox = e.offsetX;
  const oy = e.offsetY;
  //屏幕坐标ox、oy转WebGL标准设备坐标x、y
  //width、height表示canvas画布宽高度
  const x = (ox / renderer.domElement.clientWidth) * 2 - 1;
  const y = -(oy / renderer.domElement.clientHeight) * 2 + 1;
  const raycaster = new THREE.Raycaster();
  // 在点击位置创建一条射线，用来选中拾取模型对象
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
  const inters = raycaster.intersectObject(cube, true);
  console.log(inters);
  if(inters.length > 0){
    inters[0].object.material.color.set(0xff0000);
  }
});

// 为什么屏幕坐标要转标准设备坐标？
// 因为射线投射器需要标准化设备坐标来计算射线方向

// 为什么我点击模型，看上去只有3个面改变了颜色？
// 立方体6个面其实完全都变了颜色，你之所以无论怎么转，都感觉只有三个面变了颜色。是因为MeshPhongMaterial + 单向光照 + 高光/阴影，把背向光源的面“吃掉了”
// 解决方案，再加一个背面的光源，这样就能看到一个完全变色的立方体了