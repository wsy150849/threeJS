import * as THREE from "three";
export class  ModularSpaceStation {
  constructor() {
    this.station = new THREE.Group();
    this.modules = new Map(); // 存储所有模块
    
    // 定义模块类型（所有尺寸缩小一半）
    this.moduleTypes = {
      HUB: { size: [5, 5, 5], color: 0xcccccc },         // 原来 [10, 10, 10]
      LAB: { size: [4, 6, 4], color: 0x88aaff },         // 原来 [8, 12, 8]
      LIVING: { size: [6, 7.5, 5], color: 0xffaa88 },    // 原来 [12, 15, 10]
      STORAGE: { size: [5, 4, 5], color: 0x88ff88 },     // 原来 [10, 8, 10]
      POWER: { size: [3, 3, 3], color: 0xffff00 }        // 原来 [6, 6, 6]
    };
  }

  // 添加模块
  addModule(type, position, rotation = {x: 0, y: 0, z: 0}) {
    const config = this.moduleTypes[type];
    const module = this.createModule(config, type);
    
    // 位置也缩小一半
    module.position.set(position.x / 2, position.y / 2, position.z / 2);
    module.rotation.set(rotation.x, rotation.y, rotation.z);
    
    this.station.add(module);
    this.modules.set(module.uuid, { mesh: module, type, position });
    
    return module;
  }

  createModule(config, type) {
    const geometry = new THREE.BoxGeometry(...config.size);
    const material = new THREE.MeshStandardMaterial({ 
      color: config.color,
      metalness: 0.4,
      roughness: 0.6
    });
    
    const module = new THREE.Mesh(geometry, material);
    module.userData = { type: type, config: config };
    
    // 根据类型添加特定细节
    this.addModuleFeatures(module, type);
    
    return module;
  }

  addModuleFeatures(module, type) {
    const features = new THREE.Group();
    
    switch(type) {
      case 'HUB':
        // 添加对接端口
        this.addDockingPorts(features);
        break;
      case 'LAB':
        // 添加天线和传感器
        this.addAntennas(features);
        break;
      case 'POWER':
        // 添加太阳能板
        this.addSolarArray(features);
        break;
      case 'LIVING':
        // 添加窗户
        this.addWindows(features);
        break;
      case 'STORAGE':
        // 添加门
        this.addStorageDoors(features);
        break;
    }
    
    module.add(features);
  }

