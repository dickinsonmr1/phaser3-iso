import { Scene } from "phaser";
import { AmbulancePlayer } from "./ambulanceplayer";
import { Player, VehicleType } from "./player";
import { RaceCarPlayer } from "./racecarplayer";
import { TaxiPlayer } from "./taxiplayer";

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
                    key: "blueCars",
                    frame: 'raceCarBlue-W',
                    playerId: "Sideswipe",
                    vehicleType: vehicleType
                });
                break;
            case VehicleType.PickupTruck:
                return new TaxiPlayer({                    
                    scene: scene,
                    drawScale: 0.4,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 0,
                    mapY: 300,
                    key: "orangeCars",
                    frame: 'c11_s128_iso_0',
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
                    playerId: "Work Van",
                    vehicleType: vehicleType
                });
                break;
            case VehicleType.Hearse:
                return new AmbulancePlayer({                    
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
        }
    }
}