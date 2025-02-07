import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    const { nombre, empresa, email, telefono, mensaje } = req.body;

    if (!nombre || !empresa || !email || !mensaje) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // 🚀 Configuración de transporte SMTP (MEJOR QUE "gmail")
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", // Usa SMTP de Gmail
            port: 465, // Puerto seguro para SMTP
            secure: true, // true para SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // ✉️ Configuración del correo
        const mailOptions = {
            from: `"Contacto BiLab" <${process.env.EMAIL_USER}>`,
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

        // 📩 Enviar el correo
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Correo enviado con éxito" });

    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return res.status(500).json({ message: "Error al enviar el correo", error: error.message });
    }
}
