import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendVerificationCodeEmail = functions.https.onCall(async (data, context) => {
  const { email, code, subject } = data;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Code de vérification</h2>
        <div style="background-color: #f5f5f5; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="margin-bottom: 10px;">Voici votre code de vérification à 8 chiffres :</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 2px; margin: 20px 0;">${code}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">Ce code expirera dans 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 20px; text-align: center; color: #888; font-size: 12px;">
          <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});
