import BaseScene from './BaseScene.js';
import * as THREE from 'three';

export default class MenuScene extends BaseScene {
    constructor(scene, camera, renderer, resources, params = {}) {
        // Важно: вызываем super() с ВСЕМИ параметрами
        super(scene, camera, renderer, resources, params);
        
        // Теперь this.camera будет доступен
        this.testCube = null;
    }
    
    async load() {
        await super.load();
        
        // ТЕСТ: добавляем красный вращающийся куб
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.testCube = new THREE.Mesh(geometry, material);
        
        this.scene.add(this.testCube);
        
        // Теперь this.camera определён
        this.camera.position.z = 3; // Отодвигаем камеру
        
        console.log('MenuScene: Тестовый куб добавлен!');
    }
    
    update(deltaTime) {
        if (this.testCube) {
            this.testCube.rotation.x += deltaTime * 0.001;
            //this.testCube.rotation.y += deltaTime * 0.8;
        }
    }
}