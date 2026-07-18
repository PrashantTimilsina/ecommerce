import Mailjet from "node-mailjet";
import dotenv from "dotenv";
dotenv.config();

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_PUBLIC_KEY,
  apiSecret: process.env.MAILJET_API_PRIVATE_KEY,
});

function sendEmail(toEmail, toName, resetToken) {
  const resetURL = `https://localhost:3000/user/reset/${resetToken}`;

  mailjet
    .post("send", { version: "v3.1" })
    .request({
      Messages: [
        {
          From: {
            Email: "ecommerce@timilsinaprashant.com.np",
            Name: "Prashant's Ecommerce",
          },
          To: [
            {
              Email: toEmail,
              Name: toName,
            },
          ],
          Subject: "Reset your password",
          TextPart: `Hello ${toName},\n\nWe received a request to reset your password. Click the link below to proceed:\n\n${resetURL}\n\nIf you didn't request this, please ignore this email.`,
          HTMLPart: `
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    background-color: #f0f2f5;
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  }
                  .container {
                    max-width: 600px;
                    margin: 30px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                  }
                  .header {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    padding: 20px;
                    text-align: center;
                  }
                  .header h1 {
                    margin: 0;
                    color: #ffffff;
                    font-size: 28px;
                  }
                  .content {
                    padding: 30px;
                    color: #333333;
                  }
                  .content h2 {
                    font-size: 22px;
                    margin-top: 0;
                  }
                  .content p {
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 15px 0;
                  }
                  .footer {
                    padding: 20px;
                    background-color: #f7f7f7;
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Prashant's Ecommerce</h1>
                  </div>
                  <div class="content">
                    <h2>Hello ${toName},</h2>
                    <p>We received a request to reset your password. Click the button below to proceed:</p>
                    <p style="text-align: center;">
                      <a href="${resetURL}" style="display: inline-block; padding: 15px 30px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Thank you,</p>
                    <p>The Prashant's Ecommerce Team</p>
                  </div>
                  <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Prashant's Ecommerce. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        },
      ],
    })
    .then((result) => {
      console.log("✅ Reset email sent:");
    })
    .catch((err) => {
      console.error("Error sending reset email:", err.statusCode, err.message);
    });
}

export default sendEmail;
