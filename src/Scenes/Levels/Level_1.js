import LevelBase from './LevelBase.js';

export default class Level_1 extends LevelBase {
    constructor(scene, camera, renderer, resources, params = {}) {
        // Вызываем родительский конструктор с параметрами уровня
        super(scene, camera, renderer, resources, {
            name: 'Уровень 1',
            difficulty: 'easy',
            modelPath: '/models/level_1_v01.glb', // ← твоя модель
            ...params // Дополнительные параметры если передали
        });
        
        // Специфичные для Level_1 свойства
        this.secretAreas = [];
        this.timeLimit = 300; // 5 минут
    }
    
    async load() {
        // 1. Загружаем базовый уровень (модель, камеру, свет)
        await super.load();
        
        // 2. Добавляем специфичную логику Level_1
        console.log('Level_1: Добавляю специфичную логику...');
        
        // Например: скрытые области, уникальные враги и т.д.
        // this.setupSecretAreas();
        // this.spawnSpecialEnemies();
        
        console.log('Level_1: Уровень готов!');
    }
    
    update(deltaTime) {
        // Вызываем родительский update
        super.update(deltaTime);
        
        // Специфичная логика Level_1
        // this.checkTimeLimit(deltaTime);
        // this.updateSpecialEnemies(deltaTime);
    }
}