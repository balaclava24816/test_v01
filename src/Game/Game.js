import * as THREE from 'three'
import Sizes from "./Utils/Sizes.js"
import Time from "./Utils/Time.js"
import Camera from "./Camera.js"
import Renderer from './Renderer.js'
import { SceneManager } from '../Scenes/SceneManager.js'
//import Resources from './Utils/Resources.js'
//import sources from './sources.js'

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
        
        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        //this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.sceneManager = new SceneManager(this.scene, this.camera, this.renderer)
        
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
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.renderer.update()
        this.sceneManager.update(this.time.delta)
    }
}