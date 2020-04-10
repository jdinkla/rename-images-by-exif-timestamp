var ExifImage = require('exif').ExifImage;

const filename = 'examples/shibuya.jpg'
// const filename = 'examples/buddha.jpg'

function makeName(createDate) {
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

function getName(filename) {
    try {
        new ExifImage({ image: filename }, function (error, exifData) {
            if (error) {
                console.log('Error: ' + error.message);
            } else {
                const createDate = exifData.exif.CreateDate
                if (createDate) {
                    console.log('found exif CreateDate ' + createDate)
                    const newName = makeName(createDate)
                    console.log(filename, ' -> ', newName)
                    // TODO rename file
                } else {
                    console.log("ErrorY: exif CreateDate is empty")
                }
            }
        });
    } catch (error) {
        console.log('ErrorXX: ' + error.message);
    }
}

getName(filename)
