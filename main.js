/**
 * Copyright (c) NriotHrreion 2020
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
import { lib } from "./lib.js";

(function(window) {
    /**
     * Begin Script
     */
    
    "use strict";

    const freezeObj = Object.freeze;
    const freezeFunc = function() {};

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
        W: freezeFunc,
        A: freezeFunc,
        S: freezeFunc,
        D: freezeFunc
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
%c控制台小游戏
The Console Game
%c================
   
%c输入 start 开始游戏.
`,
                "font-weight: bold",
                "font-weight: 300",
                "font-weight: 400"
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
                lib.groupMessage("互动指令", [
                    "start 开始游戏 (一次性指令)",
                    "info 查看信息及状态",
                    "beg_prtc 开启修炼之门 (一次性指令)",
                    "g_main 回到主城"
                ]);
            });
            lib.setCommand("info", () => {
                lib.groupMessage("信息&状态", [
                    "等级: "+ this.game.level,
                    "钱包: "+ this.game.money +"$",
                    "手持武器: "+ this.game.weapon.name +"(level "+ this.game.weapon.level +")"
                ]);
            });

            console.log("Version: "+ version);
        }
    }
    
    /**
     * @private
     * @class
     */
    class Game {

        /** @constructor @summary Game Class Constructor, Game's body (??? */
        constructor() {
            this.isBeginPrtc = false;
            this.space = "begin";
            this.level = 0;
            this.money = 0;
            this.weapon = {
                name: "空",
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
                lib.npcSpeak("系统", "游戏开始! glhf!");
                lib.npcSpeak("向导", "你好, 欢迎来到控制台的世界! 我是你的向导. 现在, 我将为你介绍在下面的游戏中会出现的消息类型:");
                lib.warnMessage("这是警报");
                lib.errMessage("这是危险");
                lib.tips("输入 yes 开始主线任务 输入 help 查看所有互动指令");
                lib.setCommand("yes", () => {this.startMission()});
            } else {
                lib.npcSpeak("系统", "游戏已经开始了...");
            }
        }

        gameOver() {
            if(isGameBegin) {
                isGameBegin = false;

                this.space = "over";

                lib.delCommand("g_main");
            
                clearInterval(this.bossAttack);
                this.overStory();

                lib.tips("如果你想重新开始 请输入 restart");
                lib.setCommand("restart", () => {window.location.reload()});
            }
        }

        playerDeath(by) {
            this.space = "death";
            lib.delCommand("g_main");

            clearInterval(this.mobSpawner);
            console.log("你被 "+ by +" 杀死了");
            lib.tips("输入 respawn 重生并回到主城");

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
            console.log(`
从前有个控制台, 控制台里有座后台城, 后台城中有老比特和小比特两人过着平凡的生活.
而今天却是不平凡的一天......
   
早上, 老比特带着小比特去门口的早点摊买早餐, 忽然听见天上传来一阵机械声, 他们抬头一看, 发现是有人来访问网站了!
他们所在的网站是一个小型博客网站, 平时一般没人访问这个站点, 但是今天却来了一位访客.
这位访客头顶黑帽, 身穿黑衣, 戴着黑色口罩, 高高的鼻梁上架着一副墨镜.
    
"这人怎么这副打扮啊?" "好奇怪的访客!" "真不知道他究竟来干嘛" ....
    
街上的人你一言我一语, 讨论着这个奇怪的人.
    
小比特开始意识到事情的不对劲, 一般来说, 访客都是博客主的朋友、同学或者家人, 而这次来的人却不肯将自己的真面目展现出来, 这真是太可疑了!
    
突然, 一个巨大的代码怪兽从机械声中钻了出来, 它咆哮着, 它要摧毁后台城!!
原来, 这只怪兽是那个黑衣访客召唤出来的, 它头上长着尖尖的犄角, 两颗尖牙闪着寒光, 一双眼睛中透着杀气, 整个天空布满了死的气息.
   
"啊!!!....."
街上的一个人忽地被怪兽抓了起来, 怪兽用它的牙齿撕咬着那个人, 控制台开始大量输出警报:
`);
            lib.warnMessage("有黑客入侵!! 后台正在被侵占!!!")
            console.log(`接着便是更多的人被吃掉....
`);
            lib.npcSpeak("小比特", "这个人真是太可恶了! 我一定要制裁他!");
            lib.npcSpeak("老比特", "别着急, 这只怪兽看着真猛.");
            lib.npcSpeak("小比特", "我一定有办法打倒他的....");
            console.log(`又过了几年.. 原本一派繁荣的后台城变得乌烟瘴气...
