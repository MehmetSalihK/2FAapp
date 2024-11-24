import React, { useState, useEffect, useCallback } from 'react';
import { authenticator } from 'otplib';
import { Container, Paper, Typography, TextField, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import { Account, addAccount, getAccounts, deleteAccount } from '../services/accounts';
import { logoutUser } from '../services/auth';

interface TwoFactorAuthProps {
    userId: string;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ userId }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [newAccountName, setNewAccountName] = useState('');
    const [newSecret, setNewSecret] = useState('');
    const [codes, setCodes] = useState<{ [key: string]: string }>({});

    const loadAccounts = useCallback(async () => {
        try {
            const userAccounts = await getAccounts(userId);
            setAccounts(userAccounts);
        } catch (error) {
            console.error('Error loading accounts:', error);
        }
    }, [userId]);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newCodes: { [key: string]: string } = {};
            accounts.forEach(account => {
                try {
                    newCodes[account.name] = authenticator.generate(account.secret);
                } catch (error) {
                    console.error(`Erreur lors de la génération du code pour ${account.name}:`, error);
                    newCodes[account.name] = 'Erreur';
                }
            });
            setCodes(newCodes);
        }, 1000);

        return () => clearInterval(interval);
    }, [accounts]);

    const handleAddAccount = async () => {
        if (newAccountName && newSecret) {
            try {
                await addAccount(userId, newAccountName, newSecret);
                await loadAccounts();
                setNewAccountName('');
                setNewSecret('');
            } catch (error) {
                console.error('Error adding account:', error);
            }
        }
    };

    const handleDeleteAccount = async (accountId: string) => {
        try {
            await deleteAccount(accountId);
            await loadAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            window.location.reload();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">
                        2FA Manager
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </Button>
                </Box>

                <Box mb={4}>
                    <TextField
                        fullWidth
                        label="Nom du compte"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Clé secrète"
                        value={newSecret}
                        onChange={(e) => setNewSecret(e.target.value)}
                        margin="normal"
                        type="password"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddAccount}
                        fullWidth
                        style={{ marginTop: '1rem' }}
                    >
                        Ajouter un compte
                    </Button>
                </Box>

                <List>
                    {accounts.map((account) => (
                        <ListItem key={account.id}>
                            <ListItemText
                                primary={account.name}
                                secondary={codes[account.name] || 'Génération du code...'}
                            />
                            <Button
                                color="error"
                                onClick={() => handleDeleteAccount(account.id)}
                            >
                                Supprimer
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default TwoFactorAuth;
