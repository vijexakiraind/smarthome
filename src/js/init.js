const AppState = {
    darkTheme: false, //true
    pwaNotification: false
}

// init

// theme
if(AppState.darkTheme) {
    document.body.classList.add('dark-theme')
    document.getElementById('meta-theme-color').setAttribute('content', '#2b2b2b')
}
else {
    document.body.classList.add('light-theme')
    document.getElementById('meta-theme-color').setAttribute('content', '#eaeaea')
}

function toggleDarkTheme() {
    AppState.darkTheme = !AppState.darkTheme
    
    if(AppState.darkTheme) {
        document.body.classList.add('dark-theme')
        document.body.classList.remove('light-theme')
        document.getElementById('meta-theme-color').setAttribute('content', '#2b2b2b')
    }
    else {
        document.body.classList.add('light-theme')
        document.body.classList.remove('dark-theme')
        document.getElementById('meta-theme-color').setAttribute('content', '#eaeaea')
    }
}

// pwa-notification

if( /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ) {
    AppState.pwaNotification = !window.matchMedia('(display-mode: standalone)').matches

    if(AppState.pwaNotification)
        document.body.classList.add('pwa-notification')
}

function closePwaNotification() {
    AppState.pwaNotification = false

    document.body.classList.remove('pwa-notification')
}