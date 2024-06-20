"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _dbConfig = require("./dbConfig.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// userRoutes.js
var router = _express["default"].Router(); // Ruta para manejar el registro de usuarios


router.post('/register', function _callee(req, res) {
  var hashedPassword, pool;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(req.body.password, 10));

        case 3:
          hashedPassword = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(_dbConfig.sql.connect());

        case 6:
          pool = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(pool.request().input('nombre', _dbConfig.sql.NVarChar, req.body.nombre).input('email', _dbConfig.sql.NVarChar, req.body.email).input('password', _dbConfig.sql.NVarChar, hashedPassword).query('INSERT INTO Usuarios (nombre, email, password) VALUES (@nombre, @email, @password)'));

        case 9:
          res.status(200).send('Usuario registrado correctamente');
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error al registrar usuario: ', _context.t0);
          res.status(500).send('Error al registrar usuario');

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}); // Ruta para manejar el inicio de sesión de usuarios

router.post('/login', function _callee2(req, res) {
  var pool, result, user, passwordMatch;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_dbConfig.sql.connect());

        case 3:
          pool = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(pool.request().input('email', _dbConfig.sql.NVarChar, req.body.email).query('SELECT * FROM Usuarios WHERE email = @email'));

        case 6:
          result = _context2.sent;

          if (!(result.recordset.length > 0)) {
            _context2.next = 15;
            break;
          }

          user = result.recordset[0];
          _context2.next = 11;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(req.body.password, user.password));

        case 11:
          passwordMatch = _context2.sent;

          if (passwordMatch) {
            res.status(200).json({
              success: true,
              message: 'Inicio de sesión exitoso'
            });
          } else {
            res.status(401).json({
              success: false,
              message: 'Contraseña incorrecta'
            });
          }

          _context2.next = 16;
          break;

        case 15:
          res.status(404).json({
            success: false,
            message: 'Correo electrónico no encontrado'
          });

        case 16:
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error('Error al iniciar sesión: ', _context2.t0);
          res.status(500).json({
            success: false,
            message: 'Error en el servidor'
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
var _default = router;
exports["default"] = _default;