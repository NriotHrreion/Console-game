import { Lib, text as $ } from "./lib";
import { version } from "./types/vars";
import Game from "./Game";

export default class Main {
    private game: Game;

    public constructor() {
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

    private init(): void {
        this.game = new Game();
        
        console.clear = undefined;

        Lib.isGameBegin = false;
        Lib.setCommand("start", () => {
            this.game.gameBegin();
            this.game.updateInfoPanel();
            Lib.isGameBegin = true;
        });
        Lib.setCommand("help", () => {
            Lib.groupMessage($("group.commands"), [
                $("command.help.start"),
                $("command.help.info"),
                $("command.help.beg_prtc"),
                $("command.help.g_main")
            ]);
        });
        Lib.setCommand("info", () => {
            Lib.groupMessage($("group.info"), [
                $("command.info.level") +": "+ this.game.level,
                $("command.info.wallet") +": "+ this.game.money +"$",
                $("command.info.current_weapon") +": "+ this.game.weapon.name +"(level "+ this.game.weapon.level +")"
            ]);
        });

        console.log("%cVersion: %c"+ version, "color: yellow", "");
        console.log("%cLanguage detected: %c"+ window.navigator.language, "color: yellow", "");
        console.log("%cGithub: %chttps://github.com/NriotHrreion/Console-game", "color: yellow", "");
    }
}