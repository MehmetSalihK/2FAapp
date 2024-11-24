const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "electron", {
        accounts: {
            add: (userId, name, secret) =>
                ipcRenderer.invoke('account:add', userId, name, secret),
            getAll: (userId) =>
                ipcRenderer.invoke('account:getAll', userId),
            delete: (userId, accountId) =>
                ipcRenderer.invoke('account:delete', userId, accountId)
        },
        auth: {
            register: (username, password) =>
                ipcRenderer.invoke('auth:register', username, password),
            login: (username, password) =>
                ipcRenderer.invoke('auth:login', username, password)
        }
    }
);
