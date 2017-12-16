// args: 1: path to entry point, 2: path to output

const fs = require('fs')
const path = require('path')

const processFile = require('./processFile')

const entry = path.isAbsolute(process.argv[2]) ?
    process.argv[2]
    : path.join(process.cwd(), process.argv[2])

const srcDir = path.dirname(entry)

const output = path.isAbsolute(process.argv[3]) ?
    process.argv[3]
    : path.join(process.cwd(), process.argv[3])

if(!fs.existsSync(entry)) {
    console.error(`File not found: ${entry}`)
}

const file = fs.readFileSync(entry, 'utf8')

const newFile = processFile(file, {}, entry, srcDir)

fs.writeFileSync(output, newFile, 'utf8')