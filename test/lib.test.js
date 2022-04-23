import { Lib } from "../src/lib";

describe("Lib.js Tests", () => {
    var lib = new Lib();
    
    test("Get a random number", () => {
        var num = lib.randomMath(0, 10000);

        expect(num).toBeLessThan(10000);
        expect(num).toBeGreaterThan(0);
    });

    test("Get info of a weapon", () => {
        var weapon = lib.getWeapon(1);

        expect(weapon).toStrictEqual({
            id: 1,
            name: "铁剑",
            level: 0,
            att: 3
        });
    });
});
