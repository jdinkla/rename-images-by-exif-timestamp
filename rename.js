const ExifImage = require('exif').ExifImage;
const path = require("path");
const fs = require('fs');

const filename = 'examples/shibuya.jpg'
// const filename = 'examples/buddha.jpg'


function transformName(createDate) {
    if (createDate) {
        let [date, time] = createDate.split(' ')
        let [yyyy, mm, dd] = date.split(':')
        let [hh, min, ss] = time.split(':')
        return  yyyy + '-' + mm + '-' + dd + ' ' + hh + '.' + min + '.' + ss + '.jpg'
    }
    return null
}

function getNameFromExif(filename) {
    return new Promise((resolve, reject) => {
        try {
            new ExifImage({ image: filename }, function (error, exifData) {
                if (error) {
                    reject(error)
                } else {
                    const createDate = exifData.exif.CreateDate
                    if (createDate) {
                        resolve(transformName(createDate))
                    } else {
                        reject("Error: exif CreateDate is empty")
                    }
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}

async function rename(origPath) {
    const origName = path.basename(origPath)
    const newName = await getNameFromExif(origPath)
    const newPath = origPath.replace(origName, newName)
    console.log(origPath, ' -> ', newPath)
    // TODO rename
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
var directoryPath = "D:\\tmp\\"

const files = traverse(directoryPath)

process.exit(0)

files.forEach( async filePath => {
    console.log("found " + filePath)
    await rename(filePath).catch(err => {
        console.log("Error for " + filePath + ': ' + err)
    })
})
