import { Lib, text as $ } from "./lib";
import { VarTypes } from "./types";
import { info_panel, boss_panel } from "./types/vars";
import { NUtils } from "nriot-utils";

const emptyFunc = function() {};
var key_handles: VarTypes.KeyboardHandle = {
    W: emptyFunc,
    A: emptyFunc,
    S: emptyFunc,
    D: emptyFunc
}

export default class Game {
    private isBeginPrtc: boolean;
    private space: string;

    public level: number;
    public money: number;
    public weapon: VarTypes.Weapon;
    /** @todo */
    public armor: object;

    public mobs: VarTypes.Mob[];
    private bossHeart: number;
    private bossPosition: number;

    /** @todo */
    private bossAttack: any;
    private mobSpawner: any;

    public constructor() {
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
        this.bossHeart = Lib.getMob(4).heart;
        this.bossPosition = 0;

        // dev debug
        // window.dev_level = (a) => {this.giveLevel(a)};
        // window.dev_money = (a) => {this.giveMoney(a)};
    }

    /**================================================================================
     * Game Status
     * ================================================================================
     */

    public gameBegin(): void {
        if(!Lib.isGameBegin) {
            Lib.npcSpeak($("npc.system"), $("text.npc1"));
            Lib.npcSpeak($("npc.guide"), $("text.npc2"));
            Lib.warnMessage($("text.npc3"));
            Lib.errMessage($("text.npc4"));
            Lib.tips($("tip.start_game"));
            Lib.setCommand("yes", () => {this.startMission()});
        } else {
            Lib.npcSpeak($("npc.system"), $("text.npc5"));
        }
    }

    private gameOver(): void {
        if(Lib.isGameBegin) {
            Lib.isGameBegin = false;

            this.space = "over";

            Lib.delCommand("g_main");
        
            clearInterval(this.bossAttack);
            this.overStory();

            Lib.tips($("tip.restart"));
            Lib.setCommand("restart", () => {window.location.reload()});
        }
    }

    private playerDeath(by: string): void {
        this.space = "death";
        Lib.delCommand("g_main");

        clearInterval(this.mobSpawner);
        console.log($("message.death").replace("%s", by));
        Lib.tips($("tip.respawn"));

        Lib.setCommand("respawn", () => {
            this.mainMission();
            Lib.delCommand("respawn");
        });
    }

    /**================================================================================
     * Game Stories
     * ================================================================================
     */

    private startStory(): void {
        console.log($("text.plot1"));
        Lib.warnMessage($("text.plot2"))
        console.log($("text.plot3"));
        Lib.npcSpeak($("npc.little_bit"), $("text.npc6"));
        Lib.npcSpeak($("npc.old_bit"), $("text.npc7"));
        Lib.npcSpeak($("npc.little_bit"), $("text.npc8"));
        console.log($("text.plot4"));
    }

    private overStory(): void {
        console.log($("text.plot5"));
        console.log("%c"+ $("text.game_finish"), "font-size: 17px; font-weight: bold");
    }

    private bossStory(): void {
        console.log($("text.plot6").replace("%s", this.weapon.name));
        Lib.npcSpeak($("npc.little_bit"), $("text.npc9"));
        // Chinese to Binary ( you dian chang? 2333
        // Chinese: 你是阻止不了我的!
        Lib.npcSpeak($("mob.super_code_mob"), "111001001011110110100000 111001101001100010101111 111010011001100010111011 111001101010110110100010 111001001011100010001101 111001001011101010000110 111001101000100010010001 111001111001101010000100 00100001");
        console.log($("text.plot7"));
    }

    /**================================================================================
     * Missions
     * ================================================================================
     */

    private startMission(): void {
        Lib.delCommand("yes");
        this.startStory();
        Lib.tips($("tip.beg_prtc"));
        Lib.setCommand("beg_prtc", () => {
            this.isBeginPrtc = true;
            console.log($("command.beg_prtc.explaination"));
            this.giveWeapon(1);
            this.giveLevel(1);
            Lib.setCommand("g_prtc", () => {Lib.delCommand("g_main");this.prtcMission()});
            Lib.setCommand("g_main", () => {Lib.delCommand("g_prtc");this.mainMission()});

            Lib.delCommand("beg_prtc");
        });
    }

    private mainMission(): void {
        if(this.space != "main") {
            this.space = "main";

            this.mobs = [];
            clearInterval(this.mobSpawner);

            Lib.groupMessage($("group.hub"), [
                $("text.g_prtc"),
                $("text.g_shop")
            ]);

            Lib.delCommand("g_main");
            Lib.setCommand("g_prtc", () => {this.prtcMission()});
            Lib.setCommand("g_shop", () => {this.shopMission()});

            Lib.keysListener(key_handles);
        }
    }

