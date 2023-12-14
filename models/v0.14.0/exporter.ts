import { TableColumn } from "../../components/TableView/TableColumn.js";
import { type TableView } from "../../components/TableView/TableView.js";
import { makeElement, Maybe } from "../../util.js";
import { Guns, type GunDefinition, type DualGunNarrowing, type SingleGunNarrowing } from "./guns.js";
import { ItemType, FireMode, customImports } from "./imports.js";

type PossibleKeys = keyof GunDefinition |
    keyof (GunDefinition & { readonly fireMode: FireMode.Burst; }) |
    keyof (GunDefinition & { readonly isDual: true; });

class PropertyDesc<V = any> {
    constructor(
        readonly path: [PossibleKeys, ...string[]],
        readonly prettyName: string,
        readonly description: string,
        readonly defaultValue?: V | null,
        readonly config?: {
            readonly readonly?: boolean,
            readonly postProcessor?: (value: V, item?: GunDefinition) => unknown;
        },
    ) { }
}

const properties: Record<string, PropertyDesc> = {
    name: new PropertyDesc(
        ["name"],
        "Name",
        "The weapon's name, as displayed in the HUD",
        null
    ),
    ammoType: new PropertyDesc<string>(
        ["ammoType"],
        "Ammo type",
        "The type of ammo fired by this weapon",
        null,
        {
            postProcessor: ammo => customImports.rawAmmos[ammo].name
        }
    ),
    damage: new PropertyDesc(
        ["ballistics", "damage"],
        "Damage",
        "The amount of damage a single projectile fired from this weapon will inflict, ignoring any multipliers",
        null
    ),
    capacity: new PropertyDesc(
        ["capacity"],
        "Magazine capacity",
        "The largest number of consecutive shots that can be fired without reloading",
        null
    ),
    reloadTime: new PropertyDesc(
        ["reloadTime"],
        "Reload time",
        "The amount of time it takes to perform a reload",
        null
    ),
    fireDelay: new PropertyDesc(
        ["fireDelay"],
        "Firing delay (ms)",
        "The absolute minimum time between two consecutive shots. In the case of burst weapons, this is the time between two shots within a single burst",
        null
    ),
    switchDelay: new PropertyDesc(
        ["switchDelay"],
        "Switch delay (ms)",
        "The time after switching to a weapon during which the weapon will be inoperable. Can be overridden by free switches",
        null
    ),
    obstacleMultiplier: new PropertyDesc(
        ["ballistics", "obstacleMultiplier"],
        "Obstacle multiplier",
        "A number by which the damage of the projectiles fired from this weapon will be multiplied when striking an obstacle",
        null
    ),
    speed: new PropertyDesc(
        ["ballistics", "speed"],
        "Velocity (units/second)",
        "The velocity, in units per second, at which this weapon's projectiles travel",
        null
    ),
    range: new PropertyDesc(
        ["ballistics", "range"],
        "Range (units)",
        "The maximum distance, in units, that this weapon's projectiles can travel before despawning",
        null
    ),
    speedMultiplier: new PropertyDesc(
        ["speedMultiplier"],
        "Active speed penalty",
        "A number by which the player's movement speed is multiplied whenever this weapon is active",
        null
    ),
    recoilMultiplier: new PropertyDesc(
        ["recoilMultiplier"],
        "Firing speed penalty",
        "A number by which the player's movement speed is multiplied whenever this weapon is fired. Does not stack with the active speed penalty",
        null
    ),
    recoilDuration: new PropertyDesc(
        ["recoilDuration"],
        "Firing speed penalty duration (ms)",
        "The amount of time after firing during which the firing speed penalty will be in effect",
        null
    ),
    shotSpread: new PropertyDesc(
        ["shotSpread"],
        "Standing spread",
        "Twice the maximum deviation a projectile fired from this weapon can have when the shooter is standing still",
        null
    ),
    moveSpread: new PropertyDesc(
        ["moveSpread"],
        "Moving spread",
        "Twice the maximum deviation a projectile fired from this weapon can have when the shooter is moving by any amount",
        null
    ),
    bulletCount: new PropertyDesc(
        ["bulletCount"],
        "Projectiles per shot",
        "The amount of projectiles fired per shot",
        1
    ),
    length: new PropertyDesc(
        ["length"],
        "Firearm length",
        "The distance from the player center from which this weapon's projectiles will be spawned",
        null
    ),
    jitterRadius: new PropertyDesc(
        ["jitterRadius"],
        "Jitter radius",
        "The radius of a circle touching and in front of the muzzle within which the weapon's projectiles can spawn",
        0
    ),
    fireMode: new PropertyDesc<FireMode>(
        ["fireMode"],
        "Fire mode",
        "The manner in which this weapon fires",
        null,
        {
            postProcessor: e => FireMode[e]
        }
    ),
    ammoSpawnAmount: new PropertyDesc(
        ["ammoSpawnAmount"],
        "Ammo spawn amount",
        "The amount of ammunition that spawns with this gun when it is dropped",
        0
    ),
    singleReload: new PropertyDesc(
        ["singleReload"],
        "Single reload?",
        "Whether a reload replenishes a single unit of ammunition (the alternative being the weapon's entire capacity)",
        false
    ),
    shotsPerBurst: new PropertyDesc<number>(
        ["burstProperties", "shotsPerBurst"],
        "Shots per burst",
        "How many shots will be fired per burst (aka when the mouse is held)",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || item?.fireMode !== FireMode.Burst) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as (SingleGunNarrowing & { readonly fireMode: FireMode.Burst; }) | undefined)?.burstProperties.shotsPerBurst;
            }
        }
    ),
    burstCooldown: new PropertyDesc<number>(
        ["burstProperties", "burstCooldown"],
        "Burst delay (ms)",
        "The minimum amount of time after the last shot of the previous burst that must pass before a new burst can be fired",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || item?.fireMode !== FireMode.Burst) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as (SingleGunNarrowing & { readonly fireMode: FireMode.Burst; }) | undefined)?.burstProperties.burstCooldown;
            }
        }
    ),
    isDual: new PropertyDesc(
        ["isDual"],
        "Is a dual-wielded weapon?",
        "Whether this specific weapon corresponds tu a dual-wielded item",
        null
    ),
    singleVariant: new PropertyDesc(
        ["singleVariant"],
        "Single variant",
        "The ID string of this weapon's single variant",
        undefined
    ),
    dualVariant: new PropertyDesc(
        ["dualVariant"],
        "Dual variant",
        "The ID string of this weapon's dual variant",
        undefined
    ),
    idString: new PropertyDesc(
        ["idString"],
        "ID string",
        "A string used internally to differentiate this weapon from others",
        null,
        {
            readonly: true
        }
    ),
    itemType: new PropertyDesc<ItemType>(
        ["itemType"],
        "Item type",
        "The type of item this is. Should always be ItemType.Gun",
        null,
        {
            readonly: true,
            postProcessor: val => ItemType[val]
        },
    ),
    noDrop: new PropertyDesc(
        ["noDrop"],
        "Prevent dropping?",
        "If true, then this weapon cannot be dropped",
        false
    ),
    infiniteAmmo: new PropertyDesc(
        ["infiniteAmmo"],
        "Infinite ammo?",
        "Whether this weapon has infinite ammo (and thus never needs to reload)",
        false
    ),
    consistentPatterning: new PropertyDesc(
        ["consistentPatterning"],
        "Consistent patterning?",
        "Whether this weapon's projectiles will be evenly distributed throughout the weapon's spread cone. Only sensible for multi-shot weapons",
        false
    ),
    penetratesPlayers: new PropertyDesc(
        ["ballistics", "penetration", "players"],
        "Penetrates players?",
        "Whether this projectile will despawn when striking a player",
        false
    ),
    penetratesObstacles: new PropertyDesc(
        ["ballistics", "penetration", "obstacles"],
        "Penetrates players?",
        "Whether this projectile will despawn when striking an obstacle",
        false
    ),
    tracerOpacity: new PropertyDesc(
        ["ballistics", "tracer", "opacity"],
        "Tracer opacity",
        "The opacity of the tracers fired by this weapon, specified as a number between 0 and 1",
        1
    ),
    tracerWidth: new PropertyDesc(
        ["ballistics", "tracer", "width"],
        "Tracer width",
        "A number by which the width of this weapon's projectile tracers will be scaled. Does not affect hit detection",
        1
    ),
    tracerLength: new PropertyDesc(
        ["ballistics", "tracer", "length"],
        "Tracer length",
        "A number by which the length of this weapon's projectile tracers will be scaled. Does not affect hit detection",
        1
    ),
    tracerColor: new PropertyDesc(
        ["ballistics", "tracer", "color"],
        "Tracer color",
        "A number specified in hexadecimal format that corresponds to the color the tracer will be tinted. White (0xFFFFFF) corresponds to no tint",
        0xFFFFFF,
        {
            postProcessor: num => `#${num.toString(16).toUpperCase()}`
        }
    ),
    tracerImage: new PropertyDesc(
        ["ballistics", "tracer", "image"],
        "Tracer image",
        "A path to an image to be used for this weapon's projectiles",
        "base_trail"
    ),
    forceMaxTracerLength: new PropertyDesc(
        ["ballistics", "tracer", "forceMaxLength"],
        "Force maximum tracer length",
        "Whether this weapon's tracers should always be drawn at maximum length",
        false
    ),
    rangeVariance: new PropertyDesc(
        ["ballistics", "rangeVariance"],
        "Range variance",
        "Is multiplied by the weapon's maximum range to decide the true maximum range (at random) of a given projectile",
        0
    ),
    shrapnel: new PropertyDesc(
        ["ballistics", "shrapnel"],
        "Is shrapnel?",
        "Whether this projectile can damage its shooter. Projectiles that have reflected off of a surface will always be able to damage their shooter unless this attribute is explicitly set to false",
        false
    ),
    onHitExplosion: new PropertyDesc(
        ["ballistics", "onHitExplosion"],
        "Explosion on hit",
        "The ID string of the explosion to summon when this projectile strikes something or reaches its maximum range",
        undefined
    ),
    goToMouse: new PropertyDesc(
        ["ballistics", "goToMouse"],
        "Go to mouse?",
        "Allows the shooter to customize their projectiles' range, so long as it resides within the normal maximum range",
        false
    ),
    lastShotFX: new PropertyDesc(
        ["ballistics", "lastShotFX"],
        "Play sound on last shot?",
        "Whether this weapon, upon firing its last shot from its magazine, will play a distinct sound alongside its usual firing sound",
        false
    ),
    noQuickswitch: new PropertyDesc(
        ["noQuickswitch"],
        "Disable quickswitch?",
        "Whether this weapon enforces its switch delay (as opposed to it being possibly overridden by a free switch)",
        false
    ),
    killstreak: new PropertyDesc(
        ["killstreak"],
        "Track killstreaks?",
        "Whether this weapon will count the user's kills with it",
        false
    ),
    shootOnRelease: new PropertyDesc(
        ["shootOnRelease"],
        "Release to fire? (mobile-only)",
        "Only applicable on mobile, decides whether the weapon will be fired when the joystick is released (as opposed to when swiped)",
        false
    ),
    summonAirdrop: new PropertyDesc(
        ["summonAirdrop"],
        "Summon airdrop on fire?",
        "Whether this weapon will summon an airdrop at the shooter's position when shot. Calls one airdrop per shot, not per projectile",
        false
    ),
    leftFistZIndex: new PropertyDesc(
        ["fists", "leftZIndex"],
        "Left hand z-index",
        "The z-index of the player's left hand",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.fists.leftZIndex ?? 1;
            }
        }
    ),
    rightFistZIndex: new PropertyDesc(
        ["fists", "rightZIndex"],
        "Right hand z-index",
        "The z-index of the player's right hand",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.fists.rightZIndex ?? 1;
            }
        }
    ),
    animationDuration: new PropertyDesc(
        ["fists", "animationDuration"],
        "Animation duration (ms)",
        "How long it will take for the player's fists to get into their correct position when this weapon is switched to",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.fists.animationDuration;
            }
        }
    ),
    leftX: new PropertyDesc(
        ["fists", "left", "x"],
        "x position of left fist",
        "The x position of the left fist",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.fists.left.x;
            }
        }
    ),
    leftY: new PropertyDesc(
        ["fists", "left", "y"],
        "y position of left fist",
        "The y position of the left fist",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.fists.left.y;
            }
        }
    ),
    rightX: new PropertyDesc(
        ["fists", "right", "x"],
        "x position of right fist",
        "The x position of the right fist",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.fists.right.x;
            }
        }
    ),
    rightY: new PropertyDesc(
        ["fists", "right", "y"],
        "y position of right fist",
        "The y position of the right fist",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.fists.right.y;
            }
        }
    ),
    leftRightOffset: new PropertyDesc(
        ["leftRightOffset"],
        "Left/right offset",
        "An offset used by dual weapons for things such as world image placement, casing spawns and muzzle flash location",
        undefined
    ),
    casingCount: new PropertyDesc(
        ["casingParticles", "count"],
        "Casing count",
        "The number of casings ejected from this weapon every time it ejects",
        1
    ),
    casingSpawnMethod: new PropertyDesc(
        ["casingParticles", "spawnOnReload"],
        "Spawn casings on reload?",
        "Whether casings should spawn when the weapon is reloaded (as opposed to when it is fired)",
        false
    ),
    casingEjectionDelay: new PropertyDesc(
        ["casingParticles", "ejectionDelay"],
        "Casing ejection delay (ms)",
        "The amount of time between a casing's triggering action (either firing or reloading) and the casing actually spawning",
        0
    ),
    casingPositionX: new PropertyDesc(
        ["casingParticles", "position", "x"],
        "x component of casing spawn location",
        "The x position of the point where this weapon spawns its casings",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.casingParticles?.position.x;
            }
        }
    ),
    casingPositionY: new PropertyDesc(
        ["casingParticles", "position", "y"],
        "y component of casing spawn location",
        "The y position of the point where this weapon spawns its casings",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.casingParticles?.position.y;
            }
        }
    ),
    imageX: new PropertyDesc(
        ["image", "position", "x"],
        "World image x position",
        "The x position of this weapon's world image",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.image.position.x;
            }
        }
    ),
    imageY: new PropertyDesc(
        ["image", "position", "y"],
        "World image y position",
        "The y position of this weapon's world image",
        null,
        {
            postProcessor(value, item) {
                if (value !== null || !item?.isDual) return value;

                return (Guns.find(gun => gun.idString == (item as DualGunNarrowing).singleVariant) as SingleGunNarrowing | undefined)?.image.position.y;
            }
        }
    ),
    imageAngle: new PropertyDesc(
        ["image", "position", "angle"],
        "World image angle offset",
        "The angular offset of this weapon's world image",
        0,
        {
            postProcessor: e => `${e}º`
        }
    ),
    noMuzzleFlash: new PropertyDesc(
        ["noMuzzleFlash"],
        "Disable muzzle flash?",
        "Whether this weapon shouldn't show muzzle flashes when firing",
        false
    ),
    "passiveFX::maxHealth": new PropertyDesc(
        ["wearerAttributes", "passive", "maxHealth"],
        "Maximum health (passive effect)",
        "A number by which the maximum health of this weapon's owner will be multiplied whenever this weapon is in their inventory",
        1
    ),
    "passiveFX::maxAdrenaline": new PropertyDesc(
        ["wearerAttributes", "passive", "maxAdrenaline"],
        "Maximum adrenaline (passive effect)",
        "A number by which the maximum adrenaline of this weapon's owner will be multiplied whenever this weapon is in their inventory",
        1
    ),
    "passiveFX::minAdrenaline": new PropertyDesc(
        ["wearerAttributes", "passive", "minAdrenaline"],
        "Minimum adrenaline (passive effect)",
        "Increase the minimum adrenaline of this weapon's owner whenever this weapon is in their inventory by the specified amount",
        0
    ),
    "passiveFX::speedBoost": new PropertyDesc(
        ["wearerAttributes", "passive", "speedBoost"],
        "Speed multiplier (passive effect)",
        "A number by which the movement speed of this weapon's owner will be multiplied whenever this weapon is in their inventory",
        1
    ),
    "activeFX::maxHealth": new PropertyDesc(
        ["wearerAttributes", "active", "maxHealth"],
        "Maximum health (active effect)",
        "A number by which the maximum health of this weapon's owner will be multiplied whenever this weapon is the active one",
        1
    ),
    "activeFX::maxAdrenaline": new PropertyDesc(
        ["wearerAttributes", "active", "maxAdrenaline"],
        "Maximum adrenaline (active effect)",
        "A number by which the maximum adrenaline of this weapon's owner will be multiplied whenever this weapon is the active one",
        1
    ),
    "activeFX::minAdrenaline": new PropertyDesc(
        ["wearerAttributes", "active", "minAdrenaline"],
        "Minimum adrenaline (active effect)",
        "Increase the minimum adrenaline of this weapon's owner whenever this weapon is the active one by the specified amount",
        0
    ),
    "activeFX::speedBoost": new PropertyDesc(
        ["wearerAttributes", "active", "speedBoost"],
        "Speed multiplier (active effect)",
        "A number by which the movement speed of this weapon's owner will be multiplied whenever this weapon is the active one",
        1
    )
};

