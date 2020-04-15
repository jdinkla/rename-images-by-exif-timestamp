const log = require('loglevel')
const fs = require('fs')
const rename = require('./rename')

log.setLevel(log.levels.DEBUG)

async function renameFile (filePath) {
  try {
    const createDate = await rename.createDateFromExif(filePath)
    const newPath = rename.transformName(createDate)
    log.info(filePath, ' -> ', newPath)
    fs.renameSync(filePath, newPath)
  } catch (error) {
    log.error('ERROR:', filePath, ':', error.message)
  }
}

if (process.argv.length !== 3) {
  log.error('ERROR: Wrong number of arguments')
  process.exit(-1)
}
const filePath = process.argv[2]

renameFile(filePath)