    private prtcMission(): void {

        var prtc_handles = {
            
            // up
            W: () => {
                for(let i in this.mobs) {
                    if(this.mobs[i].dir == 1) {
                        this.mobs[i].heart -= this.weapon.att;
                        if(this.mobs[i].heart > 0) {
                            Lib.npcSpeak($("npc.system"), $("message.attack").replace("%s", this.mobs[i].heart.toString()));
                        } else {
                            Lib.npcSpeak($("npc.system"), $("message.kill"));
                            this.killMobLevel(this.mobs[i].id);
                            NUtils.arrayItemDelete(this.mobs, i);
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
                            Lib.npcSpeak($("npc.system"), $("message.attack").replace("%s", this.mobs[i].heart.toString()));
                        } else {
                            Lib.npcSpeak($("npc.system"), $("message.kill"));
                            this.killMobLevel(this.mobs[i].id);
                            NUtils.arrayItemDelete(this.mobs, i);
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
                            Lib.npcSpeak($("npc.system"), $("message.attack").replace("%s", this.mobs[i].heart.toString()));
                        } else {
                            Lib.npcSpeak($("npc.system"), $("message.kill"));
                            this.killMobLevel(this.mobs[i].id);
                            NUtils.arrayItemDelete(this.mobs, i);
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
                            Lib.npcSpeak($("npc.system"), $("message.attack").replace("%s", this.mobs[i].heart.toString()));
                        } else {
                            Lib.npcSpeak($("npc.system"), $("message.kill"));
                            this.killMobLevel(this.mobs[i].id);
                            NUtils.arrayItemDelete(this.mobs, i);
                        }
                        break;
                    }
                }
            }
        };

        if(this.space != "prtc") {
            this.space = "prtc";

            this.mobs = [];

            Lib.npcSpeak($("npc.system"), $("text.npc10"));
            Lib.npcSpeak($("npc.system"), $("text.npc11"));
            Lib.npcSpeak($("npc.system"), $("text.npc12"));

            Lib.delCommand("g_prtc");
            Lib.delCommand("g_shop");
            Lib.setCommand("g_main", () => {this.mainMission()});
            
            Lib.keysListener(prtc_handles);
            
            this.mobSpawner = setInterval(() => {
                if(this.mobs.length <= 7) {
                    this.spawnMob();
                } else {
                    this.playerDeath($("mob.code_mob"));
                }
            }, 3000);
        }
    }

    private shopMission(): void {
        if(this.space != "shop") {
            this.space = "shop";

            var items = [
                {name: $("weapon.symbol") +"(level 1) | 30$", price: 30, id: 2},
                {name: $("weapon.bloodthirsty") +"(level 3) | 120$", price: 120, id: 3},
                {name: $("weapon.bit_sword") +"(level 7) | 270$", price: 270, id: 4},
                {name: $("weapon.meniscus") +"(level 9) | 340$", price: 340, id: 5},
            ];
            var switcher = 0;

            Lib.delCommand("g_shop");
            Lib.delCommand("g_prtc");
            Lib.setCommand("g_main", () => {
                this.mainMission();
                Lib.delCommand("select");
                Lib.delCommand("buy");
            });

            Lib.npcSpeak($("npc.system"), $("text.npc13"));
            Lib.groupMessage($("group.shop"), function() {
                var it = [];
                for(let i in items) {
                    if(items[i].name != "") {
                        it.push(items[i].name);
                    }
                }
                return it;
            });
            Lib.tips($("tip.shop"));

            Lib.setCommand("select", () => {
                if(switcher < items.length - 1) {
                    switcher++;
                } else {
                    switcher = 0;
                }
                console.log($("message.selected").replace("%s", items[switcher].name), "color: yellow");
            });
            Lib.setCommand("buy", () => {
                if(items[switcher].price <= this.money) {
                    this.money -= items[switcher].price;
                    this.giveWeapon(items[switcher].id);
                    Lib.npcSpeak($("npc.shop"), $("message.bought").replace("%s", this.money.toString()));
                } else {
                    Lib.npcSpeak($("npc.shop"), $("message.cant_afford"));
                }
            });
        }
    }

