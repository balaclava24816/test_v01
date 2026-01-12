// src/Scenes/Levels/Level_Boss.js
import BaseScene from '../BaseScene.js'

export default class Level_Boss extends BaseScene {
    async load() {
        await super.load()
        console.log('Level_Boss: Заглушка для уровня с боссом')
        // Позже добавим босса и логику боя
    }
}