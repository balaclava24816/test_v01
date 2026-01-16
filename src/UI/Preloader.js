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
        
        // Передаём только тип (текст будет по умолчанию)
        this.setContent(this.type)
        
        document.body.appendChild(this.element)
        this.hide()
    }
    
    // Добавляем второй параметр hintText со значением по умолчанию
    setContent(type, hintText = '') {
        const templates = {
            'default': `
                <div class="preloader-content">
                    <div class="spinner">
                        <div></div><div></div><div></div>
                        <div></div><div></div><div></div>
                    </div>
                    <div class="hint">${hintText || 'Загрузка меню...'}</div>
                </div>
            `,
            'level': `
                <div class="preloader-content">
                    <div class="spinner">
                        <div></div><div></div><div></div>
                        <div></div><div></div><div></div>
                    </div>
                    <div class="hint">${hintText || 'Генерируем уровень...'}</div>
                </div>
            `,
            'boss': `
                <div class="preloader-content">
                    <div class="spinner">
                        <div></div><div></div><div></div>
                        <div></div><div></div><div></div>
                    </div>
                    <div class="hint">${hintText || 'Приготовьтесь к битве с боссом!'}</div>
                </div>
            `,
            'cutscene': `
                <div class="preloader-content">
                    <div class="spinner">
                        <div></div><div></div><div></div>
                        <div></div><div></div><div></div>
                    </div>
                    <div class="hint">${hintText || 'Загрузка катсцены...'}</div>
                </div>
            `
        }
        
        this.element.innerHTML = templates[type] || templates['default']
    }
    
    // Показывает прелоадер с определённым типом и текстом
    show(type = this.type) {  // ← принимает только тип
    this.type = type;
    this.setContent(type); // hintText будет пустым → возьмётся из шаблона
    this.element.style.display = 'flex';
}
    
    // Меняет тип и текст на лету
    changeType(type, hintText = '') {
        this.type = type
        this.setContent(type, hintText)
        this.element.style.display = 'flex'
    }
    
    // Устанавливает текст подсказки (если нужно менять отдельно)
    setHint(text) {
        const hintEl = this.element.querySelector('.hint')
        if (hintEl) {
            hintEl.textContent = text
        }
    }
    
    hide() {
        this.element.style.display = 'none'
    }
}