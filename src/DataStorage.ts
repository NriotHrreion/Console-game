import { VarTypes } from "./types";

const storageNamespace = "console-game";

export default class DataStorage {
    private static instance: DataStorage;
    private storage = window.localStorage;

    public static get(): DataStorage {
        if(!DataStorage.instance) {
            DataStorage.instance = new DataStorage();
        }
        return DataStorage.instance;
    }

    // public setItem(key: string, value: string): void {
    //     window.localStorage.setItem(storageNamespace +"."+ key, value);
    // }

    // public getItem(key: string): string {
    //     return window.localStorage.getItem(storageNamespace +"."+ key);
    // }

    public setSave(save: VarTypes.LocalSave): void {
        this.storage.setItem(storageNamespace +".save", JSON.stringify(save));
    }

    public getSave(): VarTypes.LocalSave {
        return JSON.parse(this.storage.getItem(storageNamespace +".save")) as VarTypes.LocalSave;
    }

    public deleteSave(): void {
        this.storage.removeItem(storageNamespace +".save");
    }

    public isSaveExsit(): boolean {
        return this.storage.getItem(storageNamespace +".save") === null ? false : true;
    }
}
