export interface Account {
    id: number;
    name: string;
    secret: string;
}

declare global {
    interface Window {
        electron: {
            accounts: {
                add: (userId: number, name: string, secret: string) => Promise<number>;
                getAll: (userId: number) => Promise<Account[]>;
                delete: (userId: number, accountId: number) => Promise<void>;
            };
            auth: {
                register: (username: string, password: string) => Promise<number>;
                login: (username: string, password: string) => Promise<{ id: number }>;
            };
        };
    }
}

export {};
