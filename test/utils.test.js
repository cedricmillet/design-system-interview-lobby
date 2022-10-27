/**
 * Test jest with .js files
 * @author github.com/cedricmillet
 */

const { uuid } = require('../src/views/includes/js/utils')


describe('uuid()', () => {
    it('Able to generate 2 different uuids', () => {
        expect(uuid()).not.toStrictEqual(uuid());
    })
})