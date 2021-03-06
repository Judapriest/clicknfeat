"use strict";

(function () {
  R.spy = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return function (obj) {
      console.log.apply(console, R.append(obj, args));
      return obj;
    };
  };
  R.spyDebug = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return function (obj) {
      console.debug.apply(console, R.append(obj, args));
      return obj;
    };
  };
  R.spyInfo = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return function (obj) {
      console.info.apply(console, R.append(obj, args));
      return obj;
    };
  };
  R.spyWarn = function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return function (obj) {
      console.warn.apply(console, R.append(obj, args));
      return obj;
    };
  };
  R.spyError = function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return function (obj) {
      console.error.apply(console, R.append(obj, args));
      return obj;
    };
  };
  R.spyAndDiscardError = function () {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return R.pipe(R.spyError.apply(R, args), R.always(null));
  };
})();
//# sourceMappingURL=spy.js.map
