require("dotenv").config();
const nodemailer = require("nodemailer");

export default async function handler(req, res) {
    // 🔹 Habilitar CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // 🔹 Manejar preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { nombre, empresa, email, telefono, mensaje } = req.body;

    try {
        // 🔹 Configurar transporte de Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 🔹 Configurar contenido del email
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
            `,
        };

        // 🔹 Enviar el correo
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado con éxito" });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ message: "Error al enviar el correo" });
    }
}
