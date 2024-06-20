"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "sql", {
  enumerable: true,
  get: function get() {
    return _mssql["default"];
  }
});
exports.connectDB = void 0;

var _mssql = _interopRequireDefault(require("mssql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// dbConfig.js
var dbConfig = {
  user: 'nodeuser',
  password: 'nodepassword',
  server: 'localhost',
  database: 'ResidenciaVillaazul',
  options: {
    trustServerCertificate: true,
    encrypt: false
  }
};

var connectDB = function connectDB() {
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_mssql["default"].connect(dbConfig));

        case 3:
          console.log('Conexión a la base de datos exitosa');
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error('Error al conectar a la base de datos: ', _context.t0);
          throw _context.t0;

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.connectDB = connectDB;