    private bossMission(): void {
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

            var boss = Lib.getMob(4);
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

            Lib.npcSpeak($("npc.system"), $("text.npc14"));
            Lib.npcSpeak($("npc.system"), $("text.npc11"));
            Lib.keysListener(boss_handles);

            this.bossAttack = setInterval(() => {
                var posi = Lib.randomMath(0, 3);
                this.bossPosition = posi;

                switch(posi) {
                    case 0:
                        Lib.errMessage($("text.boss.north"), "font-weight: bold", "font-weight: 400");
                        break;
                    case 1:
                        Lib.errMessage($("text.boss.east"), "font-weight: bold", "font-weight: 400");
                        break;
                    case 2:
                        Lib.errMessage($("text.boss.south"), "font-weight: bold", "font-weight: 400");
                        break;
                    case 3:
                        Lib.errMessage($("text.boss.west"), "font-weight: bold", "font-weight: 400");
                        break;
                }

                setTimeout(() => {
                    if(!attack_flag) { // Player get hurt
                        player_heart -= 2;
                        Lib.warnMessage($("message.hurt").replace("%s", "2"));
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
            boss_panel.P_HEART.innerHTML = player_heart.toString();
            boss_panel.B_HEART.innerHTML = _this.bossHeart.toString();
        }
    }

    /**================================================================================
     * Functions
     * ================================================================================
     */

    private giveLevel(lvl: number): void {
        this.level += lvl;
        Lib.npcSpeak($("npc.system"), $("message.got_level").replace("%s", lvl.toString()), "color: lightgreen", "color: white");

        if(this.level == 50) { // Big code mob
            Lib.npcSpeak($("npc.system"), $("message.unlock").replace("%s", "50").replace("%e", $("mob.large_code_mob")), "color: lightgreen", "color: white", "font-weight: bold", "font-weight: 400");
        } else if(this.level >= 99) { // BOSS code mob
            Lib.npcSpeak($("npc.system"), $("message.unlock").replace("%s", "99").replace("%e", $("mob.super_code_mob")), "color: lightgreen", "color: white", "font-weight: bold", "font-weight: 400");
            
            clearInterval(this.mobSpawner);
            this.bossMission();
        } else if(this.level == 100) { // Game Over
            this.gameOver();
        }

        this.updateInfoPanel();
    }

    private giveMoney(money: number): void {
        this.money += money;
        Lib.npcSpeak($("npc.system"), $("message.got_money").replace("%s", money.toString()), "color: lightblue", "color: white");

        this.updateInfoPanel();
    }

    private giveWeapon(id: number): void {
        var weapon = Lib.getWeapon(id);
        this.weapon = {
            name: weapon.name,
            level: weapon.level,
            att: weapon.att
        };
        Lib.npcSpeak($("npc.system"), $("message.got_weapon").replace("%s", weapon.name).replace("%e", weapon.level.toString()), "color: yellow", "color: white");

        this.updateInfoPanel();
    }

    private spawnMob(): void {
        var dir = Lib.randomMath(1, 4); /* 1 up, 2 left, 3 down, 4 right */
        var id = this.level <= 50 ? Lib.randomMath(1, 2) : Lib.randomMath(1, 3);
        var mob = Lib.getMob(id);

        this.mobs[this.mobs.length] = {dir: dir, id: id, name: mob.name, heart: mob.heart};

        switch(dir) {
            case 1:
                Lib.warnMessage($("text.mob.north").replace("%s", mob.name));
                break;
            case 2:
                Lib.warnMessage($("text.mob.south").replace("%s", mob.name));
                break;
            case 3:
                Lib.warnMessage($("text.mob.west").replace("%s", mob.name));
                break;
            case 4:
                Lib.warnMessage($("text.mob.east").replace("%s", mob.name));
                break;
        }
    }

    private killMobLevel(id: number): void {
        switch(id) {
            case 1:
                this.giveLevel(0.1);
                var rm = Lib.randomMath(1, 2);
                if(rm == 2) this.giveMoney(1);
                break;
            case 2:
                this.giveLevel(0.3);
                var rm = Lib.randomMath(1, 2);
                if(rm == 2) this.giveMoney(3);
                break;
            case 3:
                this.giveLevel(0.5);
                var rm = Lib.randomMath(1, 2);
                if(rm == 2) this.giveMoney(5);
                break;
        }
    }

    public updateInfoPanel(): void {
        document.getElementById("tips").style.display = "none";
        info_panel.PANEL.style.display = "block";

        info_panel.LVL.innerHTML = this.level.toString();
        info_panel.BAL.innerHTML = this.money +"$";
        info_panel.WEAPON.innerHTML = this.weapon.name +"(level "+ this.weapon.level +")";
    }
}
