const QS_LENGTH_LIMIT = 2083
const ENCRYPTED_PROP_NAME = 'msmCrypt'

const ab2str = buf => String.fromCharCode.apply(null, new Uint16Array(buf))

const str2ab = str => {
    var buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
    var bufView = new Uint16Array(buf)
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i)
    }
    return buf
}

const obj2ab = obj => str2ab(JSON.stringify(obj))

const ab2obj = ab => JSON.parse(ab2str(ab))

const windowCrypto = window.crypto || window.msCrypto // msCrypto is needed for IE11

/**
 * 
 * @param {String} key 
 * @returns {Promise<CryptoKey>}
 */
const importKey = key => windowCrypto.subtle.importKey(
    "jwk", //can be "jwk" or "raw"
    {   //this is an example jwk key, "raw" would be an ArrayBuffer
        kty: "oct",
        k: key,
        alg: "A256CTR",
        ext: true,
    },
    {   //this is the algorithm options
        name: "AES-CTR",
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
)

/**
 * 
 * @param {CryptoKey} key 
 * @param {Object} data 
 * @param {*} options to be defined, for future needs
 */
const encryptWithKey = (key, data, options = {}) => windowCrypto.subtle.encrypt(
    {
        name: "AES-CTR",
        //Don't re-use counters!
        //Always use a new counter every time your encrypt!
        counter: new Uint8Array(16),
        length: 128, //can be 1-128
    },
    key, //from generateKey or importKey above
    obj2ab(data) //ArrayBuffer of data you want to encrypt
)

/**
 * 
 * @param {CryptoKey} key 
 * @param {ArrayBuffer} data 
 * @param {*} options to be defined, for future needs
 */
const decryptWithKey = (key, data, options = {}) => windowCrypto.subtle.decrypt(
    {
        name: "AES-CTR",
        counter: new ArrayBuffer(16), //The same counter you used to encrypt
        length: 128, //The same length you used to encrypt
    },
    key, //from generateKey or importKey above
    data //ArrayBuffer of the data
)

/**
 * 
 * @param {String} key 
 * @param {Object} data 
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */
const encrypt = (key, data, options = {}) => importKey(key)
    .then(keyObj => encryptWithKey(keyObj, data, options))
    .then(ab2str)

/**
 * 
 * @param {String} key 
 * @param {String} data 
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */
export const decrypt = (key, data, options = {}) => importKey(key)
    .then(keyObj => decryptWithKey(keyObj, str2ab(data), options))
    .then(ab2str)
    .then(str => JSON.parse(str))

/**
 * 
 * @param {String} url 
 * @param {String} key 
 * @param {Object} data 
 * @param {*} options  to be defined, for future needs
 * @returns {Promise}
 */
export const sendEncrypted = (url, key, data, options = {}) => encrypt(key, data)
    .then(encrypted => (encrypted.length >= QS_LENGTH_LIMIT) ?
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ [ENCRYPTED_PROP_NAME]: encrypted })
        }) : fetch(`${url}?${ENCRYPTED_PROP_NAME}=${encrypted}`))
