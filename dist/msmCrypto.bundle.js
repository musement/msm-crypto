"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decrypt = exports.encrypt = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var QS_LENGTH_LIMIT = 2083;
var ENCRYPTED_PROP_NAME = 'msmCrypt';

var ab2str = function ab2str(buf) {
  return String.fromCharCode.apply(String, _toConsumableArray(new Uint8Array(buf)));
};

var str2ab = function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
};

var obj2ab = function obj2ab(obj) {
  return str2ab(JSON.stringify(obj));
};

var ab2obj = function ab2obj(ab) {
  return JSON.parse(ab2str(ab));
};

var windowCrypto = typeof window !== 'undefined' && (window.crypto || window.msCrypto); // msCrypto is needed for IE11

/**
 *
 * @param {String|Object} key public key when encrypting (String), private key when decrypting (Object)
 * @returns {Promise<CryptoKey>}
 */

var importKey = function importKey(key) {
  var decrypt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return windowCrypto.subtle.importKey("jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
  decrypt ? key : {
    //this is an example jwk key, other key types are Uint8Array objects
    kty: "RSA",
    e: "AQAB",
    n: key,
    //n: "vGO3eU16ag9zRkJ4AK8ZUZrjbtp5xWK0LyFMNT8933evJoHeczexMUzSiXaLrEFSyQZortk81zJH3y41MBO_UFDO_X0crAquNrkjZDrf9Scc5-MdxlWU2Jl7Gc4Z18AC9aNibWVmXhgvHYkEoFdLCFG-2Sq-qIyW4KFkjan05IE",
    alg: "RSA-OAEP-256",
    ext: true
  }, {
    //these are the algorithm options
    name: "RSA-OAEP",
    hash: {
      name: "SHA-256" //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"

    }
  }, false, //whether the key is extractable (i.e. can be used in exportKey)
  decrypt ? ["decrypt"] : ["encrypt"] //"encrypt" or "wrapKey" for public key import or
  //"decrypt" or "unwrapKey" for private key imports
  );
};
/**
 *
 * @param {CryptoKey} key
 * @param {Object} data
 * @param {*} options to be defined, for future needs
 */


var encryptWithKey = function encryptWithKey(data) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (publicKey) {
    return windowCrypto.subtle.encrypt({
      name: "RSA-OAEP"
    }, publicKey, //from generateKey or importKey above
    str2ab(data) //ArrayBuffer of data you want to encrypt
    );
  };
};
/**
 *
 * @param {CryptoKey} key
 * @param {ArrayBuffer} data
 * @param {*} options to be defined, for future needs
 */


var decryptWithKey = function decryptWithKey(privateKey, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return windowCrypto.subtle.decrypt({
    name: "RSA-OAEP"
  }, privateKey, //from generateKey or importKey above
  data //ArrayBuffer of the data
  );
}; //  .then(ab2obj)

/**
 *
 * @param {Object} key
 * @param {String} data
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */


var encrypt = function encrypt(key, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return importKey(key).then(encryptWithKey(data, options)).then(ab2str);
};
/**
 *
 * @param {String} key
 * @param {String} data
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */


exports.encrypt = encrypt;

var decrypt = function decrypt(key, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return importKey(key, true).then(function (keyObj) {
    return decryptWithKey(keyObj, str2ab(data), options);
  }).then(ab2str);
};
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


exports.decrypt = decrypt;

var sendEncrypted = function sendEncrypted(url, key, data) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return encrypt(key, data).then(function (encrypted) {
    return encodeURIComponent(encrypted);
  }).then(function (encrypted) {
    return encrypted.length >= QS_LENGTH_LIMIT ? fetch(url, {
      method: 'POST',
      body: JSON.stringify(_defineProperty({}, ENCRYPTED_PROP_NAME, encrypted))
    }) : fetch("".concat(url, "?").concat(ENCRYPTED_PROP_NAME, "=").concat(encrypted));
  });
};
