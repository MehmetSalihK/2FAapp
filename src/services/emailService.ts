import sgMail from '@sendgrid/mail';

// Initialiser SendGrid avec votre clé API
const SENDGRID_API_KEY = process.env.REACT_APP_SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

export const sendVerificationEmail = async (
  toEmail: string,
  code: string
): Promise<boolean> => {
  try {
    const msg = {
      to: toEmail,
      from: process.env.REACT_APP_SENDER_EMAIL || '', // email vérifié dans SendGrid
      subject: 'Code de vérification - 2FA App',
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

    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};
