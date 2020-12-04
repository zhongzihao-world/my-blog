(() => {
  var o = {
    716: o => {
      o.exports = {
        add: (o, r) => o + r
      }
    }, 495: o => {
      o.exports = {
        sub: (o, r) => o - r
      }
    }
  },
    r = {};

  function s(e) {
    if (r[e]) return r[e].exports;
    var t = r[e] = {
      exports: {}
    };
    return o[e](t, t.exports, s), t.exports
  }
  (() => {
    const {
      add: o
    } = s(716), {
      sub: r
    } = s(495);
    console.log(o(99, 1)), console.log(r(99, 1))
  })()
})();
//# sourceMappingURL=main.js.map