const { parseString } = require('xml2js')
const path = require('path')
const fs = require('fs')

function processFile(file, props, fileName, srcDir) {
    const lines = file.split('\n')

    const newLines = lines.map((line, i) => {
        let res
        
        processLine(line, fileName, srcDir, i + 1, props, (err, processed) => {
            if(err) {
                process.exit(1)
            }
    
            res = processed
        })
    
        return res
    })

    return newLines.join('')
}

function processLine(line, fileName, srcDir, lineNumber, props, callback) {
    const insertionStart = line.indexOf('<?')
    const insertionEnd = line.indexOf('?>')

    if(insertionStart >= 0) {
        const prop = line.substr(insertionStart + 2, insertionEnd - insertionStart - 2).trim()
        if(props[prop] === undefined) {
            console.error('prop not found "' + prop + '"')
        }
        else {
            line = line.substr(0, insertionStart) + props[prop] + line.substr(insertionEnd + 2)
        }
    }

    parseString(line, (err, res) => {
        if(err || !res) {
            callback(false, line.trim())
            return
        }
        const tagName = Object.keys(res)[0]

        let srcPath, newTagName, contentHandler
        switch(tagName) {
            case 'link': {
                switch(res[tagName]['$']['rel']) {
                    case 'stylesheet': {
                        newTagName = 'style'
                        contentHandler = cssHandler
                        srcPath = path.join(srcDir, res[tagName]['$']['href'])
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
                srcPath = path.join(srcDir, res[tagName]['$']['src'])
                break
            }
            case 'component': {
                newTagName = ''
                srcPath = path.join(srcDir, res[tagName]['$']['src'])
                contentHandler = s => processFile(s, JSON.parse(res[tagName]['$']['props']), srcPath, srcDir)
                break
            }
            default: {
                callback(false, line.trim())
                return
            }
        }

        if(!fs.existsSync(srcPath)) {
            console.error(`File not found: ${srcPath}\n  > At ${fileName}:${lineNumber}`)
            callback(true)
            return
        }

        const content = fs.readFileSync(srcPath, 'utf8')

        if (newTagName)
            callback(false, `<${newTagName}>${contentHandler(content)}</${newTagName}>`)
        else
            callback(false, contentHandler(content))
    })
}

function jsHandler(str) {
    let lines = str.split('\n')

    lines = lines.map(ln => ln.trim())
                    .filter(ln => ln.length > 0)

    return lines.join('\n')
}

function cssHandler(str) {
    let lines = str.split('\n')

    lines = lines.map(ln => ln.trim())
                    .filter(ln => ln.length > 0)

    return lines.join('')
}

module.exports = processFile