require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 📩 Ruta para manejar el envío del formulario
app.post("/send-email", async (req, res) => {
    const { nombre, empresa, email, telefono, mensaje } = req.body;

    try {
        // Configurar el transporte de Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",  // Puedes cambiarlo según el proveedor
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Configurar el correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "info@wearebilab.com",
            subject: "Nuevo mensaje de contacto",
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Empresa:</strong> ${empresa}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Mensaje:</strong> ${mensaje}</p>
            `
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado con éxito" });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ message: "Error al enviar el correo" });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
