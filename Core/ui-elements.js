class Switch {
    constructor(id) {
        this.toggle = this.toggle.bind(this)
        this.mount = this.mount.bind(this)

        this.on = false
        this.ref = null

        if(id)
            this.mount(id)
    }

    toggle() {
        this.on = !this.on
        window.navigator.vibrate(15)

        if(this.on) {
            this.ref.classList.add('on')
            this.ref.classList.remove('off')
        }
        else {
            this.ref.classList.add('off')
            this.ref.classList.remove('on')
        }

        if(typeof this.ontoggle === 'function')
            this.ontoggle(this)
    }

    mount(id) {
        this.ref = document.getElementById(id)
        if(!this.ref)
            throw new Error('Element not found')
        
        this.ref.addEventListener('click', this.toggle)
    }

    setState(state) {
        this.on = state
        
        if(this.on) {
            this.ref.classList.add('on')
            this.ref.classList.remove('off')
        }
        else {
            this.ref.classList.add('off')
            this.ref.classList.remove('on')
        }
    }
}