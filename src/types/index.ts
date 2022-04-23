// Basic Types

export interface IWeapon {
    id: number
    name: string
    level: number
    att: number
}

export interface IMob {
    id: number
    name: string
    heart: number
}

export enum Key {
    W = "w", A = "a", S = "s", D = "d"
}

// Variable Types

export namespace VarTypes {
    export interface AssetsType {
        WEAPONS: IWeapon[]
        MOBS: IMob[]
    }

    export interface KeyboardHandle {
        W: () => void
        D: () => void
        S: () => void
        A: () => void
    }

    export interface Weapon {
        name: string
        level: number
        att: number
    }

    export interface Mob {
        dir: number
        id: number
        name: string
        heart: number
    }
}
