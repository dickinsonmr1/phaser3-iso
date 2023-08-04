import { Scene } from "phaser";
import { AmbulancePlayer } from "./ambulanceplayer";
import { Player, VehicleType } from "./player";
import { RaceCarPlayer } from "./racecarplayer";
import { TaxiPlayer } from "./taxiplayer";
import { PickupTruckPlayer } from "./pickuptruckplayer";
import { HearsePlayer } from "./hearseplayer";
import { KilldozerPlayer } from "./killdozerPlayer";

export class VehicleFactory {
    constructor() {

    }

    generatePlayer(vehicleType: VehicleType, isCpuPlayer: boolean, scene: Scene): Player {

        switch (vehicleType)
        {
            case VehicleType.RaceCar:
                return new RaceCarPlayer({
                    
                    scene: scene,
                    drawScale: 0.4,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 200,
                    mapY: 200,
                    //mapX: 10,
                    //mapY: 10,
                    key: "blueCars",
                    frame: 'raceCarBlue-W',
                    playerId: "Speed Demon",
                    vehicleType: vehicleType
                });
                break;
            case VehicleType.Taxi:
                return new TaxiPlayer({                    
                    scene: scene,
                    drawScale: 0.4,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 500,
                    mapY: 500,
                    //mapX: 10,
                    //mapY: 10,
                    key: "yellowCars",
                    frame: 'taxiYellow-W',
                    playerId: "Sideswipe",
                    vehicleType: vehicleType
                });
                break;
            case VehicleType.PickupTruck:
                return new PickupTruckPlayer({                    
                    scene: scene,
                    drawScale: 0.4,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 0,
                    mapY: 300,
                    key: "orangeCars",
                    frame: 'pickupTruckOrange-W',
                    playerId: "Redneck",
                    vehicleType: vehicleType
                });
                break;
            case VehicleType.Ambulance:
                return new AmbulancePlayer({                    
                    scene: scene,
                    drawScale: 0.4,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 100,
                    mapY: 400,
                    key: "whiteCars",
                    frame: 'vanWhite-NW',
                    playerId: "Ambulance",
                    vehicleType: vehicleType
                });
                break;
            case VehicleType.Hearse:
                return new HearsePlayer({                    
                    scene: scene,
                    drawScale: 0.4,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 300,
                    mapY: 50,
                    key: "blackCars",
                    frame: 'hearseBlack-W',
                    playerId: "Undertaker",
                    vehicleType: vehicleType
                });
                break;
            case VehicleType.Killdozer:
                return new KilldozerPlayer({                    
                    scene: scene,
                    drawScale: 0.5,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 500,
                    mapY: 500,
                    key: "killdozer256",
                    frame: 'killdozer_W',
                    playerId: "Killdozer",
                    vehicleType: vehicleType
                });
                break;
        }
    }
}