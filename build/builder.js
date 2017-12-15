const fs = require('fs')
const { parseString } = require('xml2js')

const srcDir = 'src'
const entry = process.argv[2] || 'src/index.html' || 'index.html'
const output = process.argv[3] || 'Core/page.html'

const write = (error, line) => {
    console.log('res: ', line)
}

function processLine(line, fileName, lineNumber, callback) {
    parseString(line, (err, res) => {
        if(err || !res) {
            callback(false, line.trim())
            return
        }
        const tagName = Object.keys(res)[0]

        let path, newTagName, contentHandler
        switch(tagName) {
            case 'link': {
                switch(res[tagName]['$']['rel']) {
                    case 'stylesheet': {
                        newTagName = 'style'
                        contentHandler = s => s
                        path = srcDir + '/' + res[tagName]['$']['href']
                        break
                    }
                    default: {
                        console.warn(`Unknown rel attribute: ${res[tagName]['$']['rel']}\n  > At ${fileName}:${lineNumber}`)
                        callback(false, line.trim())
                        return
                    }
                }
                break
            }
            case 'script': {
                newTagName = 'script'
                contentHandler = jsHandler
                path = srcDir + '/' + res[tagName]['$']['src']
                break
            }
            default: {
                callback(false, line.trim())
                return
            }
        }

        if(!fs.existsSync(path)) {
            console.error(`File not found: ${path}\n  > At ${fileName}:${lineNumber}`)
            callback(true)
            return
        }

        const content = fs.readFileSync(path, 'utf8')

        callback(false, `<${newTagName}>${contentHandler(content)}</${newTagName}>`)
    })
}

if(!fs.existsSync(srcDir + '/' + entry)) {
    console.error(`File not found: ${srcDir + '/' + entry}`)
}

const file = fs.readFileSync(srcDir + '/' + entry, 'utf8')

const lines = file.split('\n')

const newLines = lines.map((line, i) => {
    let res
    
    processLine(line, srcDir + '/' + entry, i + 1, (err, processed) => {
        if(err) {
            process.exit(1)
        }

        res = processed
    })

    return res
})

 fs.writeFileSync(output, newLines.join(''), 'utf8')

 function jsHandler(str) {
    let lines = str.split('\n')

    lines = lines.map(ln => ln.trim())
                 .filter(ln => ln.length > 0)
    
    return lines.join('\n')
 }