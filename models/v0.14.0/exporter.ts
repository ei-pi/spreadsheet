import { prepareTableView, PropertyDesc, TableView } from "../../components/TableView/TableView.js";
import { makeElement } from "../../util.js";
import { Guns, type GunDefinition, type DualGunNarrowing, type SingleGunNarrowing } from "./guns.js";
import { ItemType, FireMode, customImports, WearerAttributes } from "./imports.js";

const properties: PropertyDesc<GunDefinition>[] = [
    new PropertyDesc(
        ["name"],
        "Name",
        "The weapon's name, as displayed in the HUD",
        null
    ),
    new PropertyDesc<GunDefinition, string>(
        ["ammoType"],
        "Ammo type",
        "The type of ammo fired by this weapon",
        null,
        {
            postProcessor: ammo => customImports.rawAmmos[ammo].name,
            cellGenerator(column, item) {
                const hasCustomColor = item.ammoType in customImports.bulletColors;

                return makeElement(
                    "td",
                    {
                        innerText: String(customImports.rawAmmos[item.ammoType].name),
                        className: hasCustomColor
                            ? "outline-text"
                            : "",
                        style: {
                            backgroundColor: hasCustomColor
                                ? `#${customImports.bulletColors[item.ammoType].toString(16)}`
                                : ""
                        }
                    }
                );
            },
        }
    ),
    new PropertyDesc(
        ["ballistics", "damage"],
        "Damage",
        "The amount of damage a single projectile fired from this weapon will inflict, ignoring any multipliers",
        null
    ),
    new PropertyDesc(
        ["capacity"],
        "Magazine capacity",
        "The largest number of consecutive shots that can be fired without reloading",
        null
    ),
    new PropertyDesc(
        ["reloadTime"],
        "Reload time",
        "The amount of time it takes to perform a reload",
        null
    ),
    new PropertyDesc(
        ["fireDelay"],
        "Firing delay (ms)",
        "The absolute minimum time between two consecutive shots. In the case of burst weapons, this is the time between two shots within a single burst",
        null
    ),
    new PropertyDesc(
        ["switchDelay"],
        "Switch delay (ms)",
        "The time after switching to a weapon during which the weapon will be inoperable. Can be overridden by free switches",
        null
    ),
    new PropertyDesc(
        ["ballistics", "obstacleMultiplier"],
        "Obstacle multiplier",
        "A number by which the damage of the projectiles fired from this weapon will be multiplied when striking an obstacle",
        null
    ),
    new PropertyDesc(
        ["ballistics", "speed"],
        "Velocity (units/ms)",
        "The velocity, in units per millisecond, at which this weapon's projectiles travel",
        null
    ),
    new PropertyDesc(
        ["ballistics", "range"],
        "Range (units)",
        "The maximum distance, in units, that this weapon's projectiles can travel before despawning",
        null
    ),
    new PropertyDesc(
        ["speedMultiplier"],
        "Active speed penalty",
        "A number by which the player's movement speed is multiplied whenever this weapon is active",
        null
    ),
    new PropertyDesc(
        ["recoilMultiplier"],
        "Firing speed penalty",
        "A number by which the player's movement speed is multiplied whenever this weapon is fired. Does not stack with the active speed penalty",
        null
    ),
    new PropertyDesc(
        ["recoilDuration"],
        "Firing speed penalty duration (ms)",
        "The amount of time after firing during which the firing speed penalty will be in effect",
        null
    ),
    new PropertyDesc(
        ["shotSpread"],
        "Standing spread",
        "Twice the maximum deviation a projectile fired from this weapon can have when the shooter is standing still",
        null
    ),
    new PropertyDesc(
        ["moveSpread"],
        "Moving spread",
        "Twice the maximum deviation a projectile fired from this weapon can have when the shooter is moving by any amount",
        null
    ),
    new PropertyDesc(
        ["bulletCount"],
        "Projectiles per shot",
        "The amount of projectiles fired per shot",
        1
    ),
    new PropertyDesc(
        ["length"],
        "Firearm length",
        "The distance from the player center from which this weapon's projectiles will be spawned",
        null
    ),
    new PropertyDesc(
        ["jitterRadius"],
        "Jitter radius",
        "The radius of a circle touching and in front of the muzzle within which the weapon's projectiles can spawn",
        0
    ),
    new PropertyDesc<GunDefinition, FireMode>(
        ["fireMode"],
        "Fire mode",
        "The manner in which this weapon fires",
        null,
        {
            postProcessor: e => FireMode[e]
        }
    ),
    new PropertyDesc(
        ["ammoSpawnAmount"],
        "Ammo spawn amount",
        "The amount of ammunition that spawns with this gun when it is dropped",
        0
    ),
    new PropertyDesc(
        ["singleReload"],
        "Single reload?",
        "Whether a reload replenishes a single unit of ammunition (the alternative being the weapon's entire capacity)",
        false
    ),
    new PropertyDesc<GunDefinition, number>(
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
    new PropertyDesc<GunDefinition, number>(
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
    new PropertyDesc(
        ["isDual"],
        "Is a dual-wielded weapon?",
        "Whether this specific weapon corresponds tu a dual-wielded item",
        null
    ),
    new PropertyDesc(
        ["singleVariant"],
        "Single variant",
        "The ID string of this weapon's single variant",
        undefined
    ),
    new PropertyDesc(
        ["dualVariant"],
        "Dual variant",
        "The ID string of this weapon's dual variant",
        undefined
    ),
    new PropertyDesc(
        ["idString"],
        "ID string",
        "A string used internally to differentiate this weapon from others",
        null,
        {
            readonly: true
        }
    ),
    new PropertyDesc<GunDefinition, ItemType>(
        ["itemType"],
        "Item type",
        "The type of item this is. Should always be ItemType.Gun",
        null,
        {
            readonly: true,
            postProcessor: val => ItemType[val]
        },
    ),
    new PropertyDesc(
        ["noDrop"],
        "Prevent dropping?",
        "If true, then this weapon cannot be dropped",
        false
    ),
    new PropertyDesc(
        ["infiniteAmmo"],
        "Infinite ammo?",
        "Whether this weapon has infinite ammo (and thus never needs to reload)",
        false
    ),
    new PropertyDesc(
        ["consistentPatterning"],
        "Consistent patterning?",
        "Whether this weapon's projectiles will be evenly distributed throughout the weapon's spread cone. Only sensible for multi-shot weapons",
        false
    ),
    new PropertyDesc(
        ["ballistics", "penetration", "players"],
        "Penetrates players?",
        "Whether this projectile will despawn when striking a player",
        false
    ),
    new PropertyDesc(
        ["ballistics", "penetration", "obstacles"],
        "Penetrates players?",
        "Whether this projectile will despawn when striking an obstacle",
        false
    ),
    new PropertyDesc(
        ["ballistics", "tracer", "opacity"],
        "Tracer opacity",
        "The opacity of the tracers fired by this weapon, specified as a number between 0 and 1",
        1
    ),
    new PropertyDesc(
        ["ballistics", "tracer", "width"],
        "Tracer width",
        "A number by which the width of this weapon's projectile tracers will be scaled. Does not affect hit detection",
        1
    ),
    new PropertyDesc(
        ["ballistics", "tracer", "length"],
        "Tracer length",
        "A number by which the length of this weapon's projectile tracers will be scaled. Does not affect hit detection",
        1
    ),
    new PropertyDesc(
        ["ballistics", "tracer", "color"],
        "Tracer color",
        "A number specified in hexadecimal format that corresponds to the color the tracer will be tinted. White (0xFFFFFF) corresponds to no tint",
        0xFFFFFF,
        {
            postProcessor: num => `#${num.toString(16).toUpperCase()}`
        }
    ),
    new PropertyDesc(
        ["ballistics", "tracer", "image"],
        "Tracer image",
        "A path to an image to be used for this weapon's projectiles",
        "base_trail"
    ),
    new PropertyDesc(
        ["ballistics", "tracer", "forceMaxLength"],
        "Force maximum tracer length",
        "Whether this weapon's tracers should always be drawn at maximum length",
        false
    ),
    new PropertyDesc(
        ["ballistics", "rangeVariance"],
        "Range variance",
        "Is multiplied by the weapon's maximum range to decide the true maximum range (at random) of a given projectile",
        0
    ),
    new PropertyDesc(
        ["ballistics", "shrapnel"],
        "Is shrapnel?",
        "Whether this projectile can damage its shooter. Projectiles that have reflected off of a surface will always be able to damage their shooter unless this attribute is explicitly set to false",
        false
    ),
    new PropertyDesc(
        ["ballistics", "onHitExplosion"],
        "Explosion on hit",
        "The ID string of the explosion to summon when this projectile strikes something or reaches its maximum range",
        undefined
    ),
    new PropertyDesc(
        ["ballistics", "goToMouse"],
        "Go to mouse?",
        "Allows the shooter to customize their projectiles' range, so long as it resides within the normal maximum range",
        false
    ),
    new PropertyDesc(
        ["ballistics", "lastShotFX"],
        "Play sound on last shot?",
        "Whether this weapon, upon firing its last shot from its magazine, will play a distinct sound alongside its usual firing sound",
        false
    ),
    new PropertyDesc(
        ["noQuickswitch"],
        "Disable quickswitch?",
        "Whether this weapon enforces its switch delay (as opposed to it being possibly overridden by a free switch)",
        false
    ),
    new PropertyDesc(
        ["killstreak"],
        "Track killstreaks?",
        "Whether this weapon will count the user's kills with it",
        false
    ),
    new PropertyDesc(
        ["shootOnRelease"],
        "Release to fire? (mobile-only)",
        "Only applicable on mobile, decides whether the weapon will be fired when the joystick is released (as opposed to when swiped)",
        false
    ),
    new PropertyDesc(
        ["summonAirdrop"],
        "Summon airdrop on fire?",
        "Whether this weapon will summon an airdrop at the shooter's position when shot. Calls one airdrop per shot, not per projectile",
        false
    ),
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
        ["leftRightOffset"],
        "Left/right offset",
        "An offset used by dual weapons for things such as world image placement, casing spawns and muzzle flash location",
        undefined
    ),
    new PropertyDesc(
        ["casingParticles", "count"],
        "Casing count",
        "The number of casings ejected from this weapon every time it ejects",
        1
    ),
    new PropertyDesc(
        ["casingParticles", "spawnOnReload"],
        "Spawn casings on reload?",
        "Whether casings should spawn when the weapon is reloaded (as opposed to when it is fired)",
        false
    ),
    new PropertyDesc(
        ["casingParticles", "ejectionDelay"],
        "Casing ejection delay (ms)",
        "The amount of time between a casing's triggering action (either firing or reloading) and the casing actually spawning",
        0
    ),
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
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
    new PropertyDesc(
        ["image", "position", "angle"],
        "World image angle offset",
        "The angular offset of this weapon's world image",
        0,
        {
            postProcessor: e => `${e}º`
        }
    ),
    new PropertyDesc(
        ["noMuzzleFlash"],
        "Disable muzzle flash?",
        "Whether this weapon shouldn't show muzzle flashes when firing",
        false
    ),
    new PropertyDesc(
        ["wearerAttributes", "passive"],
        "Passive effects",
        "Effects which are applied whenever this weapon is in a player's inventory",
        null,
        {
            cellGenerator(column, item) {
                const passive = item.wearerAttributes?.passive;
                if (passive == undefined) {
                    return makeElement(
                        "td",
                        {
                            innerText: "null",
                            className: "no-value-wrapper",
                            title: "No value was specified for this attribute; shown here is the default value",
                            style: {
                                textAlign: "unset"
                            }
                        }
                    );
                }

                const table = new TableView<WearerAttributes>();

                prepareTableView<WearerAttributes>(
                    new PropertyDesc(
                        ["maxHealth"],
                        "Maximum health",
                        "A number by which the maximum health of this weapon's owner will be multiplied",
                        1
                    ),
                    new PropertyDesc(
                        ["maxAdrenaline"],
                        "Maximum adrenaline",
                        "A number by which the maximum adrenaline of this weapon's owner will be multiplied",
                        1
                    ),
                    new PropertyDesc(
                        ["minAdrenaline"],
                        "Minimum adrenaline",
                        "Increase the minimum adrenaline of this weapon's owner by the specified amount",
                        0
                    ),
                    new PropertyDesc(
                        ["speedBoost"],
                        "Speed multiplier",
                        "A number by which the movement speed of this weapon's owner will be multiplied",
                        1
                    )
                )(table, passive);

                const cell = makeElement("td");

                table.addToNode(cell);

                return cell;
            },
        }
    ),
    new PropertyDesc(
        ["wearerAttributes", "active"],
        "Active effects",
        "Effects which are applied whenever this weapon is the active one",
        null,
        {
            cellGenerator(column, item) {
                const active = item.wearerAttributes?.active;
                if (active == undefined) {
                    return makeElement(
                        "td",
                        {
                            innerText: "null",
                            className: "no-value-wrapper",
                            title: "No value was specified for this attribute; shown here is the default value",
                            style: {
                                textAlign: "unset"
                            }
                        }
                    );
                }

                const table = new TableView<WearerAttributes>();

                prepareTableView<WearerAttributes>(
                    new PropertyDesc(
                        ["maxHealth"],
                        "Maximum health",
                        "A number by which the maximum health of this weapon's owner will be multiplied",
                        1
                    ),
                    new PropertyDesc(
                        ["maxAdrenaline"],
                        "Maximum adrenaline",
                        "A number by which the maximum adrenaline of this weapon's owner will be multiplied",
                        1
                    ),
                    new PropertyDesc(
                        ["minAdrenaline"],
                        "Minimum adrenaline",
                        "Increase the minimum adrenaline of this weapon's owner by the specified amount",
                        0
                    ),
                    new PropertyDesc(
                        ["speedBoost"],
                        "Speed multiplier",
                        "A number by which the movement speed of this weapon's owner will be multiplied",
                        1
                    )
                )(table, active);

                const cell = makeElement("td");

                table.addToNode(cell);

                return cell;
            },
        }
    ),
    new PropertyDesc(
        ["wearerAttributes", "on", "kill"],
        "On-kill effects",
        "Effects which are applied every time this weapon is used to kill another player",
        null,
        {
            cellGenerator(column, item) {
                const onKill = item.wearerAttributes?.on?.kill;
                if (onKill == undefined) {
                    return makeElement(
                        "td",
                        {
                            innerText: "null",
                            className: "no-value-wrapper",
                            title: "No value was specified for this attribute; shown here is the default value",
                            style: {
                                textAlign: "unset"
                            }
                        }
                    );
                }

                type Attributes = (typeof onKill)[number];
                const table = new TableView<Attributes>();

                prepareTableView<Attributes>(
                    new PropertyDesc(
                        ["limit"],
                        "Limit",
                        "How many times this effect can be applied",
                        Infinity
                    ),
                    new PropertyDesc(
                        ["healthRestored"],
                        "Health restored",
                        "A set amount of health that will be given to the shooter",
                        0
                    ),
                    new PropertyDesc(
                        ["adrenalineRestored"],
                        "Adrenaline restored",
                        "A set amount of adrenaline that will be given to the shooter",
                        0
                    ),
                    new PropertyDesc(
                        ["maxHealth"],
                        "Maximum health",
                        "A number by which the maximum health of this weapon's owner will be multiplied",
                        1
                    ),
                    new PropertyDesc(
                        ["maxAdrenaline"],
                        "Maximum adrenaline",
                        "A number by which the maximum adrenaline of this weapon's owner will be multiplied",
                        1
                    ),
                    new PropertyDesc(
                        ["minAdrenaline"],
                        "Minimum adrenaline",
                        "Increase the minimum adrenaline of this weapon's owner by the specified amount",
                        0
                    ),
                    new PropertyDesc(
                        ["speedBoost"],
                        "Speed multiplier",
                        "A number by which the movement speed of this weapon's owner will be multiplied",
                        1
                    )
                )(table, ...onKill);

                const cell = makeElement("td");

                table.addToNode(cell);

                return cell;
            },
        }
    ),
    new PropertyDesc(
        ["wearerAttributes", "on", "damage"],
        "On-damage effects",
        "Effects which are applied every time this weapon is used to damage another player",
        null,
        {
            cellGenerator(column, item) {
                const onDamage = item.wearerAttributes?.on?.damageDealt;
                if (onDamage == undefined) {
                    return makeElement(
                        "td",
                        {
                            innerText: "null",
                            className: "no-value-wrapper",
                            title: "No value was specified for this attribute; shown here is the default value",
                            style: {
                                textAlign: "unset"
                            }
                        }
                    );
                }

                type Attributes = (typeof onDamage)[number];
                const table = new TableView<Attributes>();

                prepareTableView<Attributes>(
                    new PropertyDesc(
                        ["limit"],
                        "Limit",
                        "How many times this effect can be applied",
                        Infinity
                    ),
                    new PropertyDesc(
                        ["healthRestored"],
                        "Health restored",
                        "A set amount of health that will be given to the shooter",
                        0
                    ),
                    new PropertyDesc(
                        ["adrenalineRestored"],
                        "Adrenaline restored",
                        "A set amount of adrenaline that will be given to the shooter",
                        0
                    ),
                    new PropertyDesc(
                        ["maxHealth"],
                        "Maximum health",
                        "A number by which the maximum health of this weapon's owner will be multiplied",
                        1
                    ),
                    new PropertyDesc(
                        ["maxAdrenaline"],
                        "Maximum adrenaline",
                        "A number by which the maximum adrenaline of this weapon's owner will be multiplied",
                        1
                    ),
                    new PropertyDesc(
                        ["minAdrenaline"],
                        "Minimum adrenaline",
                        "Increase the minimum adrenaline of this weapon's owner by the specified amount",
                        0
                    ),
                    new PropertyDesc(
                        ["speedBoost"],
                        "Speed multiplier",
                        "A number by which the movement speed of this weapon's owner will be multiplied",
                        1
                    )
                )(table, ...onDamage);

                const cell = makeElement("td");

                table.addToNode(cell);

                return cell;
            },
        }
    )
];

const configure = prepareTableView(...properties);
export function configureTableView<View extends TableView<GunDefinition> = TableView<GunDefinition>>(tableView: View): View {
    configure(tableView, ...Guns);
    return tableView;
}