import "babel-polyfill";

describe('Testing MsmCrypto', () => {

  beforeEach(async () => {
    await page.goto(`http://127.0.0.1:4400`, { waitUntil: 'load' })
  })
  
  test('Should return bar', async () => {

    const msmCrypto = await page.evaluate(() => {
      console.log('Loaded msmCrypto');
      return msmCrypto;
    })
    
    /**
     * Here you can use msmCrypto as a normal ES/CJS import.
     * At the moment I'm just making a test mock:
     */

    expect('bar').toBe('bar')

  })
})