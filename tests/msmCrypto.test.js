import "babel-polyfill";

const PUBLIC_KEY = `70z0-DbIJBf79RCzgYwte8BZNN4sKxeOMthsaLGKf-4vgx8KLYvopcswT8CRYM5g2wRhklpiY4ayMV6rtuvNdxsTrUMBLP4781WlE1jfdn8aSdcoN90SGG-15y69hoPqdmg5LLlYkruBMhv9USSbB23dJ-4FNssAlyVaWrjpjmv5mX4XvPEarSxzDE9SwbnUwdOa0i2UdmsB3D6R7lABiTyfCayWrgLxPDPROdwfRY5Ua3EuD5ACwC19nUzc9ItzoQ5gPFmB3Ubm-f4T6L6cE6x62VhrtqWBXPt2Bx3GOviwriSV2mtvHmRSFOXFVc5-U8Z_-zR0vfGNxCN6uX1LcQ`;
const PRIVATE_JWK = {
  alg: "RSA-OAEP-256",
  d:
    "TLzI8a_fjnOCgJvSdICXNVABS0rTrx3mo7dzTD9iwpOG-O1DPkfXWxNFcs210O1dcd59y4jgdDoFen95YTdMtB0iujT6c4szflzAiuu8_SrVK0irxP5Hhz6Lfo8mh7RVw5K4gvcMyEEItSD0osiyTjeU6_EQCvoePlnkF6Okgd7Pcu6DN1A3Jp9QstKcRtRFoOPj-R-JdIV9QCawXWv1no8CbnNMWFsE-rV98DtQ1pclnm_S4uwvrhZIRRDZ3J7wGwTKNFUvrG8IGdCTCcH3X6kdb4QuHZaCQ5TnWi7c6wT90WvIrGoOLW2rUML_Y3uBJfRqpKNMBCuJzMiGr1wi4Q",
  dp:
    "sGDNRq0Ng2sj33UZ-K2n0xVR6VM0X-__L-eHwETX__Blm567gwlp_fvwE8ZNGQvS1jdBLu24Z18uQPOkrefRmrxQpk4E2bS91EjH5F71Y5yb1nM3ucBnwZNtvXd58p57twBl-A_b14K65rMv5Xm7qlX0lHesW9ZdgDclB1lue9E",
  dq:
    "NdfpF_aoNj3mK2ST2YJYcQ-86qa18ZdYKoBiAGP6SBRfH0HlqhDCOiOtEdnkEhGt8kE-ZFzgMqrgz4zZvQoFtvQqabG3Rdk9f5KKF79VDLHjwzzTbHebHcgINlI7QaREoFBy6XgjAWf_Il1K1eSwpqQzdqc4whnygl5YqmyNI6c",
  e: "AQAB",
  ext: true,
  key_ops: ["decrypt"],
  kty: "RSA",
  n:
    "70z0-DbIJBf79RCzgYwte8BZNN4sKxeOMthsaLGKf-4vgx8KLYvopcswT8CRYM5g2wRhklpiY4ayMV6rtuvNdxsTrUMBLP4781WlE1jfdn8aSdcoN90SGG-15y69hoPqdmg5LLlYkruBMhv9USSbB23dJ-4FNssAlyVaWrjpjmv5mX4XvPEarSxzDE9SwbnUwdOa0i2UdmsB3D6R7lABiTyfCayWrgLxPDPROdwfRY5Ua3EuD5ACwC19nUzc9ItzoQ5gPFmB3Ubm-f4T6L6cE6x62VhrtqWBXPt2Bx3GOviwriSV2mtvHmRSFOXFVc5-U8Z_-zR0vfGNxCN6uX1LcQ",
  p:
    "-nYdEBOjFMVrwdX8FSo0GbjC41FTqh0xp7sVYz-L8PWDjNOIBP9RYW-ub9xTxs47kA2erOEceQI0oS5QgUol6RdFdinc_IwtquzaZgMSV1dfHOIJZAWwOXvCJWSM_cicUc5fL-m-zzlNOHqZw2_gP_92I9WU_JklWyC7yX-zFSs",
  q:
    "9JepQzrBUxl4fYmzoRICglq1o8Hnn9j-RqsZ-VPj5Mqgy0yVeqPJeCV2XX6_ZDv6CWPlMuVgHSfTwLeScYZtkmhlvpiVnSwVYPlyQxBkbzQowuqF7ElQGwcLYWhP_W-02DfYkfwj3wxpumnikK4nfMbYyDSnvps0THVhacvuC9M",
  qi:
    "XInVwaqB64RdZxn53NzB47Wfn6HQ2f3TlcF0rLg7p57_TWMRVSoOb798-5cvrelwHmGuDnP5Z0mC-2dODyP6OnJgWat7J8PNf6wv7d_BTCuTmeMBCsL-Vj_QYtAOQsjaQj_eeDsn0y2brRrcU2EZyuNR8Jbib4cniQ7rgfR81f4"
};

describe('Testing MsmCrypto', () => {

  beforeEach(async () => {
    await page.goto(`http://127.0.0.1:4400`, { waitUntil: 'load' })
  })
  
  test('Should return bar', async () => {

    /**
     * TODO: here when msmCrypto is returned, it is an object like this:
     * { encrypt: {}, decrypt: {}}
     * while I would expect an object containing 2 functions (encrypt and decrypt)
     * so the test fails
     */
    const {encrypt, decrypt} = await page.evaluate(() => {
      console.log('Loaded msmCrypto');
      return msmCrypto;
    })

    console.warn('I expect 2 functions but got 2 objects', encrypt, decrypt)

    const sensibleData = 'test roundtrip'

    await encrypt(PUBLIC_KEY, sensibleData)
      .then(encrypted => decrypt(PRIVATE_JWK, encrypted))
      .then(original => {
        expect(original).toBe(sensibleData)
      })

  })
})