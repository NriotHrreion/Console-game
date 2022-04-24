import { Lib, text as $ } from "./lib";
import { Weapon, Space, VarTypes, Position } from "./types";
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
    private isBeginPrtc: boolean = false;
    private space: Space = Space.BEGIN;

    public level: number = 0;
    public money: number = 0;
    public weapon: Weapon = Lib.getWeapon(0);
    public armor: VarTypes.ArmorSlot = {
        head: {},
        chest: {},
        boots: {}
    };

    public mobs: VarTypes.Entity[] = [];
    private bossHeart: number = Lib.getMob(4).heart;
    private bossPosition: Position = Position.NORTH;

    private bossAttack: NodeJS.Timer;
    private mobSpawner: NodeJS.Timer;

    /**
     * The constructor is for debugging
     * @constructor
     */
    public constructor() {
        // dev debug
        // globalThis["dev_level"] = (a: number) => {this.giveLevel(a)};
        // globalThis["dev_money"] = (a: number) => {this.giveMoney(a)};
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

            this.space = Space.END;

            Lib.delCommand("g_main");
        
            clearInterval(this.bossAttack);
            this.overStory();

            Lib.tips($("tip.restart"));
            Lib.setCommand("restart", () => {window.location.reload()});
        }
    }

    private playerDeath(by: string): void {
        this.space = Space.DEATH;
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
        // Chinese to Binary
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
        if(this.space != Space.MAIN) {
            this.space = Space.MAIN;

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
                for(let i = 0; i < this.mobs.length; i++) {
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
                for(let i = 0; i < this.mobs.length; i++) {
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
                for(let i = 0; i < this.mobs.length; i++) {
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
                for(let i = 0; i < this.mobs.length; i++) {
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

        if(this.space != Space.PRACTICE) {
            this.space = Space.PRACTICE;

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
        if(this.space != Space.SHOP) {
            this.space = Space.SHOP;

            var items = Lib.getItemList();
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
                if(this.bossPosition == Position.NORTH && this.bossHeart > 0) {
                    this.bossHeart -= (this.weapon.att - 2);
                    attack_flag = true;
                    updatePanel();
                } else if(this.bossPosition == Position.NORTH) {
                    this.gameOver();
                }
            },

            // east
            D: () => {
                if(this.bossPosition == Position.EAST && this.bossHeart > 0) {
                    this.bossHeart -= (this.weapon.att - 2);
                    attack_flag = true;
                    updatePanel();
                } else if(this.bossPosition == Position.EAST) {
                    this.gameOver();
                }
            },

            // south
            S: () => {
                if(this.bossPosition == Position.SOUTH && this.bossHeart > 0) {
                    this.bossHeart -= (this.weapon.att - 2);
                    attack_flag = true;
                    updatePanel();
                } else if(this.bossPosition == Position.SOUTH) {
                    this.gameOver();
                }
            },

            // west
            A: () => {
                if(this.bossPosition == Position.WEST && this.bossHeart > 0) {
                    this.bossHeart -= (this.weapon.att - 2);
                    attack_flag = true;
                    updatePanel();
                } else if(this.bossPosition == Position.WEST) {
                    this.gameOver();
                }
            }
        };
        
        if(this.space != Space.BOSS) {
            this.space = Space.BOSS;

            this.bossStory();

            var boss = Lib.getMob(4);
            var player_heart = 30;

            this.bossPosition = Position.NORTH;

            updatePanel();

            Lib.npcSpeak($("npc.system"), $("text.npc14"));
            Lib.npcSpeak($("npc.system"), $("text.npc11"));
            Lib.keysListener(boss_handles);

            this.bossAttack = setInterval(() => {
                var posi = Lib.randomMath(0, 3);
                this.bossPosition = posi;

                switch(posi) {
                    case 0:
                        Lib.errMessage($("text.boss.north"));
                        break;
                    case 1:
                        Lib.errMessage($("text.boss.east"));
                        break;
                    case 2:
                        Lib.errMessage($("text.boss.south"));
                        break;
                    case 3:
                        Lib.errMessage($("text.boss.west"));
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
        this.weapon = Lib.getWeapon(id);
        Lib.npcSpeak($("npc.system"), $("message.got_weapon").replace("%s", this.weapon.name).replace("%e", this.weapon.level.toString()), "color: yellow", "color: white");

        this.updateInfoPanel();
    }

    private spawnMob(): void {
        var dir = Lib.randomMath(1, 4); /* 1 up, 2 left, 3 down, 4 right */
        var id = this.level <= 50 ? Lib.randomMath(1, 2) : Lib.randomMath(1, 3);
        var mob = Lib.getMob(id);
        var entity: VarTypes.Entity = {dir, id, name: mob.name, heart: mob.heart};

        this.mobs.push(entity);

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
