export default class Preloader {
    constructor(type = 'default') {
        this.type = type
        this.element = null
        this.init()
    }
    
    init() {
        this.element = document.createElement('div')
        this.element.id = 'preloader'
        this.element.className = 'preloader'
        
        // Разный HTML в зависимости от типа
        this.setContent(this.type)
        
        document.body.appendChild(this.element)
        this.hide()
    }
    
    setContent(type) {
        const templates = {
            'default': `
                <div class="preloader-content">
                <div class="spinner">
                    <div></div><div></div><div></div>
                    <div></div><div></div><div></div>
                </div>
                <div class="hint">Загрузка меню...</div>
            </div>
            `,
            'level': `
                <div class="preloader-content">
                <div class="spinner">
                    <div></div><div></div><div></div>
                    <div></div><div></div><div></div>
                </div>
                <div class="hint">Генерируем уровень...</div>
            </div>
            `,
            'boss': `
                <div class="hint">Приготовьтесь к битве с боссом!</div>
                <div class="boss-hint">Совет: уворачивайтесь от красных атак</div>
            `
        }
        
        this.element.innerHTML = templates[type] || templates['default']
    }
    
    // Меняем контент на лету
    changeType(type, hintText = '') {
        this.type = type
        this.setContent(type)
        if (hintText) {
            this.setHint(hintText)
        }
        this.show() // Показываем с новым контентом
    }
    
    setHint(text) {
        const hintEl = this.element.querySelector('.hint')
        if (hintEl) hintEl.textContent = text
    }
    
    show() { this.element.style.display = 'flex' }
    hide() { this.element.style.display = 'none' }
}