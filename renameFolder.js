const path = require('path')
const fs = require('fs')
const log = require('loglevel')
const rename = require('./rename')

log.setLevel(log.levels.DEBUG)

function traverse (filePath) {
  var result = []
  if (fs.statSync(filePath).isDirectory()) {
    const files = fs.readdirSync(filePath)
    files.forEach(function (file) {
      const newPath = path.join(filePath, file)
      const filesInSubFolder = traverse(newPath)
      result = result.concat(filesInSubFolder)
    })
  } else {
    result = [filePath]
  }
  return result
}

function renameFolder (directoryPath) {
  traverse(directoryPath).forEach(async filePath => {
    log.debug('found ' + filePath)
    try {
      const createDate = await rename.createDateFromExif(filePath)
      const newFile = rename.transformName(createDate)
      const newPath = path.join(path.dirname(filePath), newFile)
      log.info(filePath, ' -> ', newPath)
      fs.renameSync(filePath, newPath)
    } catch (error) {
      log.error('ERROR:', filePath, ':', error.message)
    }
  })
}

if (process.argv.length !== 3) {
  log.error('ERROR: Wrong number of arguments')
  process.exit(-1)
}

const directoryPath = process.argv[2]
renameFolder(directoryPath)
