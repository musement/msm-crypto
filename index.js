const QS_LENGTH_LIMIT = 2083
const ENCRYPTED_PROP_NAME = 'msmCrypt'

const ab2str = buf => String.fromCharCode(...new Uint8Array(buf))

const str2ab = str => {
    var buf = new ArrayBuffer(str.length)
    var bufView = new Uint8Array(buf)
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
 * @param {String|Object} key public key when encrypting (String), private key when decrypting (Object)
 * @returns {Promise<CryptoKey>}
 */
const importKey = (key, decrypt = false) =>
    windowCrypto.subtle
        .importKey(
            "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
            decrypt
                ? key
                : {
                    //this is an example jwk key, other key types are Uint8Array objects
                    kty: "RSA",
                    e: "AQAB",
                    n: key,
                    //n: "vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE",
                    alg: "RSA-OAEP-256",
                    ext: true
                },
            {
                //these are the algorithm options
                name: "RSA-OAEP",
                hash: { name: "SHA-256" } //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            decrypt ? ["decrypt"] : ["encrypt"] //"encrypt" or "wrapKey" for public key import or
            //"decrypt" or "unwrapKey" for private key imports
        )

/**
 *
 * @param {CryptoKey} key
 * @param {Object} data
 * @param {*} options to be defined, for future needs
 */
const encryptWithKey = (data, options = {}) => publicKey =>
    windowCrypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey, //from generateKey or importKey above
        str2ab(data) //ArrayBuffer of data you want to encrypt
    )

/**
 *
 * @param {CryptoKey} key
 * @param {ArrayBuffer} data
 * @param {*} options to be defined, for future needs
 */
const decryptWithKey = (privateKey, data, options = {}) =>
    windowCrypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey, //from generateKey or importKey above
        data //ArrayBuffer of the data
    )
//  .then(ab2obj)

/**
 *
 * @param {Object} key
 * @param {String} data
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */
export const encrypt = (key, data, options = {}) =>
    importKey(key)
        .then(encryptWithKey(data, options))
        .then(ab2str)

/**
 *
 * @param {String} key
 * @param {String} data
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */
export const decrypt = (key, data, options = {}) =>
    importKey(key, true)
        .then(keyObj => decryptWithKey(keyObj, str2ab(data), options))
        .then(ab2str)

/**
 * @description this feature is still not released and must be 
 * well tested
 * 
 * @param {String} url 
 * @param {String} key 
 * @param {Object} data 
 * @param {*} options  to be defined, for future needs
 * @returns {Promise}
 */
const sendEncrypted = (url, key, data, options = {}) => encrypt(key, data)
    .then(encrypted => encodeURIComponent(encrypted))
    .then(encrypted => (encrypted.length >= QS_LENGTH_LIMIT) ?
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ [ENCRYPTED_PROP_NAME]: encrypted })
        }) : fetch(`${url}?${ENCRYPTED_PROP_NAME}=${encrypted}`))
