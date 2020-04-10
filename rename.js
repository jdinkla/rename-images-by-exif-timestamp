var ExifImage = require('exif').ExifImage;
var path = require("path");

const filename = 'examples/shibuya.jpg'
// const filename = 'examples/buddha.jpg'


function transformName(createDate) {
    var result = null
    if (createDate) {
        let date, time
        [date, time] = createDate.split(' ')
        let yyyy, mm, dd
        [yyyy, mm, dd] = date.split(':')
        let hh, min, ss
        [hh, min, ss] = time.split(':')
        result = yyyy + '-' + mm + '-' + dd + ' ' + hh + '.' + min + '.' + ss + '.jpg'
    }
    return result
}

function getNewName(filename) {
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
    const newName = await getNewName(origPath)
    console.log(path.basename(origPath))
    const newPath = origPath.replace(path.basename(origPath), newName)
    console.log(origPath, ' -> ', newPath)
}

rename(filename)


