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
    readonly maxHealth?: number
    readonly maxAdrenaline?: number
    readonly minAdrenaline?: number
    readonly speedBoost?: number
}

export interface BaseBulletDefinition {
    readonly damage: number
    readonly obstacleMultiplier: number
    readonly speed: number
    readonly range: number
    readonly penetration?: {
        readonly players?: boolean
        readonly obstacles?: boolean
    }

    readonly tracer?: {
        readonly opacity?: number
        readonly width?: number
        readonly length?: number
        readonly color?: number
        readonly image?: string
        readonly forceMaxLength?: boolean
    }

    readonly rangeVariance?: number
    readonly shrapnel?: boolean
    readonly onHitExplosion?: ReferenceTo<ExplosionDefinition>
    readonly goToMouse?: boolean
    readonly lastShotFX?: boolean
}

export interface ObjectDefinition {
    readonly idString: string
    readonly name: string
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
    readonly itemType: ItemType
    readonly noDrop?: boolean
    readonly wearerAttributes?: {
        readonly passive?: WearerAttributes
        readonly active?: WearerAttributes
        readonly on?: {
            readonly kill?: Array<{
                readonly limit?: number
                readonly healthRestored?: number
                readonly adrenalineRestored?: number
            } & WearerAttributes>
            readonly damageDealt?: Array<{
                readonly limit?: number
                readonly healthRestored?: number
                readonly adrenalineRestored?: number
            } & WearerAttributes>
        }
    }
}
//////////////////////////////
// end objectDefinitions.ts //
//////////////////////////////

/////////////////////////
// begin explosions.ts //
/////////////////////////
export interface ExplosionDefinition extends ObjectDefinition {
    readonly damage: number
    readonly obstacleMultiplier: number
    readonly radius: {
        readonly min: number
        readonly max: number
    }
    readonly cameraShake: {
        readonly duration: number
        readonly intensity: number
    }
    readonly animation: {
        readonly duration: number
        readonly tint: number
        readonly scale: number
    }
    readonly sound?: string

    readonly shrapnelCount: number
    readonly ballistics: BaseBulletDefinition
    readonly decal?: ReferenceTo<DecalDefinition>
}
///////////////////////
// end explosions.ts //
///////////////////////

/////////////////////
// begin decals.ts //
/////////////////////
export interface DecalDefinition extends ObjectDefinition {
    readonly image?: string
    readonly scale?: number
    readonly rotationMode?: RotationMode // default is Limited
    readonly zIndex?: number
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
    x: number
    y: number
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
    readonly itemType: ItemType.Ammo
    readonly maxStackSize: number
    readonly ephemeral?: boolean
    readonly hideUnlessPresent?: boolean
}
///////////////////
// end ammo.ts //
///////////////////