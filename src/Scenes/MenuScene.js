import BaseScene from './BaseScene.js';
import * as THREE from 'three';

export default class MenuScene extends BaseScene {
    constructor(scene, camera, renderer, resources, params = {}) {
        super(scene, camera, renderer, resources, params);
        this.menuModel = null;
        this.startButton = null;
        this.mixer = null; // ← Только микшер, не нужен сложный объект animation
    }
    
    async load() {
        await super.load();
        console.log('MenuScene: Загружаю меню из Blender...');
        
        try {
            const gltf = await this.resources.loadGLTF('/models/menu_scene_v01.glb');
            this.menuModel = gltf.scene;
            this.scene.add(this.menuModel);
            
            // Камера (оставляем как было)
            let foundCamera = false;
            gltf.scene.traverse((obj) => {
                if (obj.isCamera) {
                    console.log('MenuScene: Найдена камера в Blender');
                    this.camera.position.copy(obj.position);
                    this.camera.rotation.copy(obj.rotation);
                    foundCamera = true;
                }
            });
            
            if (!foundCamera) {
                console.warn('MenuScene: Камера не найдена');
                this.camera.position.set(0, 2, 5);
                this.camera.lookAt(0, 0, 0);
            }
            
            // ПРОСТАЯ НАСТРОЙКА АНИМАЦИИ (одна анимация)
            if (gltf.animations && gltf.animations.length > 0) {
                console.log(`MenuScene: Найдена анимация "${gltf.animations[0].name}"`);
                
                // 1. Создаём микшер
                this.mixer = new THREE.AnimationMixer(this.menuModel);
                
                // 2. Берём ПЕРВУЮ анимацию
                const clip = gltf.animations[0];
                const action = this.mixer.clipAction(clip);
                
                // 3. Настраиваем
                action.setLoop(THREE.LoopRepeat); // Бесконечное повторение
                action.clampWhenFinished = false;
                action.play();
                
                console.log('MenuScene: Анимация запущена');
            } else {
                console.warn('MenuScene: Анимаций не найдено');
            }
            
            // Кнопка
            this.createStartButton();
            
        } catch (error) {
            console.error('MenuScene: Ошибка:', error);
        }
    }
    
    update(deltaTime) {
        // ПРОСТОЕ ОБНОВЛЕНИЕ
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
    
    createStartButton() {
        this.startButton = document.createElement('button');
        this.startButton.id = 'start-button';
        this.startButton.className = 'menu-button';
        this.startButton.textContent = 'СТАРТ';
        
        document.body.appendChild(this.startButton);
        
        this.startButton.addEventListener('click', () => {
            console.log('Нажата кнопка СТАРТ');
            this.onStartButtonClick();
        });
        
        console.log('MenuScene: Кнопка "Старт" создана');
    }
    
    onStartButtonClick() {
        if (this.startButton) {
            this.startButton.style.display = 'none';
        }
        
        if (window.game?.sceneManager) {
            window.game.sceneManager.loadScene('intro', {
                modelPath: '/models/cutscene_intro_v01.glb'
            });
        }
    }
    
    dispose() {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        
        if (this.startButton?.parentNode) {
            this.startButton.parentNode.removeChild(this.startButton);
        }
        
        super.dispose();
    }
}