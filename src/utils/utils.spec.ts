import Utils from './utils'

const mock = {
  numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  account: {
    name: 'Wesley Prado',
    dob: '1995/07/01',
    job: 'Full-stack developer'
  }
}

describe('Utils', () => {
  it('should deep copy when an array is passed as argument in deepCopy', () => {
    const copiedArr = Utils.deepCopy(mock.numbers)
    expect(copiedArr).not.toBe(mock.numbers)
  })

  it('should deep copy when an object is passed as argument in deepCopy', () => {
    const copiedObj = Utils.deepCopy(mock.account)
    expect(copiedObj).not.toBe(mock.account)
  })

  it('should return the correct type of the variable passed as argument in whatis', () => {
    const typeArray = Utils.whatis([])
    const typeObject = Utils.whatis({})
    const typeString = Utils.whatis('')
    const typeNull = Utils.whatis(null)
    const typeUndefined = Utils.whatis(undefined)
    const typeBoolean = Utils.whatis(true)
    const typeNumber = Utils.whatis(1)
    const typeBigInt = Utils.whatis(BigInt(2))

    expect(typeArray).toBe('array')
    expect(typeObject).toBe('object')
    expect(typeString).toBe('string')
    expect(typeNull).toBe('null')
    expect(typeUndefined).toBe('undefined')
    expect(typeBoolean).toBe('boolean')
    expect(typeNumber).toBe('number')
    expect(typeBigInt).toBe('bigint')
  })
})
