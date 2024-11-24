import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Account {
    id: string;
    userId: string;
    name: string;
    secret: string;
}

export const addAccount = async (userId: string, name: string, secret: string): Promise<string> => {
    try {
        const accountsRef = collection(db, 'accounts');
        const docRef = await addDoc(accountsRef, {
            userId,
            name,
            secret,
            createdAt: new Date()
        });
        return docRef.id;
    } catch (error: any) {
        throw new Error(`Erreur lors de l'ajout du compte: ${error.message}`);
    }
};

export const getAccounts = async (userId: string): Promise<Account[]> => {
    try {
        const accountsRef = collection(db, 'accounts');
        const q = query(accountsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            userId: doc.data().userId,
            name: doc.data().name,
            secret: doc.data().secret
        }));
    } catch (error: any) {
        throw new Error(`Erreur lors de la récupération des comptes: ${error.message}`);
    }
};

export const deleteAccount = async (accountId: string): Promise<void> => {
    try {
        const accountRef = doc(db, 'accounts', accountId);
        await deleteDoc(accountRef);
    } catch (error: any) {
        throw new Error(`Erreur lors de la suppression du compte: ${error.message}`);
    }
};
