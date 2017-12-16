// args: 1: path to entry point, 2: path to output

const fs = require('fs')
const path = require('path')
const { parseString } = require('xml2js')

const entry = path.isAbsolute(process.argv[2]) ?
    process.argv[2]
    : path.join(process.cwd(), process.argv[2])

const srcDir = path.dirname(entry)

const output = path.isAbsolute(process.argv[3]) ?
    process.argv[3]
    : path.join(process.cwd(), process.argv[3])

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

        let srcPath, newTagName, contentHandler
        switch(tagName) {
            case 'link': {
                switch(res[tagName]['$']['rel']) {
                    case 'stylesheet': {
                        newTagName = 'style'
                        contentHandler = s => s
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

        callback(false, `<${newTagName}>${contentHandler(content)}</${newTagName}>`)
    })
}

if(!fs.existsSync(entry)) {
    console.error(`File not found: ${entry}`)
}

const file = fs.readFileSync(entry, 'utf8')

const lines = file.split('\n')

const newLines = lines.map((line, i) => {
    let res
    
    processLine(line, entry, i + 1, (err, processed) => {
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