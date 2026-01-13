import BaseScene from './BaseScene.js';
import * as THREE from 'three';

export default class IntroCutscene extends BaseScene {
    constructor(scene, camera, renderer, resources, params = {}) {
        super(scene, camera, renderer, resources, params);
        this.cutsceneModel = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.blenderCamera = null;
        this.duration = 10; // 10 секунд катсцена
    }
    
    async load() {
        await super.load();
        console.log('IntroCutscene: Загружаю катсцену из Blender...');
        
        if (!this.params.modelPath) {
            console.error('IntroCutscene: Не указан путь к модели');
            return;
        }
        
        try {
            // 1. Загружаем катсцену из Blender
            const gltf = await this.resources.loadGLTF(this.params.modelPath);
            this.cutsceneModel = gltf.scene;
            this.scene.add(this.cutsceneModel);
            
            // 2. Ищем и применяем камеру из Blender
            let foundCamera = false;
            gltf.scene.traverse((obj) => {
                if (obj.isCamera) {
                    console.log('IntroCutscene: Найдена камера в Blender катсцене:', obj);
                    this.blenderCamera = obj;
                    
                    // Применяем параметры камеры
                    this.camera.position.copy(obj.position);
                    this.camera.rotation.copy(obj.rotation);
                    
                    if (obj.fov) this.camera.fov = obj.fov;
                    if (obj.aspect) this.camera.aspect = obj.aspect;
                    if (obj.near) this.camera.near = obj.near;
                    if (obj.far) this.camera.far = obj.far;
                    
                    this.camera.updateProjectionMatrix();
                    foundCamera = true;
                }
            });
            
            if (!foundCamera) {
                console.warn('IntroCutscene: Камера в катсцене не найдена. Использую стандартную.');
            }
            
            // 3. Запускаем анимации если есть
            if (gltf.animations?.length > 0) {
                this.mixer = new THREE.AnimationMixer(gltf.scene);
                gltf.animations.forEach(clip => {
                    const action = this.mixer.clipAction(clip);
                    action.play();
                    console.log(`IntroCutscene: Запущена анимация: ${clip.name}`);
                });
            }
            
            console.log('IntroCutscene: Катсцена загружена. Длительность:', this.duration, 'сек');
            
            // 4. Автопереход через заданное время
            setTimeout(() => this.endCutscene(), this.duration * 1000);
            
        } catch (error) {
            console.error('IntroCutscene: Ошибка загрузки катсцены:', error);
        }
    }
    
    update(deltaTime) {
        // Обновляем анимации если есть
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        // Если нашли камеру в Blender и она анимирована,
        // Three.js автоматически обновит её позицию через анимации
    }
    
    endCutscene() {
        console.log('IntroCutscene: Катсцена завершена');
        
        if (window.game?.sceneManager) {
            window.game.sceneManager.loadScene('level_1');
        }
    }
    
    dispose() {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        super.dispose();
    }
}