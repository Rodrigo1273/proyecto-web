import express from 'express';
import bodyParser from 'body-parser';
import sql from 'mssql';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // Import cors to handle cross-origin requests

// Configuración de __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configuración de middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
    user: 'nodeuser',
    password: 'nodepassword',  // Asegúrate de poner la contraseña correcta aquí
    server: 'localhost',
    database: 'ResidenciaVillaazul',
    options: {
        trustServerCertificate: true,
        encrypt: false
    }
};

// Ruta para manejar el registro de usuarios
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('nombre', sql.NVarChar, req.body.nombre)
            .input('email', sql.NVarChar, req.body.email)
            .input('password', sql.NVarChar, hashedPassword)
            .query('INSERT INTO Usuarios (nombre, email, password) VALUES (@nombre, @email, @password)');
        res.status(200).send('Usuario registrado correctamente');
    } catch (err) {
        console.error('Error al registrar usuario: ', err);
        res.status(500).send('Error al registrar usuario');
    }
});

// Ruta para manejar el inicio de sesión de usuarios
app.post('/login', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('email', sql.NVarChar, req.body.email)
            .query('SELECT * FROM Usuarios WHERE email = @email');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);

            if (passwordMatch) {
                res.status(200).json({ success: true, message: 'Inicio de sesión exitoso' });
            } else {
                res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Correo electrónico no encontrado' });
        }
    } catch (err) {
        console.error('Error al iniciar sesión: ', err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Ruta para manejar el envío del formulario de contacto
app.post('/contact', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('nombre', sql.NVarChar, req.body.nombre)
            .input('email', sql.NVarChar, req.body.email)
            .input('telefono', sql.NVarChar, req.body.telefono)
            .input('whatsapp', sql.NVarChar, req.body.whatsapp)
            .input('estado', sql.NVarChar, req.body.estado)
            .input('tipoVisita', sql.NVarChar, req.body.tipoVisita.join(','))
            .input('comentarios', sql.NVarChar, req.body.comentarios)
            .input('comoSupo', sql.NVarChar, req.body.comoSupo)
            .input('contactoTiempo', sql.NVarChar, req.body.contactoTiempo)
            .query('INSERT INTO Contactos (nombre, email, telefono, whatsapp, estado, tipoVisita, comentarios, comoSupo, contactoTiempo) VALUES (@nombre, @email, @telefono, @whatsapp, @estado, @tipoVisita, @comentarios, @comoSupo, @contactoTiempo)');
        res.status(200).send('Formulario de contacto enviado correctamente');
    } catch (err) {
        console.error('Error al enviar formulario de contacto: ', err);
        res.status(500).send('Error al enviar formulario de contacto');
    }
});

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Residencia Villaazul');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
