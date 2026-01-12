import BaseScene from './BaseScene.js';

export default class IntroCutscene extends BaseScene {
    async load() {
        await super.load();
        console.log('IntroCutscene: Это будет катсцена с анимацией из Blender');
        // Позже загрузим GLTF модель
    }
}