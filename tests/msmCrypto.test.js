describe('Testing MsmCrypto', () => {

  beforeEach(() => {
    page.goto(PATH, { waitUntil: 'load' })
        .catch((err) => console.log(err))
  })
  
  test('Should return bar', () => {
    const msmCrypto = page.evaluate(() => {
      console.log('Loaded msmCrypto');
      return msmCrypto();
    })
    .then(() => expect(() => 'bar').toBe('bar'))
    .catch((err) => console.log(err))
  })
})