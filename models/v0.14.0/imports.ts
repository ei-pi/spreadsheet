/*
    This file is dedicated to importing all the code needed for the gun definition
    file to work. They have been copied in from the relevant file in the original project,
    with the only alteration to them being the removal of all comments.
*/

////////////////////////
// begin constants.ts //
////////////////////////
export enum FireMode {
    Single,
    Burst,
    Auto
}
//////////////////////
// end constants.ts //
//////////////////////

///////////////////
// begin misc.ts //
///////////////////
export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export function isObject(item: unknown): item is Record<string, unknown> {
    return (item && typeof item === "object" && !Array.isArray(item)) as boolean;
}

export function mergeDeep<T extends object>(target: T, ...sources: Array<DeepPartial<T>>): T {
    if (!sources.length) return target;

    const [source, ...rest] = sources;

    for (const _key in source) {
        const key: keyof T = _key;

        const [sourceProp, targetProp] = [source[key], target[key]];
        if (isObject(targetProp)) {
            mergeDeep(targetProp, sourceProp as DeepPartial<T[keyof T] & object>);
            continue;
        }

        target[key] = sourceProp as T[keyof T];
    }

    return mergeDeep(target, ...rest);
}
/////////////////
// end misc.ts //
/////////////////

////////////////////////////////
// begin objectDefinitions.ts //
////////////////////////////////
export type ReferenceTo<T extends ObjectDefinition = ObjectDefinition> = T["idString"];

export interface WearerAttributes {
    readonly maxHealth?: number;
    readonly maxAdrenaline?: number;
    readonly minAdrenaline?: number;
    readonly speedBoost?: number;
}

export interface BaseBulletDefinition {
    readonly damage: number;
    readonly obstacleMultiplier: number;
    readonly speed: number;
    readonly range: number;
    readonly penetration?: {
        readonly players?: boolean;
        readonly obstacles?: boolean;
    };

    readonly tracer?: {
        readonly opacity?: number;
        readonly width?: number;
        readonly length?: number;
        readonly color?: number;
        readonly image?: string;
        readonly forceMaxLength?: boolean;
    };

    readonly rangeVariance?: number;
    readonly shrapnel?: boolean;
    readonly onHitExplosion?: ReferenceTo<ExplosionDefinition>;
    readonly goToMouse?: boolean;
    readonly lastShotFX?: boolean;
}

export interface ObjectDefinition {
    readonly idString: string;
    readonly name: string;
}

export enum ItemType {
    None,
    Gun,
    Ammo,
    Melee,
    Healing,
    Armor,
    Backpack,
    Scope,
    Skin
}

export interface ItemDefinition extends ObjectDefinition {
    readonly itemType: ItemType;
    readonly noDrop?: boolean;
    readonly wearerAttributes?: {
        readonly passive?: WearerAttributes;
        readonly active?: WearerAttributes;
        readonly on?: {
            readonly kill?: Array<{
                readonly limit?: number;
                readonly healthRestored?: number;
                readonly adrenalineRestored?: number;
            } & WearerAttributes>;
            readonly damageDealt?: Array<{
                readonly limit?: number;
                readonly healthRestored?: number;
                readonly adrenalineRestored?: number;
            } & WearerAttributes>;
        };
    };
}
//////////////////////////////
// end objectDefinitions.ts //
//////////////////////////////

/////////////////////////
// begin explosions.ts //
/////////////////////////
export interface ExplosionDefinition extends ObjectDefinition {
    readonly damage: number;
    readonly obstacleMultiplier: number;
    readonly radius: {
        readonly min: number;
        readonly max: number;
    };
    readonly cameraShake: {
        readonly duration: number;
        readonly intensity: number;
    };
    readonly animation: {
        readonly duration: number;
        readonly tint: number;
        readonly scale: number;
    };
    readonly sound?: string;

    readonly shrapnelCount: number;
    readonly ballistics: BaseBulletDefinition;
    readonly decal?: ReferenceTo<DecalDefinition>;
}
///////////////////////
// end explosions.ts //
///////////////////////

/////////////////////
// begin decals.ts //
/////////////////////
export interface DecalDefinition extends ObjectDefinition {
    readonly image?: string;
    readonly scale?: number;
    readonly rotationMode?: RotationMode; // default is Limited
    readonly zIndex?: number;
}
///////////////////
// end decals.ts //
///////////////////

////////////////////////
// begin obstacles.ts //
////////////////////////
export enum RotationMode {
    Full,
    Limited,
    Binary,
    None
}
//////////////////////
// end obstacles.ts //
//////////////////////

/////////////////////
// begin vector.ts //
/////////////////////
export interface Vector {
    x: number;
    y: number;
}

export function v(x: number, y: number): Vector {
    return { x, y };
}
///////////////////
// end vector.ts //
///////////////////

///////////////////
// begin ammo.ts //
///////////////////
export interface AmmoDefinition extends ItemDefinition {
    readonly itemType: ItemType.Ammo;
    readonly maxStackSize: number;
    readonly ephemeral?: boolean;
    readonly hideUnlessPresent?: boolean;
}

/////////////////
// end ammo.ts //
/////////////////

//////////////////////////
// begin custom imports //
//////////////////////////

export const customImports: {
    readonly rawAmmos: Record<string, AmmoDefinition>,
    readonly bulletColors: Record<string, number>
} = Object.freeze({
    // Unwrapped from its ObjectDefinitions instance to avoid having to port that class over
    // and converted to use idStrings as keys
    rawAmmos: {
        "12g": {
            idString: "12g",
            name: "12 gauge",
            itemType: ItemType.Ammo,
            maxStackSize: 20
        },
        "556mm": {
            idString: "556mm",
            name: "5.56mm",
            itemType: ItemType.Ammo,
            maxStackSize: 60
        },
        "762mm": {
            idString: "762mm",
            name: "7.62mm",
            itemType: ItemType.Ammo,
            maxStackSize: 60
        },
        "9mm": {
            idString: "9mm",
            name: "9mm",
            itemType: ItemType.Ammo,
            maxStackSize: 90
        },
        "127mm": {
            idString: "127mm",
            name: "12.7mm",
            itemType: ItemType.Ammo,
            maxStackSize: 10,
            hideUnlessPresent: true
        },
        "curadell": {
            idString: "curadell",
            name: "Curadell",
            itemType: ItemType.Ammo,
            maxStackSize: 10,
            hideUnlessPresent: true
        },
        /* "50ae": {
            idString: "50ae",
            name: ".50 AE",
            itemType: ItemType.Ammo
        }, */

        // Ephemeral ammo types below

        "power_cell": {
            idString: "power_cell",
            name: "P.O.W.E.R. cell",
            itemType: ItemType.Ammo,
            maxStackSize: 10,
            ephemeral: true
        },
        "bb": {
            idString: "bb",
            name: "6mm BB",
            itemType: ItemType.Ammo,
            maxStackSize: 240,
            ephemeral: true
        }
    },
    // cherry-picked from common::bullets.ts
    bulletColors: {
        "9mm": 0xffff80,
        "12g": 0xffc8c8,
        "556mm": 0x80ff80,
        "762mm": 0x80ffff,
        "127mm": 0x408000,
        shrapnel: 0x1d1d1d
    }
});

////////////////////////
// end custom imports //
////////////////////////