const fs = require('fs')

const files = process.argv.slice(2)

files.forEach(file => {
    const original = fs.readFileSync(file, 'utf8')
    
    const replaced = original.replace(/\.lua/g, '.lc')

    fs.writeFileSync(file, replaced, 'utf8')
})