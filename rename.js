const ExifImage = require('exif').ExifImage

function transformName (createDate) {
  if (createDate) {
    const [date, time] = createDate.split(' ')
    const [yyyy, mm, dd] = date.split(':')
    const [hh, min, ss] = time.split(':')
    return yyyy + '-' + mm + '-' + dd + ' ' + hh + '.' + min + '.' + ss + '.jpg'
  }
  return null
}

function createDateFromExif (filename) {
  return new Promise((resolve, reject) => {
    try {
      return new ExifImage({ image: filename }, function (error, exifData) {
        if (error) {
          reject(error)
        } else if (exifData.exif.CreateDate) {
          resolve(exifData.exif.CreateDate)
        } else {
          reject(new Error('Error: exif CreateDate is empty'))
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  transformName: transformName,
  createDateFromExif: createDateFromExif
}
