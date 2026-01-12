import SceneResources from './SceneResources.js';
import MenuScene from './MenuScene.js';
import IntroCutscene from './IntroCutscene.js';
import Level_1 from './Levels/Level_1.js';
import Level_Boss from './Levels/Level_Boss.js';

export class SceneManager {
    constructor(scene, camera, renderer) {
        // 1. Сохраняем основные зависимости от Game.js
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        
        // 2. Загрузчик ресурсов для сцен
        this.resources = new SceneResources();
        
        // 3. Текущая активная сцена
        this.currentScene = null;
        this.currentSceneName = null;
        
        // 4. КАРТА СЦЕН: ключ → Класс сцены
        this.sceneRegistry = new Map([
            ['menu', MenuScene],          // ключ 'menu' → класс MenuScene.js
            ['intro', IntroCutscene],     // ключ 'intro' → класс IntroCutscene.js
            ['level_1', Level_1],         // ключ 'level_1' → класс Level_1.js
            ['level_boss', Level_Boss]    // ключ 'level_boss' → класс Level_Boss.js
        ]);
        
        console.log('SceneManager создан. Доступные сцены:', [...this.sceneRegistry.keys()]);
        
        // 5. Автоматически запускаем меню при создании
        this.loadScene('menu');
    }
    
    /**
     * Основной метод для переключения сцен
     * @param {string} sceneName - Ключ из sceneRegistry ('menu', 'intro', 'level_1')
     * @param {object} params - Дополнительные параметры для сцены
     */
    async loadScene(sceneName, params = {}) {
        console.log(`SceneManager: Загружаю сцену "${sceneName}"`);
        
        // 1. Находим класс сцены по имени в карте
        const SceneClass = this.sceneRegistry.get(sceneName);
        if (!SceneClass) {
            console.error(`SceneManager: Сцена "${sceneName}" не найдена в реестре!`);
            return;
        }
        
        // 2. Останавливаем и очищаем текущую сцену (если она есть)
        if (this.currentScene) {
            console.log(`SceneManager: Очищаю предыдущую сцену "${this.currentSceneName}"`);
            if (this.currentScene.dispose) {
                this.currentScene.dispose();
            }
            // Очищаем Three.js сцену от всех объектов
            this.clearScene();
        }
        
        // 3. Создаём экземпляр новой сцены, передавая зависимости
        const newScene = new SceneClass(this.scene, this.camera, this.renderer, this.resources, params);
        
        // 4. Загружаем сцену (асинхронно)
        try {
            await newScene.load();
            this.currentScene = newScene;
            this.currentSceneName = sceneName;
            console.log(`SceneManager: Сцена "${sceneName}" успешно загружена.`);
        } catch (error) {
            console.error(`SceneManager: Ошибка загрузки сцены "${sceneName}":`, error);
        }
    }
    
    /**
     * Очистка Three.js сцены (удаляем все объекты)
     */
    clearScene() {
        while(this.scene.children.length > 0) {
            const object = this.scene.children[0];
            this.scene.remove(object);
            
            // Рекурсивно очищаем геометрию и материалы
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
    }
    
    /**
     * Обновление логики активной сцены (вызывается из Game.js каждый кадр)
     * @param {number} deltaTime - Время в секундах с предыдущего кадра
     */
    update(deltaTime) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(deltaTime);
        }
    }
    
    /**
     * Обработка изменения размера окна
     */
    onResize() {
        if (this.currentScene && this.currentScene.onResize) {
            this.currentScene.onResize();
        }
    }
    
    /**
     * Получение информации о текущей сцене
     */
    getCurrentScene() {
        return {
            name: this.currentSceneName,
            instance: this.currentScene
        };
    }
    
    /**
     * Вспомогательный метод для быстрого перехода между сценами
     */
    async transitionTo(sceneName, params = {}, delay = 0) {
        if (delay > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return this.loadScene(sceneName, params);
    }
}