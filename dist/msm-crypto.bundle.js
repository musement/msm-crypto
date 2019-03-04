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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiXSwibmFtZXMiOlsiUVNfTEVOR1RIX0xJTUlUIiwiRU5DUllQVEVEX1BST1BfTkFNRSIsImFiMnN0ciIsImJ1ZiIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImFwcGx5IiwiVWludDE2QXJyYXkiLCJzdHIyYWIiLCJzdHIiLCJBcnJheUJ1ZmZlciIsImxlbmd0aCIsImJ1ZlZpZXciLCJpIiwic3RyTGVuIiwiY2hhckNvZGVBdCIsIm9iajJhYiIsIm9iaiIsIkpTT04iLCJzdHJpbmdpZnkiLCJhYjJvYmoiLCJhYiIsInBhcnNlIiwiaW1wb3J0S2V5Iiwia2V5Iiwid2luZG93IiwiY3J5cHRvIiwic3VidGxlIiwia3R5IiwiayIsImFsZyIsImV4dCIsIm5hbWUiLCJlbmNyeXB0V2l0aEtleSIsImRhdGEiLCJvcHRpb25zIiwiZW5jcnlwdCIsImNvdW50ZXIiLCJVaW50OEFycmF5IiwiZGVjcnlwdFdpdGhLZXkiLCJkZWNyeXB0IiwidGhlbiIsImtleU9iaiIsInNlbmRFbmNyeXB0ZWQiLCJ1cmwiLCJlbmNyeXB0ZWQiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSxJQUFNQSxlQUFlLEdBQUcsSUFBeEI7QUFDQSxJQUFNQyxtQkFBbUIsR0FBRyxVQUE1Qjs7QUFFQSxJQUFNQyxNQUFNLEdBQUcsU0FBVEEsTUFBUyxDQUFBQyxHQUFHO0FBQUEsU0FBSUMsTUFBTSxDQUFDQyxZQUFQLENBQW9CQyxLQUFwQixDQUEwQixJQUExQixFQUFnQyxJQUFJQyxXQUFKLENBQWdCSixHQUFoQixDQUFoQyxDQUFKO0FBQUEsQ0FBbEI7O0FBRUEsSUFBTUssTUFBTSxHQUFHLFNBQVRBLE1BQVMsQ0FBQUMsR0FBRyxFQUFJO0FBQ2xCLE1BQUlOLEdBQUcsR0FBRyxJQUFJTyxXQUFKLENBQWdCRCxHQUFHLENBQUNFLE1BQUosR0FBYSxDQUE3QixDQUFWLENBRGtCLENBQ3dCOztBQUMxQyxNQUFJQyxPQUFPLEdBQUcsSUFBSUwsV0FBSixDQUFnQkosR0FBaEIsQ0FBZDs7QUFDQSxPQUFLLElBQUlVLENBQUMsR0FBRyxDQUFSLEVBQVdDLE1BQU0sR0FBR0wsR0FBRyxDQUFDRSxNQUE3QixFQUFxQ0UsQ0FBQyxHQUFHQyxNQUF6QyxFQUFpREQsQ0FBQyxFQUFsRCxFQUFzRDtBQUNsREQsV0FBTyxDQUFDQyxDQUFELENBQVAsR0FBYUosR0FBRyxDQUFDTSxVQUFKLENBQWVGLENBQWYsQ0FBYjtBQUNIOztBQUNELFNBQU9WLEdBQVA7QUFDSCxDQVBEOztBQVNBLElBQU1hLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUFDLEdBQUc7QUFBQSxTQUFJVCxNQUFNLENBQUNVLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixHQUFmLENBQUQsQ0FBVjtBQUFBLENBQWxCOztBQUVBLElBQU1HLE1BQU0sR0FBRyxTQUFUQSxNQUFTLENBQUFDLEVBQUU7QUFBQSxTQUFJSCxJQUFJLENBQUNJLEtBQUwsQ0FBV3BCLE1BQU0sQ0FBQ21CLEVBQUQsQ0FBakIsQ0FBSjtBQUFBLENBQWpCO0FBRUE7Ozs7Ozs7QUFLQSxJQUFNRSxTQUFTLEdBQUcsU0FBWkEsU0FBWSxDQUFBQyxHQUFHO0FBQUEsU0FBSUMsTUFBTSxDQUFDQyxNQUFQLENBQWNDLE1BQWQsQ0FBcUJKLFNBQXJCLENBQ3JCLEtBRHFCLEVBQ2Q7QUFDUDtBQUFJO0FBQ0FLLE9BQUcsRUFBRSxLQURUO0FBRUlDLEtBQUMsRUFBRUwsR0FGUDtBQUdJTSxPQUFHLEVBQUUsU0FIVDtBQUlJQyxPQUFHLEVBQUU7QUFKVCxHQUZxQixFQVFyQjtBQUFJO0FBQ0FDLFFBQUksRUFBRTtBQURWLEdBUnFCLEVBV3JCLEtBWHFCLEVBV2Q7QUFDUCxHQUFDLFNBQUQsRUFBWSxTQUFaLENBWnFCLENBWUU7QUFaRixHQUFKO0FBQUEsQ0FBckI7QUFlQTs7Ozs7Ozs7QUFNQSxJQUFNQyxjQUFjLEdBQUcsU0FBakJBLGNBQWlCLENBQUNULEdBQUQsRUFBTVUsSUFBTjtBQUFBLE1BQVlDLE9BQVosdUVBQXNCLEVBQXRCO0FBQUEsU0FBNkJWLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjQyxNQUFkLENBQXFCUyxPQUFyQixDQUNoRDtBQUNJSixRQUFJLEVBQUUsU0FEVjtBQUVJO0FBQ0E7QUFDQUssV0FBTyxFQUFFLElBQUlDLFVBQUosQ0FBZSxFQUFmLENBSmI7QUFLSTNCLFVBQU0sRUFBRSxHQUxaLENBS2lCOztBQUxqQixHQURnRCxFQVFoRGEsR0FSZ0QsRUFRM0M7QUFDTFIsUUFBTSxDQUFDa0IsSUFBRCxDQVQwQyxDQVNuQztBQVRtQyxHQUE3QjtBQUFBLENBQXZCO0FBWUE7Ozs7Ozs7O0FBTUEsSUFBTUssY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixDQUFDZixHQUFELEVBQU1VLElBQU47QUFBQSxNQUFZQyxPQUFaLHVFQUFzQixFQUF0QjtBQUFBLFNBQTZCVixNQUFNLENBQUNDLE1BQVAsQ0FBY0MsTUFBZCxDQUFxQmEsT0FBckIsQ0FDaEQ7QUFDSVIsUUFBSSxFQUFFLFNBRFY7QUFFSUssV0FBTyxFQUFFLElBQUkzQixXQUFKLENBQWdCLEVBQWhCLENBRmI7QUFFa0M7QUFDOUJDLFVBQU0sRUFBRSxHQUhaLENBR2lCOztBQUhqQixHQURnRCxFQU1oRGEsR0FOZ0QsRUFNM0M7QUFDTFUsTUFQZ0QsQ0FPM0M7QUFQMkMsR0FBN0I7QUFBQSxDQUF2QjtBQVVBOzs7Ozs7Ozs7QUFPQSxJQUFNRSxPQUFPLEdBQUcsU0FBVkEsT0FBVSxDQUFDWixHQUFELEVBQU1VLElBQU47QUFBQSxNQUFZQyxPQUFaLHVFQUFzQixFQUF0QjtBQUFBLFNBQTZCWixTQUFTLENBQUNDLEdBQUQsQ0FBVCxDQUN4Q2lCLElBRHdDLENBQ25DLFVBQUFDLE1BQU07QUFBQSxXQUFJVCxjQUFjLENBQUNTLE1BQUQsRUFBU1IsSUFBVCxFQUFlQyxPQUFmLENBQWxCO0FBQUEsR0FENkIsRUFFeENNLElBRndDLENBRW5DdkMsTUFGbUMsQ0FBN0I7QUFBQSxDQUFoQjtBQUlBOzs7Ozs7Ozs7QUFPTyxJQUFNc0MsT0FBTyxHQUFHLFNBQVZBLE9BQVUsQ0FBQ2hCLEdBQUQsRUFBTVUsSUFBTjtBQUFBLE1BQVlDLE9BQVosdUVBQXNCLEVBQXRCO0FBQUEsU0FBNkJaLFNBQVMsQ0FBQ0MsR0FBRCxDQUFULENBQy9DaUIsSUFEK0MsQ0FDMUMsVUFBQUMsTUFBTTtBQUFBLFdBQUlILGNBQWMsQ0FBQ0csTUFBRCxFQUFTbEMsTUFBTSxDQUFDMEIsSUFBRCxDQUFmLEVBQXVCQyxPQUF2QixDQUFsQjtBQUFBLEdBRG9DLEVBRS9DTSxJQUYrQyxDQUUxQ3ZDLE1BRjBDLEVBRy9DdUMsSUFIK0MsQ0FHMUMsVUFBQWhDLEdBQUc7QUFBQSxXQUFJUyxJQUFJLENBQUNJLEtBQUwsQ0FBV2IsR0FBWCxDQUFKO0FBQUEsR0FIdUMsQ0FBN0I7QUFBQSxDQUFoQjtBQUtQOzs7Ozs7Ozs7QUFRTyxJQUFNa0MsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDQyxHQUFELEVBQU1wQixHQUFOLEVBQVdVLElBQVg7QUFBQSxNQUFpQkMsT0FBakIsdUVBQTJCLEVBQTNCO0FBQUEsU0FBa0NDLE9BQU8sQ0FBQ1osR0FBRCxFQUFNVSxJQUFOLENBQVAsQ0FDMURPLElBRDBELENBQ3JELFVBQUFJLFNBQVM7QUFBQSxXQUFLQSxTQUFTLENBQUNsQyxNQUFWLElBQW9CWCxlQUFyQixHQUNmOEMsS0FBSyxDQUFDRixHQUFELEVBQU07QUFDUEcsWUFBTSxFQUFFLE1BREQ7QUFFUEMsVUFBSSxFQUFFOUIsSUFBSSxDQUFDQyxTQUFMLHFCQUFrQmxCLG1CQUFsQixFQUF3QzRDLFNBQXhDO0FBRkMsS0FBTixDQURVLEdBSVZDLEtBQUssV0FBSUYsR0FBSixjQUFXM0MsbUJBQVgsY0FBa0M0QyxTQUFsQyxFQUpDO0FBQUEsR0FENEMsQ0FBbEM7QUFBQSxDQUF0QixDIiwiZmlsZSI6Im1zbS1jcnlwdG8uYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9pbmRleC5qc1wiKTtcbiIsImNvbnN0IFFTX0xFTkdUSF9MSU1JVCA9IDIwODNcbmNvbnN0IEVOQ1JZUFRFRF9QUk9QX05BTUUgPSAnbXNtQ3J5cHQnXG5cbmNvbnN0IGFiMnN0ciA9IGJ1ZiA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50MTZBcnJheShidWYpKVxuXG5jb25zdCBzdHIyYWIgPSBzdHIgPT4ge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoc3RyLmxlbmd0aCAqIDIpIC8vIDIgYnl0ZXMgZm9yIGVhY2ggY2hhclxuICAgIHZhciBidWZWaWV3ID0gbmV3IFVpbnQxNkFycmF5KGJ1ZilcbiAgICBmb3IgKHZhciBpID0gMCwgc3RyTGVuID0gc3RyLmxlbmd0aDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgICAgIGJ1ZlZpZXdbaV0gPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIH1cbiAgICByZXR1cm4gYnVmXG59XG5cbmNvbnN0IG9iajJhYiA9IG9iaiA9PiBzdHIyYWIoSlNPTi5zdHJpbmdpZnkob2JqKSlcblxuY29uc3QgYWIyb2JqID0gYWIgPT4gSlNPTi5wYXJzZShhYjJzdHIoYWIpKVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBcbiAqIEByZXR1cm5zIHtQcm9taXNlPENyeXB0b0tleT59XG4gKi9cbmNvbnN0IGltcG9ydEtleSA9IGtleSA9PiB3aW5kb3cuY3J5cHRvLnN1YnRsZS5pbXBvcnRLZXkoXG4gICAgXCJqd2tcIiwgLy9jYW4gYmUgXCJqd2tcIiBvciBcInJhd1wiXG4gICAgeyAgIC8vdGhpcyBpcyBhbiBleGFtcGxlIGp3ayBrZXksIFwicmF3XCIgd291bGQgYmUgYW4gQXJyYXlCdWZmZXJcbiAgICAgICAga3R5OiBcIm9jdFwiLFxuICAgICAgICBrOiBrZXksXG4gICAgICAgIGFsZzogXCJBMjU2Q1RSXCIsXG4gICAgICAgIGV4dDogdHJ1ZSxcbiAgICB9LFxuICAgIHsgICAvL3RoaXMgaXMgdGhlIGFsZ29yaXRobSBvcHRpb25zXG4gICAgICAgIG5hbWU6IFwiQUVTLUNUUlwiLFxuICAgIH0sXG4gICAgZmFsc2UsIC8vd2hldGhlciB0aGUga2V5IGlzIGV4dHJhY3RhYmxlIChpLmUuIGNhbiBiZSB1c2VkIGluIGV4cG9ydEtleSlcbiAgICBbXCJlbmNyeXB0XCIsIFwiZGVjcnlwdFwiXSAvL2NhbiBcImVuY3J5cHRcIiwgXCJkZWNyeXB0XCIsIFwid3JhcEtleVwiLCBvciBcInVud3JhcEtleVwiXG4pXG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge0NyeXB0b0tleX0ga2V5IFxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgXG4gKiBAcGFyYW0geyp9IG9wdGlvbnMgdG8gYmUgZGVmaW5lZCwgZm9yIGZ1dHVyZSBuZWVkc1xuICovXG5jb25zdCBlbmNyeXB0V2l0aEtleSA9IChrZXksIGRhdGEsIG9wdGlvbnMgPSB7fSkgPT4gd2luZG93LmNyeXB0by5zdWJ0bGUuZW5jcnlwdChcbiAgICB7XG4gICAgICAgIG5hbWU6IFwiQUVTLUNUUlwiLFxuICAgICAgICAvL0Rvbid0IHJlLXVzZSBjb3VudGVycyFcbiAgICAgICAgLy9BbHdheXMgdXNlIGEgbmV3IGNvdW50ZXIgZXZlcnkgdGltZSB5b3VyIGVuY3J5cHQhXG4gICAgICAgIGNvdW50ZXI6IG5ldyBVaW50OEFycmF5KDE2KSxcbiAgICAgICAgbGVuZ3RoOiAxMjgsIC8vY2FuIGJlIDEtMTI4XG4gICAgfSxcbiAgICBrZXksIC8vZnJvbSBnZW5lcmF0ZUtleSBvciBpbXBvcnRLZXkgYWJvdmVcbiAgICBvYmoyYWIoZGF0YSkgLy9BcnJheUJ1ZmZlciBvZiBkYXRhIHlvdSB3YW50IHRvIGVuY3J5cHRcbilcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB7Q3J5cHRvS2V5fSBrZXkgXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBkYXRhIFxuICogQHBhcmFtIHsqfSBvcHRpb25zIHRvIGJlIGRlZmluZWQsIGZvciBmdXR1cmUgbmVlZHNcbiAqL1xuY29uc3QgZGVjcnlwdFdpdGhLZXkgPSAoa2V5LCBkYXRhLCBvcHRpb25zID0ge30pID0+IHdpbmRvdy5jcnlwdG8uc3VidGxlLmRlY3J5cHQoXG4gICAge1xuICAgICAgICBuYW1lOiBcIkFFUy1DVFJcIixcbiAgICAgICAgY291bnRlcjogbmV3IEFycmF5QnVmZmVyKDE2KSwgLy9UaGUgc2FtZSBjb3VudGVyIHlvdSB1c2VkIHRvIGVuY3J5cHRcbiAgICAgICAgbGVuZ3RoOiAxMjgsIC8vVGhlIHNhbWUgbGVuZ3RoIHlvdSB1c2VkIHRvIGVuY3J5cHRcbiAgICB9LFxuICAgIGtleSwgLy9mcm9tIGdlbmVyYXRlS2V5IG9yIGltcG9ydEtleSBhYm92ZVxuICAgIGRhdGEgLy9BcnJheUJ1ZmZlciBvZiB0aGUgZGF0YVxuKVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFxuICogQHBhcmFtIHsqfSBvcHRpb25zIHRvIGJlIGRlZmluZWQsIGZvciBmdXR1cmUgbmVlZHNcbiAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59XG4gKi9cbmNvbnN0IGVuY3J5cHQgPSAoa2V5LCBkYXRhLCBvcHRpb25zID0ge30pID0+IGltcG9ydEtleShrZXkpXG4gICAgLnRoZW4oa2V5T2JqID0+IGVuY3J5cHRXaXRoS2V5KGtleU9iaiwgZGF0YSwgb3B0aW9ucykpXG4gICAgLnRoZW4oYWIyc3RyKVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBcbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIFxuICogQHBhcmFtIHsqfSBvcHRpb25zIHRvIGJlIGRlZmluZWQsIGZvciBmdXR1cmUgbmVlZHNcbiAqIEByZXR1cm5zIHtQcm9taXNlPFN0cmluZz59XG4gKi9cbmV4cG9ydCBjb25zdCBkZWNyeXB0ID0gKGtleSwgZGF0YSwgb3B0aW9ucyA9IHt9KSA9PiBpbXBvcnRLZXkoa2V5KVxuICAgIC50aGVuKGtleU9iaiA9PiBkZWNyeXB0V2l0aEtleShrZXlPYmosIHN0cjJhYihkYXRhKSwgb3B0aW9ucykpXG4gICAgLnRoZW4oYWIyc3RyKVxuICAgIC50aGVuKHN0ciA9PiBKU09OLnBhcnNlKHN0cikpXG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIFxuICogQHBhcmFtIHtTdHJpbmd9IGtleSBcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFxuICogQHBhcmFtIHsqfSBvcHRpb25zICB0byBiZSBkZWZpbmVkLCBmb3IgZnV0dXJlIG5lZWRzXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IGNvbnN0IHNlbmRFbmNyeXB0ZWQgPSAodXJsLCBrZXksIGRhdGEsIG9wdGlvbnMgPSB7fSkgPT4gZW5jcnlwdChrZXksIGRhdGEpXG4gICAgLnRoZW4oZW5jcnlwdGVkID0+IChlbmNyeXB0ZWQubGVuZ3RoID49IFFTX0xFTkdUSF9MSU1JVCkgP1xuICAgICAgICBmZXRjaCh1cmwsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBbRU5DUllQVEVEX1BST1BfTkFNRV06IGVuY3J5cHRlZCB9KVxuICAgICAgICB9KSA6IGZldGNoKGAke3VybH0/JHtFTkNSWVBURURfUFJPUF9OQU1FfT0ke2VuY3J5cHRlZH1gKSlcbiJdLCJzb3VyY2VSb290IjoiIn0=