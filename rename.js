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


function traverse(filePath, f) {
    console.log('traverse', filePath)
    if (fs.statSync(filePath).isDirectory()) {
        const files = fs.readdirSync(filePath)
        files.forEach(function(file) {
            const newPath = path.join(filePath, file)
            traverse(newPath, f)
        });
    } else {
        f(filePath)
    }
}

var directoryPath = "D:\\tmp\\2005"

traverse(directoryPath, async filePath => {
    console.log("found " + filePath)
    await rename(filePath)
})


