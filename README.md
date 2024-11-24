# 2FA Desktop Application

> ⚠️ **AVERTISSEMENT : Projet en Phase de Développement Initial**
>
> Ce projet est un prototype en cours de développement, créé dans un contexte éducatif et expérimental. Il n'est pas destiné à une utilisation en production et sert principalement de démonstration des concepts de sécurité et d'authentification.
>
> - 🚧 Version actuelle : 0.0.1 (Prototype)
> - 📅 Statut : Développement actif
> - 🔬 Contexte : Projet expérimental et éducatif
> - ⭐ Objectif : Démonstration des concepts 2FA
>
> **État du Développement** :
> - 🎯 **Objectifs Principaux** :
>   - Démonstration du concept 2FA
>   - Apprentissage des bonnes pratiques de sécurité
>   - Expérimentation avec Electron et React
>
> - 📊 **État des Fonctionnalités** :
>   - ⚡ Base de l'application (70%)
>   - 🔒 Authentification simple (50%)
>   - 📧 Système d'emails (30%)
>   - 🛡️ Sécurité de base (40%)
>   - 📱 Interface utilisateur (60%)
>
> - 🚧 **En Cours de Développement** :
>   - Amélioration de la sécurité
>   - Optimisation des performances
>   - Tests et validation
>   - Documentation technique
>
> **Limitations Actuelles** :
> - Application en phase prototype
> - Fonctionnalités limitées
> - Tests incomplets
> - Possible instabilité
> - Non recommandé pour usage réel
>
> **Participation** :
> - 👥 Projet ouvert aux contributions
> - 📝 Suggestions bienvenues
> - 🐛 Signalement de bugs apprécié
> - 💡 Idées d'amélioration acceptées
>
> **Note de Sécurité** : Ce projet est une démonstration et ne doit PAS être utilisé pour sécuriser des données sensibles ou des applications réelles.

Une application de bureau sécurisée d'authentification à deux facteurs construite avec Electron, React et Firebase. Cette application offre une solution robuste et moderne pour sécuriser l'accès à vos applications avec une vérification en deux étapes.

![Capture d'écran de l'application](screenshot.png)