  // 补全 addDockingPorts 方法（所有尺寸缩小一半）
  addDockingPorts(parentModule) {
    const dockingPorts = new THREE.Group();
    
    // 创建对接端口几何体（尺寸缩小一半）
    const portGeometry = new THREE.CylinderGeometry(0.75, 0.6, 1, 12); // 原来 [1.5, 1.2, 2]
    const portMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x666666,
      metalness: 0.7,
      roughness: 0.3
    });
    
    // 在模块的六个方向添加对接端口（位置缩小一半）
    const positions = [
      { x: 2.5, y: 0, z: 0, rotation: { x: Math.PI/2, y: 0, z: 0 } },      // 原来 x:5
      { x: -2.5, y: 0, z: 0, rotation: { x: Math.PI/2, y: 0, z: 0 } },     // 原来 x:-5
      { x: 0, y: 2.5, z: 0, rotation: { x: 0, y: 0, z: 0 } },              // 原来 y:5
      { x: 0, y: -2.5, z: 0, rotation: { x: 0, y: 0, z: 0 } },             // 原来 y:-5
      { x: 0, y: 0, z: 2.5, rotation: { x: Math.PI/2, y: Math.PI/2, z: 0 } }, // 原来 z:5
      { x: 0, y: 0, z: -2.5, rotation: { x: Math.PI/2, y: Math.PI/2, z: 0 } } // 原来 z:-5
    ];
    
    positions.forEach(pos => {
      const port = new THREE.Mesh(portGeometry, portMaterial);
      port.position.set(pos.x, pos.y, pos.z);
      port.rotation.set(pos.rotation.x, pos.rotation.y, pos.rotation.z);
      dockingPorts.add(port);
    });
    
    parentModule.add(dockingPorts);
  }

  // 补全 addAntennas 方法（所有尺寸缩小一半）
  addAntennas(parentModule) {
    const antennas = new THREE.Group();
    
    // 天线几何体（尺寸缩小一半）
    const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.025, 1.5, 8); // 原来 [0.1, 0.05, 3]
    const antennaMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2
    });
    
    // 添加几个天线（位置缩小一半）
    const antennaPositions = [
      { x: 0, y: 3, z: 2 },      // 原来 y:6, z:4
      { x: 0, y: 3, z: -2 },     // 原来 y:6, z:-4
      { x: 2, y: 3, z: 0 },      // 原来 x:4, y:6, z:0
      { x: -2, y: 3, z: 0 }      // 原来 x:-4, y:6, z:0
    ];
    
    antennaPositions.forEach(pos => {
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.set(pos.x, pos.y, pos.z);
      antennas.add(antenna);
    });
    
    // 添加碟形天线（尺寸缩小一半）
    const dishGeometry = new THREE.CircleGeometry(1, 16); // 原来半径2
    const dishMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x555555,
      side: THREE.DoubleSide
    });
    const dish = new THREE.Mesh(dishGeometry, dishMaterial);
    dish.position.set(0, 3, 0); // 原来 y:6
    dish.rotation.x = Math.PI / 2;
    antennas.add(dish);
    
    parentModule.add(antennas);
  }

  // 补全 addSolarArray 方法（所有尺寸缩小一半）
  addSolarArray(parentModule) {
    const solarArray = new THREE.Group();
    
    // 太阳能板框架（尺寸缩小一半）
    const frameGeometry = new THREE.BoxGeometry(5, 0.1, 4); // 原来 [10, 0.2, 8]
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      metalness: 0.6,
      roughness: 0.4
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 1.5; // 原来 y:3
    solarArray.add(frame);
    
    // 太阳能板（尺寸缩小一半）
    const panelGeometry = new THREE.BoxGeometry(4.5, 0.05, 3.5); // 原来 [9, 0.1, 7]
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0000ff,
      emissive: 0x0000aa,
      emissiveIntensity: 0.3,
      metalness: 0.2,
      roughness: 0.1
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.y = 1.58; // 原来 y:3.16
    solarArray.add(panel);
    
    // 支撑结构（尺寸缩小一半）
    const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8); // 原来 [0.2, 0.2, 3]
    const supportMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x666666,
      metalness: 0.5,
      roughness: 0.5
    });
    
    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        const support = new THREE.Mesh(supportGeometry, supportMaterial);
        support.position.set(i * 2, 0.75, j * 1.5); // 原来 [i*4, 1.5, j*3]
        solarArray.add(support);
      }
    }
    
    parentModule.add(solarArray);
  }

  // 补全 addWindows 方法（所有尺寸缩小一半）
  addWindows(parentModule) {
    const windows = new THREE.Group();
    
    // 窗户几何体（尺寸缩小一半）
    const windowGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.05); // 原来 [0.8, 0.8, 0.1]
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x88ccff,
      emissive: 0x003366,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.7
    });
    
    // 在模块的四周添加窗户
    const windowRows = 3;
    const windowCols = 4;
    
    // 前面和后面（位置缩小一半）
    for (let side = -1; side <= 1; side += 2) {
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const window = new THREE.Mesh(windowGeometry, windowMaterial);
          const xPos = (col - (windowCols - 1) / 2) * 1; // 原来 *2
          const yPos = (row - (windowRows - 1) / 2) * 1.5; // 原来 *3
          window.position.set(xPos, yPos, side * 2.5); // 原来 side*5
          windows.add(window);
        }
      }
    }
    
    parentModule.add(windows);
  }

  // 补全 addStorageDoors 方法（所有尺寸缩小一半）
  addStorageDoors(parentModule) {
    const doors = new THREE.Group();
    
    // 大门几何体（尺寸缩小一半）
    const doorGeometry = new THREE.BoxGeometry(1.5, 2, 0.1); // 原来 [3, 4, 0.2]
    const doorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x444444,
      metalness: 0.7,
      roughness: 0.5
    });
    
    // 在模块两侧添加大门（位置缩小一半）
    const door1 = new THREE.Mesh(doorGeometry, doorMaterial);
    door1.position.set(0, 1, 2.5); // 原来 (0, 2, 5)
    doors.add(door1);
    
    const door2 = new THREE.Mesh(doorGeometry, doorMaterial);
    door2.position.set(0, 1, -2.5); // 原来 (0, 2, -5)
    doors.add(door2);
    
    // 门框（尺寸缩小一半）
    const frameGeometry = new THREE.BoxGeometry(1.6, 2.1, 0.15); // 原来 [3.2, 4.2, 0.3]
    const frameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      metalness: 0.5,
      roughness: 0.6
    });
    
    const frame1 = new THREE.Mesh(frameGeometry, frameMaterial);
    frame1.position.set(0, 1, 2.5); // 原来 (0, 2, 5)
    doors.add(frame1);
    
    const frame2 = new THREE.Mesh(frameGeometry, frameMaterial);
    frame2.position.set(0, 1, -2.5); // 原来 (0, 2, -5)
    doors.add(frame2);
    
    parentModule.add(doors);
  }

  // 连接两个模块
  connectModules(module1Id, module2Id, connectionType = 'TUNNEL') {
    const module1 = this.modules.get(module1Id)?.mesh;
    const module2 = this.modules.get(module2Id)?.mesh;
    
    if (!module1 || !module2) return null;
    
    const connector = this.createConnector(module1, module2, connectionType);
    this.station.add(connector);
    
    return connector;
  }

  createConnector(module1, module2, type) {
    const pos1 = module1.position.clone();
    const pos2 = module2.position.clone();
    
    // 计算连接点位置和方向
    const distance = pos1.distanceTo(pos2);
    const center = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
    
    let connector;
    
    switch(type) {
      case 'TUNNEL':
        // 隧道尺寸缩小一半
        const tunnelGeometry = new THREE.CylinderGeometry(0.5, 0.5, distance, 8); // 原来半径1
        const tunnelMaterial = new THREE.MeshStandardMaterial({
          color: 0xaaaaaa,
          transparent: true,
          opacity: 0.7
        });
        connector = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
        
        // 定位和旋转
        connector.position.copy(center);
        connector.lookAt(pos2);
        connector.rotateX(Math.PI / 2);
        break;
        
      case 'BRIDGE':
        // 桥梁尺寸缩小一半
        const bridgeGeometry = new THREE.BoxGeometry(1, 0.5, distance); // 原来 [2, 1, distance]
        const bridgeMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
        connector = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
        
        connector.position.copy(center);
        connector.lookAt(pos2);
        break;
    }
    
    return connector;
  }

  // 构建示例空间站（模块位置距离缩小一半）
  buildExampleStation() {
    // 中心节点
    const hub = this.addModule('HUB', {x: 0, y: 0, z: 0});
    
    // 其他模块（位置距离缩小一半）
    const modules = [
      { type: 'LAB', pos: {x: 7.5, y: 0, z: 0} },     // 原来 x:15
      { type: 'LIVING', pos: {x: -7.5, y: 0, z: 0} }, // 原来 x:-15
      { type: 'STORAGE', pos: {x: 0, y: 0, z: 7.5} }, // 原来 z:15
      { type: 'POWER', pos: {x: 0, y: 5, z: 0} }      // 原来 y:10
    ];
    
    const moduleInstances = modules.map(m => 
      this.addModule(m.type, m.pos)
    );
    
    // 连接所有模块到中心
    moduleInstances.forEach(module => {
      this.connectModules(hub.uuid, module.uuid, 'TUNNEL');
    });
    
    return this.station;
  }

  // 构建更紧凑的空间站（模块位置距离进一步缩小）
  buildCompactStation() {
    // 中心节点
    const hub = this.addModule('HUB', {x: 0, y: 0, z: 0});
    
    // 使用更紧凑的位置
    const modules = [
      { type: 'LAB', pos: {x: 6, y: 0, z: 0} },     // 比原来更紧凑
      { type: 'LIVING', pos: {x: -6, y: 0, z: 0} }, // 比原来更紧凑
      { type: 'STORAGE', pos: {x: 0, y: 0, z: 6} }, // 比原来更紧凑
      { type: 'POWER', pos: {x: 0, y: 4, z: 0} }    // 比原来更紧凑
    ];
    
    const moduleInstances = modules.map(m => 
      this.addModule(m.type, m.pos)
    );
    
    // 连接所有模块到中心
    moduleInstances.forEach(module => {
      this.connectModules(hub.uuid, module.uuid, 'TUNNEL');
    });
    
    return this.station;
  }

  // 添加新方法：移除模块
  removeModule(moduleId) {
    const moduleData = this.modules.get(moduleId);
    if (!moduleData) return false;
    
    this.station.remove(moduleData.mesh);
    this.modules.delete(moduleId);
    
    return true;
  }

  // 添加新方法：获取所有模块信息
  getAllModulesInfo() {
    const info = [];
    this.modules.forEach((data, id) => {
      info.push({
        id: id,
        type: data.type,
        position: data.position,
        mesh: data.mesh
      });
    });
    return info;
  }

  // 添加新方法：旋转整个空间站
  rotateStation(x, y, z) {
    this.station.rotation.x += x;
    this.station.rotation.y += y;
    this.station.rotation.z += z;
  }

  // 添加新方法：获取空间站整体尺寸
  getStationSize() {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    this.modules.forEach(data => {
      const pos = data.mesh.position;
      const size = data.mesh.geometry.parameters;
      
      minX = Math.min(minX, pos.x - size.width/2);
      maxX = Math.max(maxX, pos.x + size.width/2);
      minY = Math.min(minY, pos.y - size.height/2);
      maxY = Math.max(maxY, pos.y + size.height/2);
      minZ = Math.min(minZ, pos.z - size.depth/2);
      maxZ = Math.max(maxZ, pos.z + size.depth/2);
    });
    
    return {
      width: maxX - minX,
      height: maxY - minY,
      depth: maxZ - minZ,
      bounds: {
        min: { x: minX, y: minY, z: minZ },
        max: { x: maxX, y: maxY, z: maxZ }
      }
    };
  }
}

// 使用示例
// const station = new ModularSpaceStation();
// station.buildExampleStation(); // 构建缩小的示例空间站
// scene.add(station.station);