`);
        }

        overStory() {
            console.log(`
巨代码怪死了, 后台城恢复了原本的繁荣景象.
是的, 你拯救了整座后台城!!

城中的人们欢呼着, 雀跃着, 庆祝着你的胜利.
而天空中的黑客却说: "可恶! 我还会再来的!"

......
`);
            console.log("%c完", "font-size: 17px; font-weight: bold");
        }

        bossStory() {
            console.log("巨代码怪出现在了你的面前, 你紧握着"+ this.weapon.name +". 这一刻, 你充满了决心!!");
            lib.npcSpeak("小比特", "不! 你不会摧毁后台城的!!!");
            // Chinese to Binary ( you dian chang? 2333
            // Chinese: 你是阻止不了我的!
            lib.npcSpeak("巨代码怪", "111001001011110110100000 111001101001100010101111 111010011001100010111011 111001101010110110100010 111001001011100010001101 111001001011101010000110 111001101000100010010001 111001111001101010000100 00100001");
            console.log("只见, 代码怪扑了上来. 它咆哮着, 嘶吼着. 但是你知道, 你背负着后台城的命运, 你永远也不能认输!");
        }

        /**================================================================================
         * Missions
         * ================================================================================
         */
    
        startMission() {
            lib.delCommand("yes");
            this.startStory();
            lib.tips("你就是小比特, 为了拯救后台城, 你来到了修炼社区, 接下来你准备: 开启漫漫修炼之路 (beg_prtc)");
            lib.setCommand("beg_prtc", () => {
                this.isBeginPrtc = true;
                console.log(`
修炼:

打一个小代码怪升0.3 level, 打一个中代码怪升0.5 level, 打一个大代码怪升1 level, 打完巨型代码怪后结束游戏,
大代码怪将会在你50 level的时候解锁, 巨型代码怪是最终boss, 将在你99 level时解锁.

