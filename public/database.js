const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialiser la base de données
db.serialize(() => {
    // Table des utilisateurs
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Table des comptes 2FA
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        secret TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

// Fonctions d'authentification
const auth = {
    // Créer un nouvel utilisateur
    createUser: (username, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) reject(err);
                
                db.run('INSERT INTO users (username, password) VALUES (?, ?)',
                    [username, hash],
                    function(err) {
                        if (err) {
                            if (err.code === 'SQLITE_CONSTRAINT') {
                                reject(new Error('Username already exists'));
                            } else {
                                reject(err);
                            }
                        } else {
                            resolve(this.lastID);
                        }
                    }
                );
            });
        });
    },

    // Connecter un utilisateur
    loginUser: (username, password) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
                if (err) reject(err);
                if (!user) reject(new Error('User not found'));

                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) reject(err);
                    if (!match) reject(new Error('Invalid password'));
                    resolve(user);
                });
            });
        });
    }
};

// Fonctions de gestion des comptes 2FA
const accounts = {
    // Ajouter un compte 2FA
    addAccount: (userId, name, secret) => {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO accounts (user_id, name, secret) VALUES (?, ?, ?)',
                [userId, name, secret],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
    },

    // Obtenir tous les comptes d'un utilisateur
    getAccounts: (userId) => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, accounts) => {
                if (err) reject(err);
                resolve(accounts);
            });
        });
    },

    // Supprimer un compte 2FA
    deleteAccount: (userId, accountId) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM accounts WHERE id = ? AND user_id = ?',
                [accountId, userId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes);
                }
            );
        });
    }
};

module.exports = { auth, accounts };
