/******/
(() => { // webpackBootstrap
  /******/
  var __webpack_modules__ = ({

    /***/
    "./add.js":
      /*!****************!*\
!*** ./add.js ***!
\****************/
      /*! unknown exports (runtime-defined) */
      /*! runtime requirements: module */
      /*! CommonJS bailout: module.exports is used directly at 3:0-14 */
      /***/
      ((module) => {

        const add = (a, b) => a + b;

        module.exports = {
          add
        };


        /***/
      }),

    /***/
    "./sub.js":
      /*!****************!*\
!*** ./sub.js ***!
\****************/
      /*! unknown exports (runtime-defined) */
      /*! runtime requirements: module */
      /*! CommonJS bailout: module.exports is used directly at 3:0-14 */
      /***/
      ((module) => {

        const sub = (a, b) => a - b;

        module.exports = {
          sub
        };


        /***/
      })

    /******/
  });
  /************************************************************************/
  /******/ // The module cache
  /******/
  var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/
  function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/
    if (__webpack_module_cache__[moduleId]) {
      /******/
      return __webpack_module_cache__[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/
    var module = __webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/
      exports: {}
      /******/
    };
    /******/
    /******/ // Execute the module function
    /******/
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/
    /******/ // Return the exports of the module
    /******/
    return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  (() => {
    /*!******************!*\
!*** ./index.js ***!
\******************/
    /*! unknown exports (runtime-defined) */
    /*! runtime requirements: __webpack_require__ */
    const {
      add
    } = __webpack_require__( /*! ./add */ "./add.js");
    const {
      sub
    } = __webpack_require__( /*! ./sub */ "./sub.js");

    console.log(add(99, 1));
    console.log(sub(99, 1));
  })();

  /******/
})();
//# sourceMappingURL=main.js.map