# [WIP] Musement crypto utils

## usage

```
npm i https://github.com/musement/msm-crypto.git
```

## API

Currently we provide 2 methods;

```
/**
 *
 * @param {String} key
 * @param {String} data
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */
encrypt = (key, data, options = {})
```

```
/**
 *
 * @param {Object} key
 * @param {String} data
 * @param {*} options to be defined, for future needs
 * @returns {Promise<String>}
 */
decrypt(key, data, options = {})
```

## [WIP] test


## TODO

* fix tests
* introduce typescript?
