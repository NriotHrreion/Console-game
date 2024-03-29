import { VarTypes, Key, Weapon, Mob, Item } from "./types";
import { NUtils } from "nriot-utils";

/**
 * Import Languages
 */
import zh_cn from "./lang/zh_cn";
import en from "./lang/en";

const languages = {
    zh_cn: zh_cn,
    en: en
};

function $(key: string): string {
    try {
        return languages[window.navigator.language.replace("-", "_").toLowerCase()][key];
    } catch(e) {
        return languages["zh_cn"][key];
    }
}

const assets: VarTypes.AssetsType = {
    WEAPONS: [
        {id: 0, name: $("text.empty"), level: 0, att: 0},
        {id: 1, name: $("weapon.iron_sword"), level: 0, att: 3},
        {id: 2, name: $("weapon.symbol"), level: 1, att: 4},
        {id: 3, name: $("weapon.bloodthirsty"), level: 3, att: 6},
        {id: 4, name: $("weapon.bit_sword"), level: 7, att: 10},
        {id: 5, name: $("weapon.meniscus"), level: 9, att: 12}
    ],
    MOBS: [
        {id: 1, type: "small_code_mob", name: $("mob.small_code_mob"), heart: 10},
        {id: 2, type: "medium_code_mob", name: $("mob.medium_code_mob"), heart: 20},
        {id: 3, type: "large_code_mob", name: $("mob.large_code_mob"), heart: 40},
        {id: 4, type: "super_code_mob", name: $("mob.super_code_mob"), heart: 100}
    ],
    ITEMS: [
        {name: $("weapon.symbol") +"(level 1) | 30$", price: 30, id: 2},
        {name: $("weapon.bloodthirsty") +"(level 3) | 120$", price: 120, id: 3},
        {name: $("weapon.bit_sword") +"(level 7) | 270$", price: 270, id: 4},
        {name: $("weapon.meniscus") +"(level 9) | 340$", price: 340, id: 5},
    ]
};

class Library {
    public isGameBegin: boolean = false;
    /**
     * This is in order to prevent the user press the `W` `A` `S` `D` keys at the same time.
     * If two items in `keyboardStatus` is true, the press won't take effect. (The player won't cause damage to the mob)
     */
    private keyboardStatus = {
        W: false,
        A: false,
        S: false,
        D: false
    };

    public randomBoolean(p?: number): boolean {
        return NUtils.getRandom(0, p || 1) === 0;
    }

    public setCommand(command, func): void {
        try {
            window[command] = command;
            Object.defineProperty(window, command, {
                get: func,
                enumerable: true
            });
        } catch(e) {
            // Do nothing
        }
    }

    public delCommand(command: string): void {
        delete window[command];
    }

    public getWeapon(id: number): Weapon {
        var weapons = assets.WEAPONS;

        for(let i in weapons) {
            if(weapons[i].id == id) {
                return weapons[i];
            }
        }
    }

    public getMob(id: number): Mob {
        var mobs = assets.MOBS;
        
        for(let i in mobs) {
            if(mobs[i].id == id) {
                return mobs[i];
            }
        }
    }

    public getItemList(): Item[] {
        return assets.ITEMS;
    }

    public npcSpeak(name: string, content: string, ...style: string[]): void {
        var args = '';
        for(let i in style) {
            if(typeof style[i] === "string") {
                args += ', "'+ style[i] +'"';
            }
        }

        var log = "console.log(\"[%c"+ name +"%c] "+ content +"\", \"font-weight: bold\", \"font-weight: 400\""+ args +")";
        window.eval(log);
    }

    public warnMessage(content: string): void {
        console.warn("[%c"+ $("console.warn") +"%c] "+ content, "font-weight: bold", "font-weight: 400");
    }

    public errMessage(content: string): void {
        console.error("[%c"+ $("console.err") +"%c] "+ content, "font-weight: bold", "font-weight: 400");
    }

    public groupMessage(groupName: string, groupContent: string[] | (() => string[])): void {
        if(typeof groupContent === "function") {
            groupContent = groupContent();
        }

        console.group(groupName);
        for(let i in groupContent) {
            if(typeof groupContent[i] === "string") {
                console.log(groupContent[i]);
            }
        }
        console.groupEnd();
    }

    public tips(content: string): void {
        setTimeout(function() {console.log("%c"+ content, "font-style: italic; color: gray")}, 400);
    }

    public keysListener(handles: VarTypes.KeyboardHandle): void {
        document.onkeydown = (e) => {
            switch(e.key) {
                case Key.W:
                    e.preventDefault();
                    this.keyboardStatus.W = true;
                    if(this.keyboardStatus.W && this.keyboardStatus.A === this.keyboardStatus.S === this.keyboardStatus.D === false) {
                        handles.W();
                    }
                    break;
                case Key.A:
                    e.preventDefault();
                    this.keyboardStatus.A = true;
                    if(this.keyboardStatus.A && this.keyboardStatus.W === this.keyboardStatus.S === this.keyboardStatus.D === false) {
                        handles.A();
                    }
                    break;
                case Key.S:
                    e.preventDefault();
                    this.keyboardStatus.S = true;
                    if(this.keyboardStatus.S && this.keyboardStatus.A === this.keyboardStatus.W === this.keyboardStatus.D === false) {
                        handles.S();
                    }
                    break;
                case Key.D:
                    e.preventDefault();
                    this.keyboardStatus.D = true;
                    if(this.keyboardStatus.D && this.keyboardStatus.A === this.keyboardStatus.S === this.keyboardStatus.W === false) {
                        handles.D();
                    }
                    break;
            }
        };
        document.onkeyup = (e) => {
            switch(e.key) {
                case Key.W:
                    e.preventDefault();
                    this.keyboardStatus.W = false;
                    break;
                case Key.A:
                    e.preventDefault();
                    this.keyboardStatus.A = false;
                    break;
                case Key.S:
                    e.preventDefault();
                    this.keyboardStatus.S = false;
                    break;
                case Key.D:
                    e.preventDefault();
                    this.keyboardStatus.D = false;
                    break;
            }
        };
    }
}

export var Lib = new Library();
export var text = $;
