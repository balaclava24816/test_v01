import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from '../Game/Utils/EventEmitter.js'

export default class SceneResources extends EventEmitter {
    constructor() {
        super()
        
        // 1. Кэш вместо items
        this.cache = new Map() // Ключ: "тип:путь", Значение: ресурс
        
        // 2. Лоадеры (создаём при первом обращении)
        this.loaders = null
        
        // 3. Для отслеживания прогресса множественной загрузки
        this.toLoad = 0
        this.loaded = 0
    }
    
    /**
     * Создаёт лоадеры при первом вызове (ленивая инициализация)
     */
    initLoaders() {
        if (!this.loaders) {
            this.loaders = {
                gltfLoader: new GLTFLoader(),
                textureLoader: new THREE.TextureLoader(),
                cubeTextureLoader: new THREE.CubeTextureLoader()
            }
        }
    }
    
    /**
     * Основной метод загрузки любого ресурса
     * @param {Object} source - {type: 'gltfModel'|'texture'|'cubeTexture', path: string, name?: string}
     * @returns {Promise} - Promise с загруженным ресурсом
     */
    load(source) {
        this.initLoaders()
        
        // Создаём ключ для кэша
        const cacheKey = `${source.type}:${source.path}`
        
        // 1. Проверяем кэш
        if (this.cache.has(cacheKey)) {
            console.log(`[SceneResources] Из кэша: ${cacheKey}`)
            return Promise.resolve(this.cache.get(cacheKey))
        }
        
        console.log(`[SceneResources] Загружаю: ${cacheKey}`)
        
        // 2. Загружаем новый ресурс
        return new Promise((resolve, reject) => {
            const onLoad = (resource) => {
                this.cache.set(cacheKey, resource)
                resolve(resource)
            }
            
            const onError = (error) => {
                console.error(`[SceneResources] Ошибка загрузки ${cacheKey}:`, error)
                reject(error)
            }
            
            switch (source.type) {
                case 'gltfModel':
                    this.loaders.gltfLoader.load(source.path, onLoad, undefined, onError)
                    break
                    
                case 'texture':
                    this.loaders.textureLoader.load(source.path, onLoad, undefined, onError)
                    break
                    
                case 'cubeTexture':
                    this.loaders.cubeTextureLoader.load(source.path, onLoad, undefined, onError)
                    break
                    
                default:
                    reject(new Error(`Неизвестный тип ресурса: ${source.type}`))
            }
        })
    }
    
    /**
     * Удобный метод для загрузки GLTF/GLB моделей
     * @param {string} path - Путь к файлу
     * @returns {Promise<GLTF>}
     */
    loadGLTF(path) {
        return this.load({ type: 'gltfModel', path })
    }
    
    /**
     * Удобный метод для загрузки текстур
     * @param {string} path - Путь к файлу
     * @returns {Promise<THREE.Texture>}
     */
    loadTexture(path) {
        return this.load({ type: 'texture', path })
    }
    
    /**
     * Удобный метод для загрузки кубических текстур
     * @param {Array<string>} paths - Массив из 6 путей
     * @returns {Promise<THREE.CubeTexture>}
     */
    loadCubeTexture(paths) {
        return this.load({ type: 'cubeTexture', path: paths })
    }
    
    /**
     * Загрузка нескольких ресурсов с отслеживанием прогресса
     * @param {Array} sources - Массив объектов {type, path, name}
     * @returns {Promise<Object>} - Объект с ресурсами {[name]: resource}
     */
    loadMultiple(sources) {
        this.toLoad = sources.length
        this.loaded = 0
        
        const promises = sources.map(source => {
            return this.load(source).then(resource => {
                this.loaded++
                // Отправляем событие о прогрессе (для прогресс-бара)
                this.trigger('progress', [this.loaded / this.toLoad])
                return {
                    name: source.name || source.path,
                    resource: resource
                }
            })
        })
        
        return Promise.all(promises).then(results => {
            // Преобразуем массив в удобный объект
            const resources = {}
            results.forEach(result => {
                resources[result.name] = result.resource
            })
            return resources
        })
    }
    
    /**
     * Очистка кэша (например, при переходе на новый уровень)
     */
    clearCache() {
        console.log('[SceneResources] Очищаю кэш')
        this.cache.clear()
    }
    
    /**
     * Удаление конкретного ресурса из кэша
     * @param {string} type - Тип ресурса
     * @param {string} path - Путь к файлу
     */
    removeFromCache(type, path) {
        const key = `${type}:${path}`
        this.cache.delete(key)
    }
}