const columnPropertyMap = new Map<TableColumn<GunDefinition, Maybe<unknown>>, PropertyDesc>(),
    columns = Object.entries(properties).map(([, propertyDesc]) => {
        const column = new TableColumn<GunDefinition, Maybe<unknown>>(
            propertyDesc.prettyName,
            item => {
                let res: any = item;

                for (const key of propertyDesc.path) {
                    if (!(key in res)) {
                        return Maybe.empty();
                    }

                    try {
                        res = res[key];
                    } catch (e: unknown) {
                        return Maybe.empty();
                    }
                }

                return Maybe.from((propertyDesc.config?.postProcessor ?? (e => e))(res, item));
            },
            propertyDesc.description
        );

        columnPropertyMap.set(column, propertyDesc);

        return column;
    }),
    tableCellGenerator = (column: TableColumn<GunDefinition, Maybe<unknown>>, item: GunDefinition) => {
        const value = column.converter(item),
            property = columnPropertyMap.get(column)!,
            props: NonNullable<Parameters<typeof makeElement<"td">>[1]> = value.hasValue
                ? {
                    innerText: String(value)
                }
                : {
                    innerText: String((property.config?.postProcessor ?? (e => e))(property.defaultValue, item)),
                    className: "no-value-wrapper",
                    title: "No value was specified for this attribute; shown here is the default value",
                    style: {
                        textAlign: "unset"
                    }
                };

        return makeElement(
            "td",
            props
        );
    };

export function configureTableView<View extends TableView<GunDefinition> = TableView<GunDefinition>>(tableView: View): View {
    tableView.tableCellGenerator = tableCellGenerator;
    tableView.setColumns(...columns);
    tableView.addAll(...Guns);

    return tableView;
}
