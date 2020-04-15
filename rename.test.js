const rename = require('./rename')

describe('transformName', () => {

    it('should handle null', () => {
        expect(rename.transformName()).toBeNull()
    })

    it('should handle correct timestamp', () => {
        expect(rename.transformName('1234:45:67 12:34:56')).toEqual('1234-45-67 12.34.56.jpg')
    })
})