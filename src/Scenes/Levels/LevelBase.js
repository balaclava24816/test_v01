import BaseScene from '../BaseScene.js';
import * as THREE from 'three';

export default class LevelBase extends BaseScene {
    constructor(scene, camera, renderer, resources, params = {}) {
        super(scene, camera, renderer, resources, params);
        
        // Общие свойства для всех уровней
        this.levelModel = null;
        this.player = null;        // будет в дочерних классах
        this.enemies = [];         // будет в дочерних классах
        this.platforms = [];       // будет в дочерних классах
        this.spawnPoint = null;    // точка появления игрока
        
        // Параметры уровня
        this.levelName = params.name || 'Unnamed Level';
        this.difficulty = params.difficulty || 'normal';
        this.modelPath = params.modelPath; // путь к GLTF
        
        console.log(`LevelBase: Создан уровень "${this.levelName}"`);
    }
    
    async load() {
        await super.load();
        console.log(`LevelBase: Загружаю уровень "${this.levelName}"...`);
        
        if (!this.modelPath) {
            console.error('LevelBase: Не указан modelPath');
            return;
        }
        
        try {
            // 1. Загружаем модель уровня из Blender
            const gltf = await this.resources.loadGLTF(this.modelPath);
            this.levelModel = gltf.scene;
            this.scene.add(this.levelModel);
            
            // 2. Ищем специальные объекты в модели
            this.parseLevelObjects(gltf.scene);
            
            // 3. Настраиваем камеру для уровня
            this.setupLevelCamera();
            
            // 4. Настраиваем освещение (базовое)
            this.setupLighting();
            
            console.log(`LevelBase: Уровень "${this.levelName}" загружен`);
            
        } catch (error) {
            console.error(`LevelBase: Ошибка загрузки уровня:`, error);
        }
    }
    
    /**
     * Парсит специальные объекты из модели Blender
     */
    parseLevelObjects(scene) {
        scene.traverse((obj) => {
            // Ищем точку спавна игрока
            if (obj.name.toLowerCase().includes('spawn') || 
                obj.name.toLowerCase().includes('playerstart')) {
                this.spawnPoint = obj;
                console.log(`LevelBase: Найдена точка спавна: ${obj.name}`);
            }
            
            // Ищем платформы
            if (obj.name.toLowerCase().includes('platform') ||
                obj.name.toLowerCase().includes('ground')) {
                this.platforms.push(obj);
            }
            
            // Ищем врагов (по тегам или именам)
            if (obj.name.toLowerCase().includes('enemy') ||
                obj.name.toLowerCase().includes('bad')) {
                // Можно создать класс Enemy позже
                this.enemies.push(obj);
            }
        });
        
        console.log(`LevelBase: Найдено: ${this.platforms.length} платформ, ${this.enemies.length} врагов`);
    }
    
    /**
     * Настраивает камеру для уровня
     */
    setupLevelCamera() {
        // Если есть точка спавна - камера смотрит на неё
        if (this.spawnPoint) {
            this.camera.position.set(
                this.spawnPoint.position.x,
                this.spawnPoint.position.y + 5,
                this.spawnPoint.position.z + 10
            );
            this.camera.lookAt(this.spawnPoint.position);
        } else {
            // Дефолтная камера для уровня
            this.camera.position.set(0, 10, 15);
            this.camera.lookAt(0, 0, 0);
        }
    }
    
    /**
     * Базовая настройка освещения
     */
    setupLighting() {
        // Направленный свет (солнце)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 5);
        this.scene.add(directionalLight);
        
        // Фоновое освещение
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
    }
    
    /**
     * Обновление уровня (вызывается каждый кадр)
     */
    update(deltaTime) {
        // Базовая логика обновления
        // Дочерние классы переопределят
    }
    
    /**
     * Очистка уровня
     */
    dispose() {
        // Очищаем массивы
        this.enemies = [];
        this.platforms = [];
        
        super.dispose();
    }
}