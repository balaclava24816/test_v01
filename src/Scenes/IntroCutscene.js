import BaseScene from './BaseScene.js';
import * as THREE from 'three';

export default class IntroCutscene extends BaseScene {
    constructor(scene, camera, renderer, resources, params = {}) {
        super(scene, camera, renderer, resources, params);
        this.cutsceneModel = null;
        this.mixer = null;
        this.blenderCamera = null;
        this.animationDuration = 0; // Будет браться из Blender
    }
    
    async load() {
    await super.load();
    
    try {
        const gltf = await this.resources.loadGLTF(this.params.modelPath);
        this.cutsceneModel = gltf.scene;
        
        // 1. ПЕРЕИМЕНОВЫВАЕМ КАМЕРУ ПЕРЕД ДОБАВЛЕНИЕМ В СЦЕНУ
        let blenderCamera = null;
        gltf.scene.traverse((obj) => {
            if (obj.isCamera) {
                console.log('IntroCutscene: Найдена камера в Blender, имя:', obj.name);
                
                // Переименовываем камеру чтобы совпадало с анимацией
                obj.name = 'Camera001'; // ← КАК В АНИМАЦИИ BLENDER!
                blenderCamera = obj;
                
                // Копируем в нашу камеру
                this.camera.position.copy(obj.position);
                this.camera.rotation.copy(obj.rotation);
            }
        });
        
        // ТОЛЬКО ПОСЛЕ переименования добавляем в сцену
        this.scene.add(this.cutsceneModel);
        
        if (blenderCamera) {
            this.blenderCamera = blenderCamera;
            console.log('IntroCutscene: Камера переименована в Camera001');
        }
        
        // 2. Настраиваем анимации
        if (gltf.animations?.length > 0) {
            console.log(`IntroCutscene: Найдено ${gltf.animations.length} анимаций`);
            
            this.mixer = new THREE.AnimationMixer(this.cutsceneModel);
            
            // Запускаем все анимации
            gltf.animations.forEach((clip, index) => {
                console.log(`  Запускаю анимацию: "${clip.name}"`);
                const action = this.mixer.clipAction(clip);
                action.clampWhenFinished = true;
                action.play();
            });
            
            // Берём длительность из ПЕРВОЙ анимации
            this.animationDuration = gltf.animations[0].duration;
            console.log(`Длительность: ${this.animationDuration.toFixed(2)} сек`);
            
            this.animationStartTime = Date.now();
            this.isAnimationPlaying = true;
            
            console.log('IntroCutscene: Анимации запущены');
            
        } else {
            console.warn('IntroCutscene: Анимаций не найдено');
            this.endCutscene();
        }
        
    } catch (error) {
        console.error('IntroCutscene: Ошибка:', error);
    }
}

update(deltaTime) {
    if (this.mixer && this.isAnimationPlaying) {
        this.mixer.update(deltaTime);
        
        // Копируем позицию камеры КАЖДЫЙ КАДР
        if (this.blenderCamera) {
            this.camera.position.copy(this.blenderCamera.position);
            this.camera.rotation.copy(this.blenderCamera.rotation);
            
            // Отладка: логируем позицию раз в секунду
            if (Math.random() < 0.02) { // ~2% шанс
                console.log('Camera position:', 
                    this.camera.position.x.toFixed(2),
                    this.camera.position.y.toFixed(2), 
                    this.camera.position.z.toFixed(2)
                );
            }
        }
        
        // Проверяем время
        const elapsed = (Date.now() - this.animationStartTime) / 1000;
        if (elapsed >= this.animationDuration) {
            this.endCutscene();
        }
    }
}

update(deltaTime) {
    if (this.mixer && this.isAnimationPlaying) {
        this.mixer.update(deltaTime);
        
        // Копируем позицию камеры
        if (this.blenderCamera) {
            this.camera.position.copy(this.blenderCamera.position);
            this.camera.rotation.copy(this.blenderCamera.rotation);
        }
        
        // Проверяем, прошло ли достаточно времени
        const elapsed = (Date.now() - this.animationStartTime) / 1000;
        if (elapsed >= this.animationDuration) {
            this.endCutscene();
        }
    }
}

// IntroCutscene.endCutscene():
endCutscene() {
    if (!this.isAnimationPlaying) return;
    this.isAnimationPlaying = false;
    
    console.log('IntroCutscene: Катсцена завершена');
    
    // НЕ показываем прелоадер здесь - он покажется в SceneManager
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