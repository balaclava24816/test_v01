export default class BaseScene {
    constructor(scene, camera, renderer, resources, params = {}) {
        this.scene = scene;
        this.camera = camera.instance || camera;
        this.renderer = renderer;
        this.resources = resources;
        this.params = params;
        this.isLoaded = false;
    }
    
    async load() {
        this.isLoaded = true;
        console.log(`BaseScene: Базовая сцена загружена (${this.constructor.name})`);
    }
    
    update(deltaTime) {
        // Переопредели в дочерних классах
    }
    
    dispose() {
        console.log(`BaseScene: Очистка сцены (${this.constructor.name})`);
    }
}