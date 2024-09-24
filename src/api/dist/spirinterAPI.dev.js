"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUserFromSprinter = exports.addUserToSprinter = exports.getSprinters = void 0;

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getSprinters = function getSprinters() {
  var page,
      formattedPage,
      response,
      _args = arguments;
  return regeneratorRuntime.async(function getSprinters$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          page = _args.length > 0 && _args[0] !== undefined ? _args[0] : 1;
          _context.prev = 1;
          formattedPage = String(page).padStart(2, '0');
          _context.next = 5;
          return regeneratorRuntime.awrap(_index["default"].get("/spirinter/get-all?page=".concat(page)));

        case 5:
          response = _context.sent;
          return _context.abrupt("return", response.data);

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          console.error('Sprinterlarni olishda xatolik:', _context.t0);
          throw _context.t0;

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.getSprinters = getSprinters;

var addUserToSprinter = function addUserToSprinter(sprinterId, userIds) {
  var response;
  return regeneratorRuntime.async(function addUserToSprinter$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_index["default"].post('/spirinter/add-user-to-sprinter', {
            sprinter_id: sprinterId,
            users_id: userIds
          }));

        case 3:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error('Foydalanuvchini sprinterga qo\'shishda xatolik:', _context2.t0);
          throw _context2.t0;

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.addUserToSprinter = addUserToSprinter;

var deleteUserFromSprinter = function deleteUserFromSprinter(sprinterId, userIds) {
  var response;
  return regeneratorRuntime.async(function deleteUserFromSprinter$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_index["default"].post('/spirinter/delete-user-from-sprinter', {
            sprinter_id: sprinterId,
            users_id: userIds
          }));

        case 3:
          response = _context3.sent;
          return _context3.abrupt("return", response.data);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error('Foydalanuvchini sprinterdan olib tashlashda xatolik:', _context3.t0);
          throw _context3.t0;

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.deleteUserFromSprinter = deleteUserFromSprinter;