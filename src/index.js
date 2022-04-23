/**
 * Copyright (c) NriotHrreion 2021
 * The Console Game
 */

/**
 * @version 0.1.1
 * @license MIT
 */
const version = "0.1.1";

/**
 * @module Library
 * 
 * Import Library Module
 */
import { Lib, text as $ } from "./lib.js";

const lib = new Lib();

(function(window) {
    /**
     * Begin Script
     */
    
    "use strict";

    const freezeObj = Object.freeze;
    const emptyFunc = function() {};

    /** @enum {Object} */
    const info_panel = {
        PANEL: document.getElementById("panel"),
        LVL: document.getElementById("i-lvl"),
        BAL: document.getElementById("i-bal"),
        WEAPON: document.getElementById("i-wp")
    };

    /** @enum {Object} */
    const boss_panel = {
        PANEL: document.getElementById("boss-panel"),
        P_HEART: document.getElementById("p-heart"),
        B_HEART: document.getElementById("b-heart")
    };

    var key_handles = {
        W: emptyFunc,
        A: emptyFunc,
        S: emptyFunc,
        D: emptyFunc
    };

    var isGameBegin = false;

    /**
     * Remove Array Item Method
     * @method
     */
    Array.prototype.indexOf = function(val) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] == val) {
                return i;
            }
        }
        return -1;
    }
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if(index > -1) {
            this.splice(index, 1);
        }
    }

    /**
     * @private
     * @class
     */
    class Main {

        /** @constructor @summary Main Class Constructor, Game Runner (zhe me shuo si hu you dian bu dui */
        constructor() {
            this.init();
            console.log(`
%c${$("game.name")}
By NriotHrreion
%c================
   
%c${$("tip.start")}
`,
                "font-weight: bold",
                "font-weight: 300",
                "font-weight: 400; color: #0e97ec"
            );
        }
    
        init() {
            this.game = new Game();
            
            console.clear = undefined;

            isGameBegin = false;
            lib.setCommand("start", () => {
                this.game.gameBegin();
                this.game.updateInfoPanel();
                isGameBegin = true;
            });
            lib.setCommand("help", () => {
                lib.groupMessage($("group.commands"), [
                    $("command.help.start"),
                    $("command.help.info"),
                    $("command.help.beg_prtc"),
                    $("command.help.g_main")
                ]);
            });
            lib.setCommand("info", () => {
                lib.groupMessage($("group.info"), [
                    $("command.info.level") +": "+ this.game.level,
                    $("command.info.wallet") +": "+ this.game.money +"$",
                    $("command.info.current_weapon") +": "+ this.game.weapon.name +"(level "+ this.game.weapon.level +")"
                ]);
            });

            console.log("%cVersion: %c"+ version, "color: yellow", "");
            console.log("%cLanguage detected: %c"+ window.navigator.language, "color: yellow", "");
        }
    }
    
    /**
     * @private
     * @class
     */
    class Game {

        /** @constructor */
        constructor() {
            this.isBeginPrtc = false;
            this.space = "begin";
            this.level = 0;
            this.money = 0;
            this.weapon = {
                name: $("text.empty"),
                level: 0,
                att: 0
            };
            this.armor = {
                head: {},
                chest: {},
                boots: {}
            };
            this.mobs = [];
            this.bossHeart = lib.getMob(4).heart;
            this.bossPosition = 0;

            // dev debug
            // window.dev_level = (a) => {this.giveLevel(a)};
            // window.dev_money = (a) => {this.giveMoney(a)};
        }

        /**================================================================================
         * Game Status
         * ================================================================================
         */
    
        gameBegin() {
            if(!isGameBegin) {
                lib.npcSpeak($("npc.system"), $("text.npc1"));
                lib.npcSpeak($("npc.guide"), $("text.npc2"));
                lib.warnMessage($("text.npc3"));
                lib.errMessage($("text.npc4"));
                lib.tips($("tip.start_game"));
                lib.setCommand("yes", () => {this.startMission()});
            } else {
                lib.npcSpeak($("npc.system"), $("text.npc5"));
            }
        }

        gameOver() {
            if(isGameBegin) {
                isGameBegin = false;

                this.space = "over";

                lib.delCommand("g_main");
            
                clearInterval(this.bossAttack);
                this.overStory();

                lib.tips($("tip.restart"));
                lib.setCommand("restart", () => {window.location.reload()});
            }
        }

        playerDeath(by) {
            this.space = "death";
            lib.delCommand("g_main");

            clearInterval(this.mobSpawner);
            console.log($("message.death").replace("%s", by));
            lib.tips($("tip.respawn"));

            lib.setCommand("respawn", () => {
                this.mainMission();
                lib.delCommand("respawn");
            });
        }

        /**================================================================================
         * Game Stories
         * ================================================================================
         */
    
        startStory() {
            console.log($("text.plot1"));
            lib.warnMessage($("text.plot2"))
            console.log($("text.plot3"));
            lib.npcSpeak($("npc.little_bit"), $("text.npc6"));
            lib.npcSpeak($("npc.old_bit"), $("text.npc7"));
            lib.npcSpeak($("npc.little_bit"), $("text.npc8"));
            console.log($("text.plot4"));
        }

        overStory() {
            console.log($("text.plot5"));
            console.log("%c"+ $("text.game_finish"), "font-size: 17px; font-weight: bold");
        }

        bossStory() {
            console.log($("text.plot6").replace("%s", this.weapon.name));
            lib.npcSpeak($("npc.little_bit"), $("text.npc9"));
            // Chinese to Binary ( you dian chang? 2333
            // Chinese: 你是阻止不了我的!
            lib.npcSpeak($("mob.super_code_mob"), "111001001011110110100000 111001101001100010101111 111010011001100010111011 111001101010110110100010 111001001011100010001101 111001001011101010000110 111001101000100010010001 111001111001101010000100 00100001");
            console.log($("text.plot7"));
        }

        /**================================================================================
         * Missions
         * ================================================================================
         */
    
        startMission() {
            lib.delCommand("yes");
            this.startStory();
            lib.tips($("tip.beg_prtc"));
            lib.setCommand("beg_prtc", () => {
                this.isBeginPrtc = true;
                console.log($("command.beg_prtc.explaination"));
                this.giveWeapon(1);
                this.giveLevel(1);
                lib.setCommand("g_prtc", () => {lib.delCommand("g_main");this.prtcMission()});
                lib.setCommand("g_main", () => {lib.delCommand("g_prtc");this.mainMission()});

                lib.delCommand("beg_prtc");
            });
        }
    
        mainMission() {
            if(this.space != "main") {
                this.space = "main";

                this.mobs = [];
                clearInterval(this.mobSpawner);

                lib.groupMessage($("group.hub"), [
                    $("text.g_prtc"),
                    $("text.g_shop")
                ]);

                lib.delCommand("g_main");
                lib.setCommand("g_prtc", () => {this.prtcMission()});
                lib.setCommand("g_shop", () => {this.shopMission()});

                lib.keysListener(key_handles);
            }
        }
    
        prtcMission() {

            var prtc_handles = {
                
                // up
                W: () => {
                    for(let i in this.mobs) {
                        if(this.mobs[i].dir == 1) {
                            this.mobs[i].heart -= this.weapon.att;
                            if(this.mobs[i].heart > 0) {
                                lib.npcSpeak($("npc.system"), $("message.attack").replace("%s", this.mobs[i].heart));
                            } else {
                                lib.npcSpeak($("npc.system"), $("message.kill"));
                                this.killMobLevel(this.mobs[i].id);
                                this.mobs.remove(this.mobs[i]);
                            }
                            break;
                        }
                    }
                },

                // left
                A: () => {
                    for(let i in this.mobs) {
                        if(this.mobs[i].dir == 3) {
                            this.mobs[i].heart -= this.weapon.att;
                            if(this.mobs[i].heart > 0) {
                                lib.npcSpeak($("npc.system"), $("message.attack").replace("%s", this.mobs[i].heart));
                            } else {
                                lib.npcSpeak($("npc.system"), $("message.kill"));
                                this.killMobLevel(this.mobs[i].id);
                                this.mobs.remove(this.mobs[i]);
                            }
                            break;
                        }
                    }
                },

                // down
                S: () => {
                    for(let i in this.mobs) {
                        if(this.mobs[i].dir == 2) {
                            this.mobs[i].heart -= this.weapon.att;
                            if(this.mobs[i].heart > 0) {
                                lib.npcSpeak($("npc.system"), $("message.attack").replace("%s", this.mobs[i].heart));
                            } else {
                                lib.npcSpeak($("npc.system"), $("message.kill"));
                                this.killMobLevel(this.mobs[i].id);
                                this.mobs.remove(this.mobs[i]);
                            }
                            break;
                        }
                    }
                },

                // right
                D: () => {
                    for(let i in this.mobs) {
                        if(this.mobs[i].dir == 4) {
                            this.mobs[i].heart -= this.weapon.att;
                            if(this.mobs[i].heart > 0) {
                                lib.npcSpeak($("npc.system"), $("message.attack").replace("%s", this.mobs[i].heart));
                            } else {
                                lib.npcSpeak($("npc.system"), $("message.kill"));
                                this.killMobLevel(this.mobs[i].id);
                                this.mobs.remove(this.mobs[i]);
                            }
                            break;
                        }
                    }
                }
            };

            if(this.space != "prtc") {
                this.space = "prtc";

                this.mobs = [];

                lib.npcSpeak($("npc.system"), $("text.npc10"));
                lib.npcSpeak($("npc.system"), $("text.npc11"));
                lib.npcSpeak($("npc.system"), $("text.npc12"));

                lib.delCommand("g_prtc");
                lib.delCommand("g_shop");
                lib.setCommand("g_main", () => {this.mainMission()});
                
                lib.keysListener(prtc_handles);
                
                this.mobSpawner = setInterval(() => {
                    if(this.mobs.length <= 7) {
                        this.spawnMob();
                    } else {
                        this.playerDeath($("mob.code_mob"));
                    }
                }, 3000);
            }
        }

        shopMission() {
            if(this.space != "shop") {
                this.space = "shop";

                var items = [
                    {name: $("weapon.symbol") +"(level 1) | 30$", price: 30, id: 2},
                    {name: $("weapon.bloodthirsty") +"(level 3) | 120$", price: 120, id: 3},
                    {name: $("weapon.bit_sword") +"(level 7) | 270$", price: 270, id: 4},
                    {name: $("weapon.meniscus") +"(level 9) | 340$", price: 340, id: 5},
                ];
                var switcher = 0;

                lib.delCommand("g_shop");
                lib.delCommand("g_prtc");
                lib.setCommand("g_main", () => {
                    this.mainMission();
                    lib.delCommand("select");
                    lib.delCommand("buy");
                });

                lib.npcSpeak($("npc.system"), $("text.npc13"));
                lib.groupMessage($("group.shop"), function() {
                    var it = [];
                    for(let i in items) {
                        if(items[i].name != "") {
                            it.push(items[i].name);
                        }
                    }
                    return it;
                });
                lib.tips($("tip.shop"));

                lib.setCommand("select", () => {
                    if(switcher < items.length - 1) {
                        switcher++;
                    } else {
                        switcher = 0;
                    }
                    console.log($("message.selected").replace("%s", items[switcher].name), "color: yellow");
                });
                lib.setCommand("buy", () => {
                    if(items[switcher].price <= this.money) {
                        this.money -= items[switcher].price;
                        this.giveWeapon(items[switcher].id);
                        lib.npcSpeak($("npc.shop"), $("message.bought").replace("%s", this.money));
                    } else {
                        lib.npcSpeak($("npc.shop"), $("message.cant_afford"));
                    }
                });
            }
        }

        bossMission() {
            var _this = this;

            var attack_flag = false;
            var boss_handles = {
                
                // north
                W: () => {
                    if(this.bossPosition == 0 && this.bossHeart > 0) {
                        this.bossHeart -= (this.weapon.att - 2);
                        attack_flag = true;
                        updatePanel();
                    } else if(this.bossPosition == 0) {
                        this.gameOver();
                    }
                },

                // east
                D: () => {
                    if(this.bossPosition == 1 && this.bossHeart > 0) {
                        this.bossHeart -= (this.weapon.att - 2);
                        attack_flag = true;
                        updatePanel();
                    } else if(this.bossPosition == 1) {
                        this.gameOver();
                    }
                },

                // south
                S: () => {
                    if(this.bossPosition == 2 && this.bossHeart > 0) {
                        this.bossHeart -= (this.weapon.att - 2);
                        attack_flag = true;
                        updatePanel();
                    } else if(this.bossPosition == 2) {
                        this.gameOver();
                    }
                },

                // west
                A: () => {
                    if(this.bossPosition == 3 && this.bossHeart > 0) {
                        this.bossHeart -= (this.weapon.att - 2);
                        attack_flag = true;
                        updatePanel();
                    } else if(this.bossPosition == 3) {
                        this.gameOver();
                    }
                }
            };
            
            if(this.space != "boss") {
                this.space = "boss";

                this.bossStory();

                var boss = lib.getMob(4);
                var player_heart = 30;

                /**
                 * BOSS Position
                 * 
                 * 0 => North
                 * 1 => East
                 * 2 => South
                 * 3 => West
                 */
                this.bossPosition = 0;

                updatePanel();

                lib.npcSpeak($("npc.system"), $("text.npc14"));
                lib.npcSpeak($("npc.system"), $("text.npc11"));
                lib.keysListener(boss_handles);

                this.bossAttack = setInterval(() => {
                    var posi = lib.randomMath(0, 3);
                    this.bossPosition = posi;

                    switch(posi) {
                        case 0:
                            lib.errMessage($("text.boss.north"), "font-weight: bold", "font-weight: 400");
                            break;
                        case 1:
                            lib.errMessage($("text.boss.east"), "font-weight: bold", "font-weight: 400");
                            break;
                        case 2:
                            lib.errMessage($("text.boss.south"), "font-weight: bold", "font-weight: 400");
                            break;
                        case 3:
                            lib.errMessage($("text.boss.west"), "font-weight: bold", "font-weight: 400");
                            break;
                    }

                    setTimeout(() => {
                        if(!attack_flag) { // Player get hurt
                            player_heart -= 2;
                            lib.warnMessage($("message.hurt").replace("%s", "2"));
                            updatePanel();
                            if(player_heart <= 0) {
                                this.playerDeath(boss.name);
                            }
                        } else {
                            attack_flag = false;
                        }
                    }, 1000);
                }, 2000);
            }

            function updatePanel() {
                boss_panel.PANEL.style.display = "block";
                boss_panel.P_HEART.innerHTML = player_heart;
                boss_panel.B_HEART.innerHTML = _this.bossHeart;
            }
        }

        /**================================================================================
         * Functions
         * ================================================================================
         */
    
        giveLevel(lvl) {
            this.level += lvl;
            lib.npcSpeak($("npc.system"), $("message.got_level").replace("%s", lvl), "color: lightgreen", "color: white");

            if(this.level == 50) { // Big code mob
                lib.npcSpeak($("npc.system"), $("message.unlock").replace("%s", "50").replace("%e", $("mob.large_code_mob")), "color: lightgreen", "color: white", "font-weight: bold", "font-weight: 400");
            } else if(this.level >= 99) { // BOSS code mob
                lib.npcSpeak($("npc.system"), $("message.unlock").replace("%s", "99").replace("%e", $("mob.super_code_mob")), "color: lightgreen", "color: white", "font-weight: bold", "font-weight: 400");
                
                clearInterval(this.mobSpawner);
                this.bossMission();
            } else if(this.level == 100) { // Game Over
                this.gameOver();
            }

            this.updateInfoPanel();
        }

        giveMoney(money) {
            this.money += money;
            lib.npcSpeak($("npc.system"), $("message.got_money").replace("%s", money), "color: lightblue", "color: white");

            this.updateInfoPanel();
        }
    
        giveWeapon(id) {
            var weapon = lib.getWeapon(id);
            this.weapon = {
                name: weapon.name,
                level: weapon.level,
                att: weapon.att
            };
            lib.npcSpeak($("npc.system"), $("message.got_weapon").replace("%s", weapon.name).replace("%e", weapon.level), "color: yellow", "color: white");

            this.updateInfoPanel();
        }

        spawnMob() {
            var dir = lib.randomMath(1, 4); /* 1 up, 2 left, 3 down, 4 right */
            var id = this.level <= 50 ? lib.randomMath(1, 2) : lib.randomMath(1, 3);
            var mob = lib.getMob(id);

            this.mobs[this.mobs.length] = {dir: dir, id: id, name: mob.name, heart: mob.heart};

            switch(dir) {
                case 1:
                    lib.warnMessage($("text.mob.north").replace("%s", mob.name));
                    break;
                case 2:
                    lib.warnMessage($("text.mob.south").replace("%s", mob.name));
                    break;
                case 3:
                    lib.warnMessage($("text.mob.west").replace("%s", mob.name));
                    break;
                case 4:
                    lib.warnMessage($("text.mob.east").replace("%s", mob.name));
                    break;
            }
        }

        killMobLevel(id) {
            switch(id) {
                case 1:
                    this.giveLevel(0.1);
                    var rm = lib.randomMath(1, 2);
                    if(rm == 2) this.giveMoney(1);
                    break;
                case 2:
                    this.giveLevel(0.3);
                    var rm = lib.randomMath(1, 2);
                    if(rm == 2) this.giveMoney(3);
                    break;
                case 3:
                    this.giveLevel(0.5);
                    var rm = lib.randomMath(1, 2);
                    if(rm == 2) this.giveMoney(5);
                    break;
            }
        }

        updateInfoPanel() {
            document.getElementById("tips").style.display = "none";
            info_panel.PANEL.style.display = "block";

            info_panel.LVL.innerHTML = this.level;
            info_panel.BAL.innerHTML = this.money +"$";
            info_panel.WEAPON.innerHTML = this.weapon.name +"(level "+ this.weapon.level +")";
        }
    }

    /**
     * Run Main Class
     * Print Info in Console
     * 
     * @author NriotHrreion
     */
    new Main();

    /**
     * End Script
     */
})(window)
