/**
 * Copyright (c) NriotHrreion 2020
 * The Console Game
 */

/** @enum {Number} */
const keys = {
    W: 87, // up
    A: 65, // left
    S: 83, // down
    D: 68  // right
};

/** @enum {Object} */
const assets = {
    WEAPONS: [
        {id: 1, name: "铁剑", level: 0, att: 3},
        {id: 2, name: "符号剑", level: 1, att: 4},
        {id: 3, name: "嗜血剑", level: 3, att: 6},
        {id: 4, name: "比特剑", level: 7, att: 10},
        {id: 5, name: "弯月刃", level: 9, att: 12}
    ],
    MOBS: [
        {id: 1, name: "小代码怪", heart: 10},
        {id: 2, name: "中代码怪", heart: 20},
        {id: 3, name: "大代码怪", heart: 40},
        {id: 4, name: "巨代码怪", heart: 100}
    ]
};

/**
 * @private
 * @class
 */
class Lib {
    randomMath(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    setCommand(command, func) {
        window[command] = command;
        Object.defineProperty(window, command, {
            get: func,
            enumerable: true
        });
    }

    delCommand(command) {
        delete window[command];
    }

    getWeapon(id) {
        var weapons = assets.WEAPONS;

        for(let i in weapons) {
            if(weapons[i].id == id) {
                return weapons[i];
            }
        }
    }

    getMob(id) {
        var mobs = assets.MOBS;
        
        for(let i in mobs) {
            if(mobs[i].id == id) {
                return mobs[i];
            }
        }
    }

    npcSpeak(name, content, ...style) {
        var args = '';
        for(let i in style) {
            if(typeof style[i] === "string") {
                args += ', "'+ style[i] +'"';
            }
        }

        var log = "console.log(\"[%c"+ name +"%c] "+ content +"\", \"font-weight: bold\", \"font-weight: 400\""+ args +")";
        window.eval(log);
    }

    warnMessage(content) {
        console.warn("[%c警报%c] "+ content, "font-weight: bold", "font-weight: 400");
    }

    errMessage(content) {
        console.error("[%c危险%c] "+ content, "font-weight: bold", "font-weight: 400");
    }

    groupMessage(groupName, groupCont) {
        if(typeof groupCont === "function") {
            groupCont = groupCont();
        }

        console.group(groupName);
        for(let i in groupCont) {
            if(typeof groupCont[i] === "string") {
                console.log(groupCont[i]);
            }
        }
        console.groupEnd();
    }

    tips(content) {
        setTimeout(function() {console.log("%c"+ content, "font-style: italic; color: gray")}, 400);
    }

    keysListener(handles) {
        document.onkeydown = function(e) {
            var eve = e || window.event;

            switch(eve.keyCode) {
                case keys.W:
                    eve.preventDefault();
                    handles.W();
                    break;
                case keys.A:
                    eve.preventDefault();
                    handles.A();
                    break;
                case keys.S:
                    eve.preventDefault();
                    handles.S();
                    break;
                case keys.D:
                    eve.preventDefault();
                    handles.D();
                    break;
            }
        }
    }
}

export var lib = new Lib();
