import transporter from "../config/nodeMailer.js";


export const sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        let mailOptions = {
            from: email,
            to: process.env.EMAIL_USER, // Your email
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending email", error: error.message });
    }
};
