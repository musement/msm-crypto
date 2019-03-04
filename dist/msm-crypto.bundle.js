/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! exports provided: decrypt, sendEncrypted */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decrypt", function() { return decrypt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sendEncrypted", function() { return sendEncrypted; });
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var QS_LENGTH_LIMIT = 2083;
var ENCRYPTED_PROP_NAME = 'msmCrypt';

var ab2str = function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
};

var str2ab = function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char

  var bufView = new Uint16Array(buf);

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

console.log("window", window);
/**
 * 
 * @param {String} key 
 * @returns {Promise<CryptoKey>}
 */

var importKey = function importKey(key) {
  return window.crypto.subtle.importKey("jwk", //can be "jwk" or "raw"
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


var encryptWithKey = function encryptWithKey(key, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return window.crypto.subtle.encrypt({
    name: "AES-CTR",
    //Don't re-use counters!
    //Always use a new counter every time your encrypt!
    counter: new Uint8Array(16),
    length: 128 //can be 1-128

  }, key, //from generateKey or importKey above
  obj2ab(data) //ArrayBuffer of data you want to encrypt
  );
};
/**
 * 
 * @param {CryptoKey} key 
 * @param {ArrayBuffer} data 
 * @param {*} options to be defined, for future needs
 */


var decryptWithKey = function decryptWithKey(key, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return window.crypto.subtle.decrypt({
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
 * @param {String} key 
 * @param {Object} data 
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */


var encrypt = function encrypt(key, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return importKey(key).then(function (keyObj) {
    return encryptWithKey(keyObj, data, options);
  }).then(ab2str);
};
/**
 * 
 * @param {String} key 
 * @param {String} data 
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */


var decrypt = function decrypt(key, data) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return importKey(key).then(function (keyObj) {
    return decryptWithKey(keyObj, str2ab(data), options);
  }).then(ab2str).then(function (str) {
    return JSON.parse(str);
  });
};
/**
 * 
 * @param {String} url 
 * @param {String} key 
 * @param {Object} data 
 * @param {*} options  to be defined, for future needs
 * @returns {Promise}
 */

var sendEncrypted = function sendEncrypted(url, key, data) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return encrypt(key, data).then(function (encrypted) {
    return encrypted.length >= QS_LENGTH_LIMIT ? fetch(url, {
      method: 'POST',
      body: JSON.stringify(_defineProperty({}, ENCRYPTED_PROP_NAME, encrypted))
    }) : fetch("".concat(url, "?").concat(ENCRYPTED_PROP_NAME, "=").concat(encrypted));
  });
};

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOlsiUVNfTEVOR1RIX0xJTUlUIiwiRU5DUllQVEVEX1BST1BfTkFNRSIsImFiMnN0ciIsImJ1ZiIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImFwcGx5IiwiVWludDE2QXJyYXkiLCJzdHIyYWIiLCJzdHIiLCJBcnJheUJ1ZmZlciIsImxlbmd0aCIsImJ1ZlZpZXciLCJpIiwic3RyTGVuIiwiY2hhckNvZGVBdCIsIm9iajJhYiIsIm9iaiIsIkpTT04iLCJzdHJpbmdpZnkiLCJhYjJvYmoiLCJhYiIsInBhcnNlIiwiY29uc29sZSIsImxvZyIsIndpbmRvdyIsImltcG9ydEtleSIsImtleSIsImNyeXB0byIsInN1YnRsZSIsImt0eSIsImsiLCJhbGciLCJleHQiLCJuYW1lIiwiZW5jcnlwdFdpdGhLZXkiLCJkYXRhIiwib3B0aW9ucyIsImVuY3J5cHQiLCJjb3VudGVyIiwiVWludDhBcnJheSIsImRlY3J5cHRXaXRoS2V5IiwiZGVjcnlwdCIsInRoZW4iLCJrZXlPYmoiLCJzZW5kRW5jcnlwdGVkIiwidXJsIiwiZW5jcnlwdGVkIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFB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QUh1QyxDQUE3QjtBQUFBLENBQWhCO0FBS1A7Ozs7Ozs7OztBQVFPLElBQU1vQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUNDLEdBQUQsRUFBTW5CLEdBQU4sRUFBV1MsSUFBWDtBQUFBLE1BQWlCQyxPQUFqQix1RUFBMkIsRUFBM0I7QUFBQSxTQUFrQ0MsT0FBTyxDQUFDWCxHQUFELEVBQU1TLElBQU4sQ0FBUCxDQUMxRE8sSUFEMEQsQ0FDckQsVUFBQUksU0FBUztBQUFBLFdBQUtBLFNBQVMsQ0FBQ3BDLE1BQVYsSUFBb0JYLGVBQXJCLEdBQ2ZnRCxLQUFLLENBQUNGLEdBQUQsRUFBTTtBQUNQRyxZQUFNLEVBQUUsTUFERDtBQUVQQyxVQUFJLEVBQUVoQyxJQUFJLENBQUNDLFNBQUwscUJBQWtCbEIsbUJBQWxCLEVBQXdDOEMsU0FBeEM7QUFGQyxLQUFOLENBRFUsR0FJVkMsS0FBSyxXQUFJRixHQUFKLGNBQVc3QyxtQkFBWCxjQUFrQzhDLFNBQWxDLEVBSkM7QUFBQSxHQUQ0QyxDQUFsQztBQUFBLENBQXRCLEMiLCJmaWxlIjoibXNtLWNyeXB0by5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2luZGV4LmpzXCIpO1xuIiwiY29uc3QgUVNfTEVOR1RIX0xJTUlUID0gMjA4M1xuY29uc3QgRU5DUllQVEVEX1BST1BfTkFNRSA9ICdtc21DcnlwdCdcblxuY29uc3QgYWIyc3RyID0gYnVmID0+IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQxNkFycmF5KGJ1ZikpXG5cbmNvbnN0IHN0cjJhYiA9IHN0ciA9PiB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcihzdHIubGVuZ3RoICogMikgLy8gMiBieXRlcyBmb3IgZWFjaCBjaGFyXG4gICAgdmFyIGJ1ZlZpZXcgPSBuZXcgVWludDE2QXJyYXkoYnVmKVxuICAgIGZvciAodmFyIGkgPSAwLCBzdHJMZW4gPSBzdHIubGVuZ3RoOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICAgICAgYnVmVmlld1tpXSA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgfVxuICAgIHJldHVybiBidWZcbn1cblxuY29uc3Qgb2JqMmFiID0gb2JqID0+IHN0cjJhYihKU09OLnN0cmluZ2lmeShvYmopKVxuXG5jb25zdCBhYjJvYmogPSBhYiA9PiBKU09OLnBhcnNlKGFiMnN0cihhYikpXG5cbmNvbnNvbGUubG9nKFwid2luZG93XCIsIHdpbmRvdylcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxDcnlwdG9LZXk+fVxuICovXG5jb25zdCBpbXBvcnRLZXkgPSBrZXkgPT4gd2luZG93LmNyeXB0by5zdWJ0bGUuaW1wb3J0S2V5KFxuICAgIFwiandrXCIsIC8vY2FuIGJlIFwiandrXCIgb3IgXCJyYXdcIlxuICAgIHsgICAvL3RoaXMgaXMgYW4gZXhhbXBsZSBqd2sga2V5LCBcInJhd1wiIHdvdWxkIGJlIGFuIEFycmF5QnVmZmVyXG4gICAgICAgIGt0eTogXCJvY3RcIixcbiAgICAgICAgazoga2V5LFxuICAgICAgICBhbGc6IFwiQTI1NkNUUlwiLFxuICAgICAgICBleHQ6IHRydWUsXG4gICAgfSxcbiAgICB7ICAgLy90aGlzIGlzIHRoZSBhbGdvcml0aG0gb3B0aW9uc1xuICAgICAgICBuYW1lOiBcIkFFUy1DVFJcIixcbiAgICB9LFxuICAgIGZhbHNlLCAvL3doZXRoZXIgdGhlIGtleSBpcyBleHRyYWN0YWJsZSAoaS5lLiBjYW4gYmUgdXNlZCBpbiBleHBvcnRLZXkpXG4gICAgW1wiZW5jcnlwdFwiLCBcImRlY3J5cHRcIl0gLy9jYW4gXCJlbmNyeXB0XCIsIFwiZGVjcnlwdFwiLCBcIndyYXBLZXlcIiwgb3IgXCJ1bndyYXBLZXlcIlxuKVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtDcnlwdG9LZXl9IGtleSBcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFxuICogQHBhcmFtIHsqfSBvcHRpb25zIHRvIGJlIGRlZmluZWQsIGZvciBmdXR1cmUgbmVlZHNcbiAqL1xuY29uc3QgZW5jcnlwdFdpdGhLZXkgPSAoa2V5LCBkYXRhLCBvcHRpb25zID0ge30pID0+IHdpbmRvdy5jcnlwdG8uc3VidGxlLmVuY3J5cHQoXG4gICAge1xuICAgICAgICBuYW1lOiBcIkFFUy1DVFJcIixcbiAgICAgICAgLy9Eb24ndCByZS11c2UgY291bnRlcnMhXG4gICAgICAgIC8vQWx3YXlzIHVzZSBhIG5ldyBjb3VudGVyIGV2ZXJ5IHRpbWUgeW91ciBlbmNyeXB0IVxuICAgICAgICBjb3VudGVyOiBuZXcgVWludDhBcnJheSgxNiksXG4gICAgICAgIGxlbmd0aDogMTI4LCAvL2NhbiBiZSAxLTEyOFxuICAgIH0sXG4gICAga2V5LCAvL2Zyb20gZ2VuZXJhdGVLZXkgb3IgaW1wb3J0S2V5IGFib3ZlXG4gICAgb2JqMmFiKGRhdGEpIC8vQXJyYXlCdWZmZXIgb2YgZGF0YSB5b3Ugd2FudCB0byBlbmNyeXB0XG4pXG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge0NyeXB0b0tleX0ga2V5IFxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gZGF0YSBcbiAqIEBwYXJhbSB7Kn0gb3B0aW9ucyB0byBiZSBkZWZpbmVkLCBmb3IgZnV0dXJlIG5lZWRzXG4gKi9cbmNvbnN0IGRlY3J5cHRXaXRoS2V5ID0gKGtleSwgZGF0YSwgb3B0aW9ucyA9IHt9KSA9PiB3aW5kb3cuY3J5cHRvLnN1YnRsZS5kZWNyeXB0KFxuICAgIHtcbiAgICAgICAgbmFtZTogXCJBRVMtQ1RSXCIsXG4gICAgICAgIGNvdW50ZXI6IG5ldyBBcnJheUJ1ZmZlcigxNiksIC8vVGhlIHNhbWUgY291bnRlciB5b3UgdXNlZCB0byBlbmNyeXB0XG4gICAgICAgIGxlbmd0aDogMTI4LCAvL1RoZSBzYW1lIGxlbmd0aCB5b3UgdXNlZCB0byBlbmNyeXB0XG4gICAgfSxcbiAgICBrZXksIC8vZnJvbSBnZW5lcmF0ZUtleSBvciBpbXBvcnRLZXkgYWJvdmVcbiAgICBkYXRhIC8vQXJyYXlCdWZmZXIgb2YgdGhlIGRhdGFcbilcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBcbiAqIEBwYXJhbSB7Kn0gb3B0aW9ucyB0byBiZSBkZWZpbmVkLCBmb3IgZnV0dXJlIG5lZWRzXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxTdHJpbmc+fVxuICovXG5jb25zdCBlbmNyeXB0ID0gKGtleSwgZGF0YSwgb3B0aW9ucyA9IHt9KSA9PiBpbXBvcnRLZXkoa2V5KVxuICAgIC50aGVuKGtleU9iaiA9PiBlbmNyeXB0V2l0aEtleShrZXlPYmosIGRhdGEsIG9wdGlvbnMpKVxuICAgIC50aGVuKGFiMnN0cilcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBcbiAqIEBwYXJhbSB7Kn0gb3B0aW9ucyB0byBiZSBkZWZpbmVkLCBmb3IgZnV0dXJlIG5lZWRzXG4gKiBAcmV0dXJucyB7UHJvbWlzZTxTdHJpbmc+fVxuICovXG5leHBvcnQgY29uc3QgZGVjcnlwdCA9IChrZXksIGRhdGEsIG9wdGlvbnMgPSB7fSkgPT4gaW1wb3J0S2V5KGtleSlcbiAgICAudGhlbihrZXlPYmogPT4gZGVjcnlwdFdpdGhLZXkoa2V5T2JqLCBzdHIyYWIoZGF0YSksIG9wdGlvbnMpKVxuICAgIC50aGVuKGFiMnN0cilcbiAgICAudGhlbihzdHIgPT4gSlNPTi5wYXJzZShzdHIpKVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBcbiAqIEBwYXJhbSB7Kn0gb3B0aW9ucyAgdG8gYmUgZGVmaW5lZCwgZm9yIGZ1dHVyZSBuZWVkc1xuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cbmV4cG9ydCBjb25zdCBzZW5kRW5jcnlwdGVkID0gKHVybCwga2V5LCBkYXRhLCBvcHRpb25zID0ge30pID0+IGVuY3J5cHQoa2V5LCBkYXRhKVxuICAgIC50aGVuKGVuY3J5cHRlZCA9PiAoZW5jcnlwdGVkLmxlbmd0aCA+PSBRU19MRU5HVEhfTElNSVQpID9cbiAgICAgICAgZmV0Y2godXJsLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgW0VOQ1JZUFRFRF9QUk9QX05BTUVdOiBlbmNyeXB0ZWQgfSlcbiAgICAgICAgfSkgOiBmZXRjaChgJHt1cmx9PyR7RU5DUllQVEVEX1BST1BfTkFNRX09JHtlbmNyeXB0ZWR9YCkpXG4iXSwic291cmNlUm9vdCI6IiJ9