"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var api = _axios["default"].create({
  baseURL: 'https://api.uztelecom.dadabayev.uz/api',
  headers: {
    'Authorization': "Bearer ".concat(localStorage.getItem("token"))
  }
});

var _default = api;
exports["default"] = _default;