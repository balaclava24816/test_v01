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
    
    // 1. ПРЕЛОАДЕР перед Level_1 и Level_Boss
    if ((sceneName === 'level_1' || sceneName === 'level_boss') && window.game?.preloader) {
        const type = sceneName === 'level_boss' ? 'boss' : 'level';
        window.game.preloader.show(type); // ← ТОЛЬКО ТИП!
    }
    
    // 2. Загрузка сцены (существующий код)
    const SceneClass = this.sceneRegistry.get(sceneName);
    if (!SceneClass) {
        console.error(`SceneManager: Сцена "${sceneName}" не найдена!`);
        if (window.game?.preloader) window.game.preloader.hide();
        return;
    }
    
    if (this.currentScene) {
        console.log(`SceneManager: Очищаю предыдущую сцену "${this.currentSceneName}"`);
        if (this.currentScene.dispose) this.currentScene.dispose();
        this.clearScene();
    }
    
    const newScene = new SceneClass(this.scene, this.camera, this.renderer, this.resources, params);
    
    try {
        await newScene.load();
        this.currentScene = newScene;
        this.currentSceneName = sceneName;
        console.log(`SceneManager: Сцена "${sceneName}" успешно загружена.`);
    } catch (error) {
        console.error(`SceneManager: Ошибка загрузки сцены "${sceneName}":`, error);
    }
    
    // 3. СКРЫВАЕМ прелоадер после загрузки Level_1 или Level_Boss
    if ((sceneName === 'level_1' || sceneName === 'level_boss') && window.game?.preloader) {
        // Маленькая задержка чтобы показать прелоадер
        setTimeout(() => {
            window.game.preloader.hide();
        }, 2000);
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
    resize() { 
        if (this.currentScene && this.currentScene.resize) {
            this.currentScene.resize();
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