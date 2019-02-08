# [WIP] Musement crypto utils

## usage

```
npm i https://github.com/musement/msm-crypto.git
```

## API

Currently we provide 2 methods;

the first one is to send an object encrypted, given a valid key


```
/**
 * 
 * @param {String} url 
 * @param {String} key 
 * @param {Object} data 
 * @param {*} options  to be defined, for future needs
 * @returns {Promise}
 */
sendEncrypted(url, key, data, options = {})
```

the second one is meant to decrypt a string encrypted through `sendEncrypted()`

```
/**
 * 
 * @param {String} key 
 * @param {String} data 
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */
decrypt(key, data, options = {})
```

## [WIP] test