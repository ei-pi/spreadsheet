import { TableColumn } from "../../components/TableView/TableColumn.js";
import { GunDefinition, Guns } from "./guns.js";
import { type FireMode } from "./imports.js";

const keys: Set<keyof GunDefinition> = new Set();

Guns.map(obj => Object.keys(obj) as (keyof GunDefinition)[]).flat().forEach(keys.add.bind(keys));

const prettyNames: Record<
    keyof GunDefinition |
    keyof (GunDefinition & { readonly fireMode: FireMode.Burst; }) |
    keyof (GunDefinition & { readonly isDual: true; }),
    string
> = {
    idString: "ID string",
    noDrop: "Prevent dropping?",
    name: "Name",
    itemType: "Item type",
    ammoType: "Ammo type",
    ammoSpawnAmount: "Ammo spawn amount",
    capacity: "Magazine capacity",
    reloadTime: "Reload time",
    singleReload: "Single reload?",
    infiniteAmmo: "Infinite ammo?",
    fireDelay: "Firing delay (ms)",
    switchDelay: "Switch delay (ms)",
    speedMultiplier: "Active speed penalty",
    recoilMultiplier: "Firing speed penalty",
    recoilDuration: "Firing speed penalty duration",
    shotSpread: "Standing spread",
    moveSpread: "Moving spread",
    jitterRadius: "Jitter radius",
    consistentPatterning: "Consistent patterning?",
    noQuickswitch: "Disable quickswitch?",
    bulletCount: "Projectiles per shot",
    length: "Firearm length",
    killstreak: "Track killstreaks?",
    shootOnRelease: "Release to fire? (mobile-only)",
    summonAirdrop: "Summon airdrop on fire?",
    fists: "Hand rigging",
    casingParticles: "Ejected casings",
    image: "World image",
    dualVariant: "Dual variant",
    noMuzzleFlash: "Disable muzzle flash?",
    ballistics: "Ballistics",
    fireMode: "Fire mode",
    burstProperties: "Burst-fire properties",
    isDual: "Is a dual-wielded weapon?",
    singleVariant: "Single variant",
    leftRightOffset: "Left/right offset",
    wearerAttributes: "Wearer attributes"
};

const descriptions: Record<keyof typeof prettyNames, string> = {
    idString: "A string used internally to differentiate this weapon from others",
    noDrop: "If true, then this weapon cannot be dropped",
    name: "The weapon's name, as displayed in the HUD",
    itemType: "The type of item this is. Should always be ItemType.Gun",
    ammoType: "The type of ammo fired by this weapon",
    ammoSpawnAmount: "The amount of ammunition that spawns with this gun when it is dropped",
    capacity: "The largest number of consecutive shots that can be fired without reloading",
    reloadTime: "The amount of time it takes to perform a reload",
    singleReload: "Whether a reload replenishes a single unit of ammunition (the alternative being the weapon's entire capacity)",
    infiniteAmmo: "Whether this weapon has infinite ammo (and thus never needs to reload)",
    fireDelay: "The absolute minimum time between two consecutive shots. In the case of burst weapons, this is the time between two shots within a single burst",
    switchDelay: "The time after switching to a weapon during which the weapon will be inoperable. Can be overridden by free switches",
    speedMultiplier: "A number by which the player's movement speed is multiplied whenever this weapon is active",
    recoilMultiplier: "A number by which the player's movement speed is multiplied whenever this weapon is fired. Does not stack with the active speed penalty",
    recoilDuration: "The amount of time after firing during which the firing speed penalty will be in effect",
    shotSpread: "Twice the maximum deviation a projectile fired from this weapon can have when the shooter is standing still",
    moveSpread: "Twice the maximum deviation a projectile fired from this weapon can have when the shooter is moving by any amount",
    jitterRadius: "The radius of a circle touching and in front of the muzzle within which the weapon's projectiles can spawn",
    consistentPatterning: "Whether this weapon's projectiles will be evenly distributed throughout the weapon's spread cone. Only sensible for multi-shot weapons",
    noQuickswitch: "Whether this weapon enforces its switch delay (as opposed to it being possibly overridden by a free switch)",
    bulletCount: "The amount of projectiles fired per shot",
    length: "The distance from the player center from which this weapon's projectiles will be spawned",
    killstreak: "Whether this weapon will count the user's kills with it",
    shootOnRelease: "Only applicable on mobile, decides whether the weapon will be fired when the joystick is released (as opposed to when swiped)",
    summonAirdrop: "Whether this weapon will summon an airdrop at the shooter's position when shot. Calls one airdrop per shot, not per projectile",
    fists: "The position of the shooter's hands when this weapon is active",
    casingParticles: "The way in which casings are (or aren't) ejected from this weapon",
    image: "The position and possibly angle of this weapon's world image",
    dualVariant: "The ID string of this weapon's dual variant",
    noMuzzleFlash: "Whether this weapon shouldn't show muzzle flashes when firing",
    ballistics: "The way in which this weapon's projectiles behave (speed, damage, range, etc)",
    fireMode: "The manner in which this weapon fires",
    burstProperties: "Additional information for burst weaponry",
    isDual: "Whether this specific weapon corresponds tu a dual-wielded item",
    singleVariant: "The ID string of this weapon's single variant",
    leftRightOffset: "An offset used by dual weapons for things such as world image placement, casing spawns and muzzle flash location",
    wearerAttributes: "A collection of effects applied to this weapon's owner according to various conditions"
};

export const columns = [...keys].map(e => TableColumn.fromObjectKey<GunDefinition>(e, prettyNames[e], descriptions[e]));