import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// #region 创建场景
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 20;
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const orb = new OrbitControls(camera, renderer.domElement);

const animate = () => {
  requestAnimationFrame(animate);
  orb.update();
  renderer.render(scene, camera);
};
animate();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(-10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-10, -10, 10);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(-10, -10, -10);
scene.add(light3);

const light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(10, -10, 10);
scene.add(light4)

const light5 = new THREE.DirectionalLight(0xffffff, 1);
light5.position.set(10, 10, -10);
scene.add(light5)

const light6 = new THREE.DirectionalLight(0xffffff, 1);
light6.position.set(10, -10, -10);
scene.add(light6)

const light7 = new THREE.DirectionalLight(0xffffff, 1);
light7.position.set(-10, 10, -10);
scene.add(light7)

const nums = 100
const cubes = []

for (let i = 0; i < nums; i++) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
    specular: 0xffffff,
    shininess: 100,
    metalness: 1.0,
    roughness: 0.8,
    flatShading: true,
    emissive: 0xc7b7a8,
    emissiveIntensity: 0.5,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = Math.random() * 10 - 5;
  cube.position.y = Math.random() * 10 - 5;
  cube.position.z = Math.random() * 10 - 5;
  scene.add(cube);
  cubes.push(cube)
}
// #endregion

let color,index
renderer.domElement.addEventListener('click', e => {
    if(index && color) index.material.color.set(color) 
    const ox = e.offsetX;
    const oy = e.offsetY;
    const x = (ox / renderer.domElement.width) * 2 - 1;
    const y = -(oy / renderer.domElement.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x, y }, camera);
    const intersects = raycaster.intersectObjects(cubes);
    if (intersects.length > 0) {
        color = intersects[0].object.material.color.getHex()
        index = intersects[0].object
        intersects[0].object.material.color.set(0x000000)
    }
})



renderer.render(scene, camera);