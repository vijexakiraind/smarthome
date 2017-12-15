const AppState = {
    darkTheme: false//true
}

// init

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