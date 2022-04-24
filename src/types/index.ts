// Basic Types

export interface Weapon {
    id: number
    name: string
    level: number
    att: number
}

export interface Armor {
    /** @todo */
}

export interface Mob {
    id: number
    name: string
    heart: number
}

export interface Item {
    name: string
    price: number
    id: number
}

export enum Key {
    W = "w", A = "a", S = "s", D = "d"
}

export enum Space {
    // The beginning of the whole game
    BEGIN = "begin",
    // The ending of the whole game
    END = "end",
    // Player death
    DEATH = "death",
    // The hub of the other spaces (The player can go to the other spaces by it)
    MAIN = "main",
    // The practice area (The player can kill mob and earn money in it)
    PRACTICE = "prtc",
    // The weapon shop (The player can buy something better in it)
    SHOP = "shop",
    // The boss part of the game (After the boss died, the player will be teleported to "END" space)
    BOSS = "boss"
}

export enum Position {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3
}

export enum ArmorKind {
    HEAD, CHEST, BOOTS
}

// Variable Types

export namespace VarTypes {
    export interface AssetsType {
        WEAPONS: Weapon[]
        MOBS: Mob[]
        ITEMS: Item[]
    }

    export interface KeyboardHandle {
        W: () => void
        D: () => void
        S: () => void
        A: () => void
    }

    export interface Entity extends Mob {
        dir: number
    }

    export interface ArmorSlot {
        head: Armor
        chest: Armor
        boots: Armor
    }
}
