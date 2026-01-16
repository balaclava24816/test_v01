import * as THREE from 'three'
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Camera from "./Camera.js"
import Renderer from './Renderer.js'
import { SceneManager } from '../Scenes/SceneManager.js'
import Preloader from '../UI/Preloader.js'

let instance = null

export default class Game
{
    constructor(canvas)
    {
        if(instance)
        {
            return instance
        }

        instance = this

        // Global access
        window.game = this
        
        // Options
        this.canvas = canvas

        // Preloader
        this.preloader = new Preloader('default')
        this.preloader.show()
        
        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.sceneManager = new SceneManager(this.scene, this.camera, this.renderer)
        this.preloadCutscene();
        // Sizes resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })
        
        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })

        setTimeout(() => {
        this.preloader.hide()
        }, 3000)
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
        this.sceneManager.resize()
    }

    update()
    {
        this.camera.update()
        this.renderer.update()
        const deltaInSeconds = this.time.delta * 0.001;
        this.sceneManager.update(deltaInSeconds);
    }
    async preloadCutscene() {
    try {
        console.log('Game: Фоновая загрузка катсцены...');
        // Используем общий resources из SceneManager
        await this.sceneManager.resources.loadGLTF('/models/cutscene_intro_v01.glb');
        console.log('Game: Катсцена загружена в кэш');
    } catch (error) {
        console.error('Game: Ошибка фоновой загрузки катсцены:', error);
    }
}
}