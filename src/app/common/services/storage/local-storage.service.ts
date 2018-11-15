import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private _encode(str) {
        if (!str) {
            return '';
        }
        return btoa(unescape(encodeURIComponent(str)));
    }

    private _decode(str) {
        if (!str) {
            return '';
        }
        return decodeURIComponent(escape(atob(str)));
    }
    public getItem(key: string) {
        key = this._encode(key);
        const str = localStorage.getItem(key);
        if (!str) {
            return null;
        }
        return JSON.parse(this._decode(str));
    }


    public setItem(key: string, value: string | object | any[] | number | boolean) {
        key = this._encode(key);
        const toSaveStr = JSON.stringify(value);
        localStorage.setItem(key, this._encode(toSaveStr));
    }

    public removeItem(key) {
        key = this._encode(key);
        return localStorage.removeItem(key);
    }

    public clearAll() {
        return localStorage.clear();
    }
}