使用键盘 "W" "A" "S" "D" 键来刷怪.
去副本修炼 (g_prtc) 去主城 (g_main)
`);
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

                lib.groupMessage("[主城] 可进入的传送点", [
                    "副本 (g_prtc)",
                    "商店 (g_shop)"
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
                                lib.npcSpeak("系统", "你攻击了一下怪物 怪物当前血量: "+ this.mobs[i].heart);
                            } else {
                                lib.npcSpeak("系统", "你消灭了一只怪物");
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
                                lib.npcSpeak("系统", "你攻击了一下怪物 怪物当前血量: "+ this.mobs[i].heart);
                            } else {
                                lib.npcSpeak("系统", "你消灭了一只怪物");
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
                                lib.npcSpeak("系统", "你攻击了一下怪物 怪物当前血量: "+ this.mobs[i].heart);
                            } else {
                                lib.npcSpeak("系统", "你消灭了一只怪物");
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
                                lib.npcSpeak("系统", "你攻击了一下怪物 怪物当前血量: "+ this.mobs[i].heart);
                            } else {
                                lib.npcSpeak("系统", "你消灭了一只怪物");
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

                lib.npcSpeak("系统", "你进入了副本");
                lib.npcSpeak("系统", "刷怪前请先点击页面空白处!!!");
                lib.npcSpeak("系统", "开始刷怪");

                lib.delCommand("g_prtc");
                lib.delCommand("g_shop");
                lib.setCommand("g_main", () => {this.mainMission()});
                
                lib.keysListener(prtc_handles);
                
                this.mobSpawner = setInterval(() => {
                    if(this.mobs.length <= 7) {
                        this.spawnMob();
                    } else {
                        this.playerDeath("代码怪");
                    }
                }, 3000);
            }
        }

        shopMission() {
            if(this.space != "shop") {
                this.space = "shop";

                var items = [
                    {name: "符号剑(level 1) | 30$", price: 30, id: 2},
                    {name: "嗜血剑(level 3) | 120$", price: 120, id: 3},
                    {name: "比特剑(level 7) | 270$", price: 270, id: 4},
                    {name: "弯月刃(level 9) | 340$", price: 340, id: 5},
                ];
                var switcher = 0;

                lib.delCommand("g_shop");
                lib.delCommand("g_prtc");
                lib.setCommand("g_main", () => {
                    this.mainMission();
                    lib.delCommand("select");
                    lib.delCommand("buy");
                });

                lib.npcSpeak("系统", "你进入了商店");
                lib.groupMessage("商店货架", function() {
                    var it = [];
                    for(let i in items) {
                        if(items[i].name != "") {
                            it.push(items[i].name);
                        }
                    }
                    return it;
                });
                lib.tips("输入 select 来选择商品, 输入 buy 来购买商品");

                lib.setCommand("select", () => {
                    if(switcher < items.length - 1) {
                        switcher++;
                    } else {
                        switcher = 0;
                    }
                    console.log("你选中了商品 %c"+ items[switcher].name, "color: yellow");
                });
                lib.setCommand("buy", () => {
                    if(items[switcher].price <= this.money) {
                        this.money -= items[switcher].price;
                        this.giveWeapon(items[switcher].id);
                        lib.npcSpeak("商店", "感谢购买! 你的钱包现在还剩 "+ this.money +"$");
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

                lib.npcSpeak("系统", "接下来你将面对强大的巨代码怪, 你可以通过 'W' 'A' 'S' 'D' 来打败它!");
                lib.npcSpeak("系统", "在打怪前需点一下页面空白处!!!!");
                lib.keysListener(boss_handles);

                this.bossAttack = setInterval(() => {
                    var posi = lib.randomMath(0, 3);
                    this.bossPosition = posi;

                    switch(posi) {
                        case 0:
                            lib.errMessage("巨代码怪出现在了 %c北边%c!", "font-weight: bold", "font-weight: 400");
                            break;
                        case 1:
                            lib.errMessage("巨代码怪出现在了 %c东边%c!", "font-weight: bold", "font-weight: 400");
                            break;
                        case 2:
                            lib.errMessage("巨代码怪出现在了 %c南边%c!", "font-weight: bold", "font-weight: 400");
                            break;
                        case 3:
                            lib.errMessage("巨代码怪出现在了 %c西边%c!", "font-weight: bold", "font-weight: 400");
                            break;
                    }

                    setTimeout(() => {
                        if(!attack_flag) { // Player get hurt
                            player_heart -= 2;
                            lib.warnMessage("你受到了 2 点伤害");
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
            lib.npcSpeak("系统", "你获得了 %c经验 * "+ lvl +"%c 可通过指令 info 查询", "color: lightgreen", "color: white");

            if(this.level == 50) { // Big code mob
                lib.npcSpeak("系统", "你的等级达到了 %c50%c, 已解锁 %c大代码怪%c!", "color: lightgreen", "color: white", "font-weight: bold", "font-weight: 400");
            } else if(this.level >= 99) { // BOSS code mob
                lib.npcSpeak("系统", "你的等级达到了 %c99%c, 已解锁最终BOSS %c巨代码怪%c!", "color: lightgreen", "color: white", "font-weight: bold", "font-weight: 400");
                
                clearInterval(this.mobSpawner);
                this.bossMission();
            } else if(this.level == 100) { // Game Over
                this.gameOver();
            }

            this.updateInfoPanel();
        }

        giveMoney(money) {
            this.money += money;
            lib.npcSpeak("系统", "你获得了 %c钱 * "+ money +"%c 可通过指令 info 查询", "color: lightblue", "color: white");

            this.updateInfoPanel();
        }
    
        giveWeapon(id) {
            var weapon = lib.getWeapon(id);
            this.weapon = {
                name: weapon.name,
                level: weapon.level,
                att: weapon.att
            };
            lib.npcSpeak("系统", "你获得了 %c"+ weapon.name +"(level "+ weapon.level +") * 1%c 可通过指令 info 查询", "color: yellow", "color: white");

            this.updateInfoPanel();
        }

        spawnMob() {
            var dir = lib.randomMath(1, 4); /* 1 up, 2 left, 3 down, 4 right */
            var id = this.level <= 50 ? lib.randomMath(1, 2) : lib.randomMath(1, 3);
            var mob = lib.getMob(id);

            this.mobs[this.mobs.length] = {dir: dir, id: id, name: mob.name, heart: mob.heart};

            switch(dir) {
                case 1:
                    lib.warnMessage("在 上面 出现了一只 "+ mob.name +" !");
                    break;
                case 2:
                    lib.warnMessage("在 下面 出现了一只 "+ mob.name +" !");
                    break;
                case 3:
                    lib.warnMessage("在 左面 出现了一只 "+ mob.name +" !");
                    break;
                case 4:
                    lib.warnMessage("在 右面 出现了一只 "+ mob.name +" !");
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
