import { PickupType } from "../pickup";

export class PlayerWeaponInventoryItem {
    ammoCount: integer;
    pickupType: PickupType;

    constructor(pickupType: PickupType, ammoCount: number) {
        this.pickupType = pickupType;
        this.ammoCount = ammoCount;
    }

    weaponFired() {
        if(this.ammoCount > 0)
            this.ammoCount--;
    }
}