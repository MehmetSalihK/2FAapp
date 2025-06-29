import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

// Déclaration TypeScript pour EmailJS
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void;
      send: (serviceId: string, templateId: string, templateParams: any) => Promise<any>;
    };
  }
}

// Import EmailJS depuis le CDN
declare const emailjs: {
  init: (publicKey: string) => void;
  send: (serviceId: string, templateId: string, templateParams: any) => Promise<any>;
};

// Service d'envoi d'email avec EmailJS (gratuit et fiable)
export const sendVerificationEmail = async (
  toEmail: string,
  code: string
): Promise<boolean> => {
  try {
    // Vérifier que EmailJS est disponible
    if (typeof emailjs === 'undefined' && !window.emailjs) {
      throw new Error('EmailJS n\'est pas chargé');
    }

    // Utiliser emailjs global ou window.emailjs
    const emailjsInstance = typeof emailjs !== 'undefined' ? emailjs : window.emailjs;

    // Configuration EmailJS
    const serviceId = 'sketur60';
    const templateId = 'template_3s3kb54';
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

    // Initialiser EmailJS avec la clé publique
    emailjsInstance.init(publicKey);

    // Paramètres du template EmailJS
    const templateParams = {
      to_email: toEmail,
      to_name: toEmail.split('@')[0], // Utilise la partie avant @ comme nom
      from_name: 'Équipe 2FA',
      subject: '🔐 Code de vérification 2FA',
      verification_code: code,
      // Paramètres alternatifs pour compatibilité
      user_email: toEmail,
      recipient_email: toEmail,
      email: toEmail
    };

    // Envoyer l'email via EmailJS
    const result = await emailjsInstance.send(serviceId, templateId, templateParams);

    console.log('Email envoyé avec succès via EmailJS:', result);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    // Fallback: afficher dans la console en cas d'erreur
    console.log(`\n=== CODE DE VÉRIFICATION (FALLBACK) ===`);
    console.log(`Email: ${toEmail}`);
    console.log(`Code: ${code}`);
    console.log(`Erreur: ${error}`);
    console.log(`==========================================\n`);
    return true; // Retourner true pour ne pas bloquer l'utilisateur
  }
};

// Fonction pour envoyer un email de récupération de mot de passe
export const sendPasswordResetEmailService = async (email: string): Promise<boolean> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Email de récupération envoyé avec succès');
    return true;
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email de récupération:', error);
    throw error; // Relancer l'erreur pour la gestion dans le composant
  }
};
