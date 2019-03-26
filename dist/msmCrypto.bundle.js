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
var ENCRYPTED_PROP_NAME = "msmCrypt";

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

var windowCrypto = process.browser ? window.crypto || window.msCrypto : new (require('node-webcrypto-ossl'))(); // msCrypto is needed for IE11

/**
 *
 * @param {String|Object} key public key when encrypting (String), private key when decrypting (Object)
 * @returns {Promise<CryptoKey>}
 */

var importKey = function importKey(key) {
  return windowCrypto.subtle.importKey("jwk", //can be "jwk" or "raw"
  {
    //this is an example jwk key, "raw" would be an ArrayBuffer
    kty: "oct",
    k: key,
    alg: "A256CTR",
    ext: true
  }, {
    //this is the algorithm options
    name: "AES-CTR"
  }, false, //whether the key is extractable (i.e. can be used in exportKey)
  ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
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
  return function (key) {
    return windowCrypto.subtle.encrypt({
      name: "AES-CTR",
      //Don't re-use counters!
      //Always use a new counter every time your encrypt!
      counter: new Uint8Array(16),
      length: 128 //can be 1-128

    }, key, //from generateKey or importKey above
    data //ArrayBuffer of data you want to encrypt
    );
  };
};
/**
 *
 * @param {CryptoKey} key
 * @param {ArrayBuffer} data
 * @param {*} options to be defined, for future needs
 */


var decryptWithKey = function decryptWithKey(key, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return windowCrypto.subtle.decrypt({
    name: "AES-CTR",
    counter: new ArrayBuffer(16),
    //The same counter you used to encrypt
    length: 128 //The same length you used to encrypt

  }, key, //from generateKey or importKey above
  data //ArrayBuffer of the data
  );
};
/**
 *
 * @param {Object} key
 * @param {String} data
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */


var encrypt = function encrypt(key, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return importKey(key).then(encryptWithKey(str2ab(data), options)).then(ab2str);
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
  return importKey(key).then(function (keyObj) {
    return decryptWithKey(keyObj, str2ab(data), options);
  }).then(ab2str);
};
/**
 * @description this feature is still not released and must be
 * well tested
 *
 * @param {String} url
 * @param {String} key
 * @param {String} data
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
      method: "POST",
      body: JSON.stringify(_defineProperty({}, ENCRYPTED_PROP_NAME, encrypted))
    }) : fetch("".concat(url, "?").concat(ENCRYPTED_PROP_NAME, "=").concat(encrypted));
  });
};
