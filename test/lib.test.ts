import { Lib } from "../src/lib";

describe("Lib.js Tests", () => {
    test("Get info of a weapon", () => {
        var weapon = Lib.getWeapon(1);

        expect(weapon).toStrictEqual({
            id: 1,
            name: "铁剑",
            level: 0,
            att: 3
        });
    });

    test("Get info of a mob", () => {
        var mob = Lib.getMob(1);

        expect(mob).toStrictEqual({
            id: 1,
            name: "小代码怪",
            heart: 10
        });
    });
});
