import { TableColumn } from "../../components/TableView/TableColumn.js";
import { type TableView } from "../../components/TableView/TableView.js";
import { makeElement, Maybe } from "../../util.js";
import { Guns, type GunDefinition } from "./guns.js";
import { ItemType, type FireMode } from "./imports.js";

type PossibleKeys = keyof GunDefinition |
    keyof (GunDefinition & { readonly fireMode: FireMode.Burst; }) |
    keyof (GunDefinition & { readonly isDual: true; });

class PropertyDesc<V = any> {
    constructor(
        readonly path: [PossibleKeys, ...string[]],
        readonly prettyName: string,
        readonly description: string,
        readonly defaultValue?: V | null,
        readonly readonly?: boolean,
        readonly postProcessor?: (value: V) => unknown
    ) { }
}

const properties: Record<string, PropertyDesc> = {
    name: new PropertyDesc(
        ["name"],
        "Name",
        "The weapon's name, as displayed in the HUD",
        null
    ),
    ammoType: new PropertyDesc(
        ["ammoType"],
        "Ammo type",
        "The type of ammo fired by this weapon",
        null
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
    fireMode: new PropertyDesc(
        ["fireMode"],
        "Fire mode",
        "The manner in which this weapon fires",
        undefined
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
    idString: new PropertyDesc(
        ["idString"],
        "ID string",
        "A string used internally to differentiate this weapon from others",
        null,
        true
    ),
    itemType: new PropertyDesc<ItemType>(
        ["itemType"],
        "Item type",
        "The type of item this is. Should always be ItemType.Gun",
        null,
        true,
        val => ItemType[val]
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
        false,
        num => `#${num.toString(16).toUpperCase()}`
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
    fists: new PropertyDesc(
        ["fists"],
        "Hand rigging",
        "The position of the shooter's hands when this weapon is active",
        null
    ),
    casingParticles: new PropertyDesc(
        ["casingParticles"],
        "Ejected casings",
        "The way in which casings are (or aren't) ejected from this weapon",
        undefined
    ),
    image: new PropertyDesc(
        ["image"],
        "World image",
        "The position and possibly angle of this weapon's world image",
        null
    ),
    dualVariant: new PropertyDesc(
        ["dualVariant"],
        "Dual variant",
        "The ID string of this weapon's dual variant",
        undefined
    ),
    noMuzzleFlash: new PropertyDesc(
        ["noMuzzleFlash"],
        "Disable muzzle flash?",
        "Whether this weapon shouldn't show muzzle flashes when firing",
        false
    ),
    burstProperties: new PropertyDesc(
        ["burstProperties"],
        "Burst-fire properties",
        "Additional information for burst weaponry",
        null
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
        false
    ),
    wearerAttributes: new PropertyDesc(
        ["wearerAttributes"],
        "Wearer attributes",
        "A collection of effects applied to this weapon's owner according to various conditions",
        null
    ),
    leftRightOffset: new PropertyDesc(
        ["leftRightOffset"],
        "Left/right offset",
        "An offset used by dual weapons for things such as world image placement, casing spawns and muzzle flash location",
        undefined
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

                return Maybe.from((propertyDesc.postProcessor ?? (e => e))(res));
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
                    innerText: String((property.postProcessor ?? (e => e))(property.defaultValue)),
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
