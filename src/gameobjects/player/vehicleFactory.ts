import { Scene } from "phaser";
import { AmbulancePlayer } from "./vehicles/ambulanceplayer";
import { Player, PlayerTeam, VehicleType } from "./player";
import { RaceCarPlayer } from "./vehicles/racecarplayer";
import { TaxiPlayer } from "./vehicles/taxiplayer";
import { PickupTruckPlayer } from "./vehicles/pickuptruckplayer";
import { HearsePlayer } from "./vehicles/hearseplayer";
import { KilldozerPlayer } from "./vehicles/killdozerPlayer";
import { MonsterTruckPlayer } from "./vehicles/monstertruckPlayer";
import { PolicePlayer } from "./vehicles/policePlayer";

export class VehicleFactory {
    constructor() {

    }

    generatePlayer(vehicleType: VehicleType, isCpuPlayer: boolean, playerTeam: PlayerTeam, scene: Scene): Player {

        switch (vehicleType)
        {
            case VehicleType.RaceCar:
                return new RaceCarPlayer({                    
                    scene: scene,
                    drawScale: 0.3,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 200,
                    mapY: 200,
                    //mapX: 10,
                    //mapY: 10,
                    key: "raceCar",
                    frame: 'raceCar-W',
                    playerId: "Speed Demon",
                    vehicleType: vehicleType,
                    playerTeam: playerTeam
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
                    vehicleType: vehicleType,
                    playerTeam: playerTeam
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
                    vehicleType: vehicleType,
                    playerTeam: playerTeam
                });
                break;
            case VehicleType.Ambulance:
                return new AmbulancePlayer({                    
                    scene: scene,
                    drawScale: 0.3,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 100,
                    mapY: 400,
                    key: "ambulance256",
                    frame: 'ambulance256-NW',
                    playerId: "Ambulance",
                    vehicleType: vehicleType,
                    playerTeam: playerTeam
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
                    vehicleType: vehicleType,
                    playerTeam: playerTeam
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
                    vehicleType: vehicleType,
                    playerTeam: playerTeam
                });
                break;
            case VehicleType.MonsterTruck:
                return new MonsterTruckPlayer({                    
                    scene: scene,
                    drawScale: 0.5,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 500,
                    mapY: 600,
                    key: "monstertruck256",
                    frame: 'monstertruck256_W',
                    playerId: "Monster Truck",
                    vehicleType: vehicleType,
                    playerTeam: playerTeam
                });
                break;
            case VehicleType.Police:
                return new PolicePlayer({                    
                    scene: scene,
                    drawScale: 0.3,
                    isCpuPlayer: isCpuPlayer,
                    mapX: 700,
                    mapY: 700,
                    key: "police256",
                    frame: 'police256',
                    playerId: "The Law",
                    vehicleType: vehicleType,
                    playerTeam: playerTeam
                });
                break;
        }
    }
}