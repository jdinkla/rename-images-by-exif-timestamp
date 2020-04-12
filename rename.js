const ExifImage = require('exif').ExifImage;
const path = require("path");
const fs = require('fs');
const log = require('loglevel');

function transformName(createDate) {
    if (createDate) {
        let [date, time] = createDate.split(' ')
        let [yyyy, mm, dd] = date.split(':')
        let [hh, min, ss] = time.split(':')
        return  yyyy + '-' + mm + '-' + dd + ' ' + hh + '.' + min + '.' + ss + '.jpg'
    }
    return null
}

function getCreateDateFromExif(filename) {
    return new Promise((resolve, reject) => {
        try {
            new ExifImage({ image: filename }, function (error, exifData) {
                if (error) {
                    reject(error)
                } else if (exifData.exif.CreateDate) {
                    resolve(exifData.exif.CreateDate)
                } else {
                    reject("Error: exif CreateDate is empty")
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}

function traverse(filePath) {
    var result = []
    if (fs.statSync(filePath).isDirectory()) {
        const files = fs.readdirSync(filePath)
        files.forEach(function(file) {
            const newPath = path.join(filePath, file)
            const filesInSubFolder = traverse(newPath)
            result = result.concat(filesInSubFolder)
        });
    } else {
        result = [filePath]
    }
    return result
}

// var directoryPath = "D:\\tmp\\2005\\200509"
var directoryPath = "D:\\tmp\\2010"

log.setLevel(log.levels.DEBUG)

traverse(directoryPath).forEach( async filePath => {
    log.debug("found " + filePath)
    try {
        var createDate = await getCreateDateFromExif(filePath)
        var newPath = transformName(createDate)
        log.info(filePath, ' -> ', newPath)
    } catch (error) {
        log.error('ERROR:', filePath, ':',  error.message)
    }
})
