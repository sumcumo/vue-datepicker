import Language from '~/locale/Language'

describe('Language class', () => {
  const days = ['m', 't', 'w', 't', 'f', 's', 's']
  const months = ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd']
  it('throws an error when language is not a string', () => {
    expect(() => new Language(1, [], [], [])).toThrow(TypeError)
  })

  it('throws an error when there are not exactly 12 months', () => {
    expect(() => new Language('a', ['j', 'f', 'm'], months, days)).toThrow(
      RangeError,
    )
  })

  it('throws an error when there are not exactly 12 abbreviated months', () => {
    expect(() => new Language('a', months, ['j', 'f', 'm'], days)).toThrow(
      RangeError,
    )
  })

  it('throws an error when there are not exactly 7 days', () => {
    expect(() => new Language('a', months, months, ['m', 't', 'w'])).toThrow(
      RangeError,
    )
  })
})
