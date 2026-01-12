import BaseScene from '../BaseScene.js';

export default class Level_1 extends BaseScene {
    async load() {
        await super.load();
        console.log('Level_1: Это будет первый игровой уровень');
    }
}