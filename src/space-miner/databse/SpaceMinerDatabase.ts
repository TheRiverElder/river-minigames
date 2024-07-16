import Text from "../../libs/i18n/Text";

const SPACE_MINER_DATABASE_NAME = "SpaceMiner";

export function openSpaceMinerDatabase(): Promise<SpaceMinerDatabase> {
    return new Promise((resolve, reject) => {
        const openDatabseRequest = window.indexedDB.open(SPACE_MINER_DATABASE_NAME, 1);
        openDatabseRequest.onerror = () => reject(`IndexedDB ${SPACE_MINER_DATABASE_NAME} 数据库打开失败`);
        openDatabseRequest.onsuccess = () => {
            const database = openDatabseRequest.result;
            resolve({
                recordMessage(message) {
                    return new Promise((resolve, reject) => {
                        const transaction = database.transaction(["message"], "readwrite");
                        transaction.onerror = () => reject(`失败`);
                        transaction.onabort = () => reject(`终止`);
                        transaction.oncomplete = () => resolve();
                        
                        const messageObjectStore = transaction.objectStore("message");
                        messageObjectStore.add(message);
                        
                        transaction.commit();
                    });
                },
                close() {
                    database.close();
                },
            });
        };
        openDatabseRequest.onupgradeneeded = () => {
            const database = openDatabseRequest.result;
            const messageObjectStore = database.createObjectStore("message", { keyPath: "uid" });
            messageObjectStore.createIndex("text", "text");
        };
    });
}

export interface SpaceMinerDatabase {
    recordMessage(message: Text): Promise<void>;
    close(): void;
}