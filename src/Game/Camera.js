import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

export default class Camera
{
    constructor()
    {
        // 1. Берём существующий экземпляр Game из window.game
        // (НЕ создаём новый!)
        if (!window.game) {
            console.error('Camera: window.game не найден! Сначала создай Game.')
            // Можно создать временную камеру на всякий случай
            this.instance = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, .1, 100)
            return
        }
        
        this.game = window.game  // ← БЕРЁМ СУЩЕСТВУЮЩИЙ, не создаём новый
        this.sizes = this.game.sizes
        this.scene = this.game.scene
        this.canvas = this.game.canvas

        this.setInstance()
        this.setOrbitControls()  // ← Исправь опечатку: Cintrols → Controls
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, .1 ,100)
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setOrbitControls()  // ← Исправь название метода
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update()
    {
        this.controls.update()
    }
}