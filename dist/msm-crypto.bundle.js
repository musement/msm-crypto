var msmCrypto=function(n){var t={};function e(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=n,e.c=t,e.d=function(n,t,r){e.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:r})},e.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},e.t=function(n,t){if(1&t&&(n=e(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var o in n)e.d(r,o,function(t){return n[t]}.bind(null,o));return r},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},e.p="",e(e.s=0)}([function(n,t,e){"use strict";e.r(t),e.d(t,"decrypt",function(){return f}),e.d(t,"sendEncrypted",function(){return a});var r=function(n){return String.fromCharCode.apply(null,new Uint16Array(n))},o=function(n){for(var t=new ArrayBuffer(2*n.length),e=new Uint16Array(t),r=0,o=n.length;r<o;r++)e[r]=n.charCodeAt(r);return t},u=window.crypto||window.msCrypto,i=function(n){return u.subtle.importKey("jwk",{kty:"oct",k:n,alg:"A256CTR",ext:!0},{name:"AES-CTR"},!1,["encrypt","decrypt"])},c=function(n,t){var e;arguments.length>2&&void 0!==arguments[2]&&arguments[2];return u.subtle.encrypt({name:"AES-CTR",counter:new Uint8Array(16),length:128},n,(e=t,o(JSON.stringify(e))))},f=function(n,t){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return i(n).then(function(n){return function(n,t){arguments.length>2&&void 0!==arguments[2]&&arguments[2];return u.subtle.decrypt({name:"AES-CTR",counter:new ArrayBuffer(16),length:128},n,t)}(n,o(t),e)}).then(r).then(function(n){return JSON.parse(n)})},a=function(n,t,e){arguments.length>3&&void 0!==arguments[3]&&arguments[3];return function(n,t){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return i(n).then(function(n){return c(n,t,e)}).then(r)}(t,e).then(function(t){return t.length>=2083?fetch(n,{method:"POST",body:JSON.stringify((e={},r="msmCrypt",o=t,r in e?Object.defineProperty(e,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[r]=o,e))}):fetch("".concat(n,"?").concat("msmCrypt","=").concat(t));var e,r,o})}}]);