## 📋 Table des Matières
- [Introduction](#introduction)
  - [Pourquoi 2FA ?](#pourquoi-2fa)
  - [Caractéristiques Clés](#caractéristiques-clés)
  - [Public Cible](#public-cible)
- [Fonctionnalités](#fonctionnalités)
  - [Authentification](#authentification)
  - [Sécurité](#sécurité)
  - [Interface](#interface)
  - [Notifications](#notifications)
- [Technologies](#technologies)
  - [Stack Technique](#stack-technique)
  - [Dépendances](#dépendances)
  - [Outils](#outils)
- [Prérequis](#prérequis)
  - [Système](#système)
  - [Comptes Requis](#comptes-requis)
  - [Connaissances](#connaissances)
- [Installation](#installation)
  - [Installation Standard](#installation-standard)
  - [Installation Développeur](#installation-développeur)
  - [Problèmes Courants](#problèmes-courants)
- [Configuration](#configuration)
  - [Firebase](#firebase)
  - [SendGrid](#sendgrid)
  - [Variables d'Environnement](#variables-denvironnement)
- [Utilisation](#utilisation)
  - [Démarrage](#démarrage)
  - [Connexion](#connexion)
  - [Gestion des Codes](#gestion-des-codes)
- [Architecture](#architecture)
  - [Structure](#structure)
  - [Composants](#composants)
  - [Services](#services)
- [Sécurité](#sécurité)
  - [Mesures](#mesures)
  - [Bonnes Pratiques](#bonnes-pratiques)
  - [Audits](#audits)
- [Développement](#développement)
  - [Scripts](#scripts)
  - [Guidelines](#guidelines)
  - [Workflow](#workflow)
- [Tests](#tests)
  - [Types de Tests](#types-de-tests)
  - [Couverture](#couverture)
  - [CI/CD](#cicd)
- [Déploiement](#déploiement)
  - [Environnements](#environnements)
  - [Builds](#builds)
  - [Distribution](#distribution)
- [FAQ](#faq)
  - [Général](#général)
  - [Technique](#technique)
  - [Sécurité](#sécurité-1)
- [Dépannage](#dépannage)
  - [Problèmes Connus](#problèmes-connus)
  - [Solutions](#solutions)
  - [Support](#support)
- [Contribuer](#contribuer)
  - [Comment Contribuer](#comment-contribuer)
  - [Code de Conduite](#code-de-conduite)
  - [Pull Requests](#pull-requests)
- [Licence](#licence)
  - [Termes](#termes)
  - [Attribution](#attribution)

## ⚙️ Prérequis

### Système
#### Matériel Minimum
- Processeur : 1.6 GHz dual-core
- RAM : 4 GB
- Espace disque : 500 MB

#### Systèmes d'Exploitation Supportés
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 20.04+)

### Comptes Requis
#### Firebase
- Compte Google
- Projet Firebase
- Plan Spark (gratuit) minimum

#### SendGrid
- Compte vérifié
- Domaine validé
- API Key avec permissions

### Connaissances Recommandées
- JavaScript/TypeScript
- React Basics
- Electron Concepts
- Sécurité Web

## 🛠️ Installation

### Installation Standard
#### Windows
```powershell
# Installation via npm
npm install -g 2fa-desktop
```

#### macOS
```bash
# Installation via Homebrew
brew install 2fa-desktop
```

#### Linux
```bash
# Installation via apt
sudo apt-get install 2fa-desktop
```

### Installation Développeur
```bash
# Cloner le repo
git clone https://github.com/votre-username/2fa-desktop.git

# Installer les dépendances
cd 2fa-desktop
npm install

# Configurer l'environnement
cp .env.example .env
```

### Problèmes Courants
#### Erreurs npm
```bash
# Nettoyer le cache
npm cache clean --force

# Réinstaller les node_modules
rm -rf node_modules
npm install
```

## ⚡ Configuration

### Firebase
#### Création du Projet
1. Accédez à la [Console Firebase](https://console.firebase.google.com)
2. Créez un nouveau projet
3. Activez Authentication

#### Configuration Web
```typescript
// src/firebase.ts
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};
```

### SendGrid
#### Configuration API
1. Créez une [Clé API](https://app.sendgrid.com/settings/api_keys)
2. Configurez les permissions
3. Ajoutez la clé dans .env

#### Template Email
```html
<!-- email-template.html -->
<div style="font-family: Arial, sans-serif;">
  <h1>Code de Vérification</h1>
  <p>Votre code : <strong>{{code}}</strong></p>
  <p>Expire dans : 10 minutes</p>
</div>
```

### Variables d'Environnement
#### Production
```env
# .env.production
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_SENDGRID_API_KEY=your_sendgrid_key
REACT_APP_SENDER_EMAIL=your_email
```

#### Développement
```env
# .env.development
REACT_APP_FIREBASE_API_KEY=dev_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=dev_domain
REACT_APP_SENDGRID_API_KEY=dev_sendgrid_key
REACT_APP_SENDER_EMAIL=dev_email
```

## 📱 Utilisation

### Démarrage
#### Mode Production
```bash
# Lancer l'application
npm start
```

#### Mode Développement
```bash
# Lancer avec hot reload
npm run electron-dev
```

### Connexion
#### Étape 1 : Identifiants
1. Ouvrez l'application
2. Entrez votre email
3. Saisissez votre mot de passe

#### Étape 2 : Vérification
1. Attendez l'email
2. Copiez le code
3. Collez dans l'application

### Gestion des Codes
#### Génération
```typescript
// services/codeService.ts
export const generateVerificationCode = (): string => {
  const code = Math.random().toString().substring(2, 10);
  const salt = crypto.randomBytes(16).toString('hex');
  return encryptCode(code, salt);
};
```

#### Validation
```typescript
// services/codeService.ts
export const validateCode = async (
  inputCode: string,
  storedCode: string
): Promise<boolean> => {
  if (isExpired(storedCode)) return false;
  return compareCode(inputCode, storedCode);
};
```

## 🏗️ Architecture

### Structure
#### Arborescence
```
2fa-desktop/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   └── layout/
│   ├── services/
│   │   ├── auth.ts
│   │   ├── email.ts
│   │   └── storage.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useCode.ts
│   └── utils/
│       ├── crypto.ts
│       └── validation.ts
└── electron/
    ├── main.ts
    └── preload.ts
```

### Composants
#### AuthForm
```typescript
// components/auth/AuthForm.tsx
const AuthForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        loading={isLoading}
        type="submit"
      >
        Connexion
      </Button>
    </form>
  );
};
```

#### CodeInput
```typescript
// components/auth/CodeInput.tsx
const CodeInput: React.FC = () => {
  const { verifyCode } = useCode();
  const [code, setCode] = useState('');
  
  return (
    <div>
      <PinInput
        value={code}
        onChange={setCode}
        length={8}
      />
      <Button onClick={() => verifyCode(code)}>
        Vérifier
      </Button>
    </div>
  );
};
```

### Services
#### AuthService
```typescript
// services/auth.ts
export class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      const result = await firebase.auth().signInWithEmailAndPassword(
        email,
        password
      );
      return result.user;
    } catch (error) {
      throw new AuthError(error.message);
    }
  }
}
```

#### EmailService
```typescript
// services/email.ts
export class EmailService {
  async sendVerificationCode(
    email: string,
    code: string
  ): Promise<void> {
    const msg = {
      to: email,
      from: process.env.REACT_APP_SENDER_EMAIL,
      subject: 'Code de Vérification',
      html: await this.generateEmailTemplate(code),
    };
    
    await sendgrid.send(msg);
  }
}
```

## 🔒 Sécurité

### Mesures
#### Protection des Données
```typescript
// utils/crypto.ts
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  
  async encrypt(data: string): Promise<string> {
    const key = await this.deriveKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return JSON.stringify({
      iv: iv.toString('hex'),
      data: encrypted,
      tag: cipher.getAuthTag().toString('hex')
    });
  }
}
```

#### Validation des Entrées
```typescript
// utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCode = (code: string): boolean => {
  const codeRegex = /^\d{8}$/;
  return codeRegex.test(code);
};
```

### Bonnes Pratiques
#### Gestion des Sessions
```typescript
// services/session.ts
export class SessionManager {
  private readonly maxAge = 600000; // 10 minutes
  
  createSession(userId: string): string {
    const token = this.generateToken();
    const expiresAt = Date.now() + this.maxAge;
    
    this.store.set(token, {
      userId,
      expiresAt
    });
    
    return token;
  }
  
  validateSession(token: string): boolean {
    const session = this.store.get(token);
    return session && session.expiresAt > Date.now();
  }
}
```

### Audits
#### Tests de Sécurité
```typescript
// tests/security/auth.test.ts
describe('Authentication Security', () => {
  test('should block after multiple failed attempts', async () => {
    const maxAttempts = 3;
    for (let i = 0; i < maxAttempts + 1; i++) {
      const result = await auth.login('test@example.com', 'wrong');
      if (i >= maxAttempts) {
        expect(result.status).toBe('blocked');
      }
    }
  });
});
```

## 🛠️ Développement

### Scripts
#### Package.json
```json
{
  "scripts": {
    "start": "electron-forge start",
    "build": "electron-forge make",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
```

### Guidelines
#### Code Style
```typescript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'react/prop-types': 'off'
  }
};
```

### Workflow
#### Git Hooks
```json
// .husky/pre-commit
{
  "hooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

## ✅ Tests

### Types de Tests
#### Tests Unitaires
```typescript
// tests/unit/auth.test.ts
describe('AuthService', () => {
  it('should generate valid verification code', () => {
    const code = authService.generateCode();
    expect(code).toMatch(/^\d{8}$/);
  });
  
  it('should validate correct code', () => {
    const code = '12345678';
    const isValid = authService.validateCode(code);
    expect(isValid).toBe(true);
  });
});
```

### Couverture
#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### CI/CD
#### GitHub Actions
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## 📦 Déploiement

### Environnements
#### Configuration
```typescript
// config/environments.ts
export const environments = {
  production: {
    apiUrl: 'https://api.2fa-desktop.com',
    logLevel: 'error',
    analytics: true
  },
  staging: {
    apiUrl: 'https://staging.2fa-desktop.com',
    logLevel: 'warn',
    analytics: true
  },
  development: {
    apiUrl: 'http://localhost:3000',
    logLevel: 'debug',
    analytics: false
  }
};
```

### Builds
#### Electron Builder
```javascript
// electron-builder.yml
appId: com.example.2fa-desktop
productName: 2FA Desktop
directories:
  output: dist
  buildResources: build
win:
  target: nsis
mac:
  target: dmg
linux:
  target: AppImage
```

### Distribution
#### Auto Update
```typescript
// electron/auto-updater.ts
export class AutoUpdater {
  async checkForUpdates(): Promise<void> {
    try {
      const updateAvailable = await autoUpdater.checkForUpdates();
      if (updateAvailable) {
        await autoUpdater.downloadUpdate();
        autoUpdater.quitAndInstall();
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  }
}
```

## ❓ FAQ

### Général
#### Installation
1. **Q: Comment installer sur Windows ?**
   ```powershell
   winget install 2fa-desktop
   ```

2. **Q: Où sont stockées les données ?**
   ```typescript
   // Chemin par défaut
   const userDataPath = app.getPath('userData');
   ```

### Technique
#### Développement
1. **Q: Comment déboguer ?**
   ```bash
   # Lancer en mode debug
   npm run debug
   ```

2. **Q: Comment tester les emails ?**
   ```typescript
   // Utiliser le mode test de SendGrid
   SENDGRID_TEST_MODE=true
   ```

### Sécurité
#### Protection
1. **Q: Comment sont stockés les mots de passe ?**
   ```typescript
   // Utilisation de bcrypt
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Q: Fréquence de rotation des clés ?**
   ```typescript
   // Rotation automatique tous les 30 jours
   const KEY_ROTATION_DAYS = 30;
   ```

## 🔧 Dépannage

### Problèmes Connus
#### Erreurs Communes
```typescript
// utils/error-handler.ts
export class ErrorHandler {
  handleAuthError(error: AuthError): void {
    switch (error.code) {
      case 'auth/wrong-password':
        notify.error('Mot de passe incorrect');
        break;
      case 'auth/user-not-found':
        notify.error('Utilisateur non trouvé');
        break;
      default:
        notify.error('Erreur de connexion');
    }
  }
}
```

### Solutions
#### Récupération
```typescript
// services/recovery.ts
export class RecoveryService {
  async resetPassword(email: string): Promise<void> {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      notify.success('Email de réinitialisation envoyé');
    } catch (error) {
      throw new RecoveryError(error.message);
    }
  }
}
```

### Support
#### Contact
- Email: support@2fa-desktop.com
- Discord: [Rejoindre le serveur](https://discord.gg/2fa-desktop)
- GitHub: [Ouvrir une issue](https://github.com/2fa-desktop/issues)

## 🤝 Contribuer

### Comment Contribuer
1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Code de Conduite
Nous attendons de tous les contributeurs qu'ils :
- Soient respectueux
- Écrivent du code documenté
- Suivent les conventions de style
- Testent leur code

### Pull Requests
#### Template
```markdown
## Description
[Description de vos changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests manuels
```

## 📄 Licence

### Termes
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

### Attribution
Développé avec ❤️ par l'équipe 2FA Desktop.

---

© 2024 2FA Desktop. Tous droits réservés.
