import BaseScene from './BaseScene.js'
import * as THREE from 'three'

export default class MenuScene extends BaseScene {
    constructor(scene, camera, renderer, resources, params = {}) {
        super(scene, camera, renderer, resources, params);
        this.menuModel = null;
        this.startButton = null;
        this.mixer = null; // ← ДОБАВЬ ЭТО! Для анимаций
    }
    
    async load() {
        await super.load();
        console.log('MenuScene: Загружаю меню из Blender...');
        
        try {
            // Загружаем модель
            const gltf = await this.resources.loadGLTF('/models/menu_scene_v01.glb');
            this.menuModel = gltf.scene;
            this.scene.add(this.menuModel);
            
            // 1. Проверяем анимации
            console.log(`MenuScene: Найдено анимаций: ${gltf.animations?.length || 0}`);

            console.log('MenuScene: Детали модели:', {
                animations: gltf.animations.map(a => a.name),
                duration: gltf.animations[0]?.duration,
                tracks: gltf.animations[0]?.tracks?.length
            });
            
            if (gltf.animations?.length > 0) {
                // Создаём микшер для анимаций
                this.mixer = new THREE.AnimationMixer(this.menuModel);
                
                gltf.animations.forEach((clip, index) => {
                    const action = this.mixer.clipAction(clip);
                    action.play();
                    console.log(`MenuScene: Запущена анимация "${clip.name}"`);
                });
            }
            
            // 2. Ищем камеру
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
                console.warn('MenuScene: Камера не найдена. Использую стандартную.');
                this.camera.position.set(0, 2, 5);
                this.camera.lookAt(0, 0, 0);
            }
            
            // 3. Создаём кнопку
            this.createStartButton();
            
        } catch (error) {
            console.error('MenuScene: Ошибка:', error);
        }
    }
    
    update(deltaTime) {
        // ОБЯЗАТЕЛЬНО: обновляем анимации каждый кадр
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
    
    update(deltaTime) {
        // Никаких тестовых кубов - пустой метод
        // Вся логика в загруженной модели из Blender
    }
    
    dispose() {
        if (this.startButton?.parentNode) {
            this.startButton.parentNode.removeChild(this.startButton);
        }
        super.dispose();
    }
}