import { Player } from "./player";

export class RaceCarPlayer extends Player
{
    constructor(params){
        super(params);


    }
    
    init() {
        super.init();
    }

    createAnims() {
        var startIndex = 272;

        this.anims.create({
            key: this.animPrefix + '-SSW',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-SW',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-WSW',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-W',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-WNW',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NW',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NNW',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-N',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-NNE',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-NE',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-ENE',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-E',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        this.anims.create({
            key: this.animPrefix + '-ESE',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-SE',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-SSE',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });
        this.anims.create({
            key: this.animPrefix + '-S',
            frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
            frameRate: 10,
        });

        /*
        switch(this.vehicleType){          
            case VehicleType.RaceCar:
                this.animPrefix = "raceCarBlue";
                
                // https://en.wikipedia.org/wiki/Points_of_the_compass

                // 0272 - SSW
                // 0273 - SW
                // 0274 - WSW
                // 0275 - W

                // 0276 - WNW
                // 0277 - NW
                // 0278 - NNW
                // 0279 - N

                // 0280 - NNE
                // 0281 - NE
                // 0282 - ENE
                // 0283 - E

                // 0284 - ESE
                // 0285 - SE
                // 0286 - SSE
                // 0287 - S
                
                var startIndex = 272;

                this.anims.create({
                    key: this.animPrefix + '-SSW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-WSW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-W',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-WNW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NNW',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-N',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-NNE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-ENE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-E',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-ESE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SSE',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-S',
                    frames: [{key: 'blueCars', frame: 'c02_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                break;
            case VehicleType.PickupTruck:
                this.animPrefix = "pickupTruckOrange";
                var startIndex = 161;
               
                this.anims.create({
                    key: this.animPrefix + '-SW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-WSW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-W',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-WNW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NNW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-N',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-NNE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-ENE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-E',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-ESE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SSE',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-S',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });            
                this.anims.create({
                    key: this.animPrefix + '-SSW',
                    frames: [{key: 'orangeCars', frame: 'c11_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });    
                break;
            case VehicleType.Ambulance:
                var sourceFrameKey = "whiteCars";
                this.animPrefix = "vanWhite";
                var startIndex = 129;
                
                this.anims.create({
                    key: this.animPrefix + '-SW',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-WSW',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-W',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-WNW',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NW',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NNW',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-N',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-NNE',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NE',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-ENE',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-E',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-ESE',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SE',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SSE',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-S',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });            
                this.anims.create({
                    key: this.animPrefix + '-SSW',
                    frames: [{key: sourceFrameKey, frame: 'c09_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });    
                break;
            case VehicleType.Taxi:
                var sourceFrameKey = "yellowCars";
                this.animPrefix = "taxiYellow";
                
                var colorString = 'c10'               
                var startIndex = 1;
                                
                this.anims.create({
                    key: this.animPrefix + '-SW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-WSW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-W',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-WNW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NNW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-N',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-NNE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_000' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-ENE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-E',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-ESE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SSE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-S',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });            
                this.anims.create({
                    key: this.animPrefix + '-SSW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });    
                break;      
                
            case VehicleType.Hearse:
                var sourceFrameKey = "blackCars";
                this.animPrefix = "hearseBlack";
                
                var colorString = 'c07'               
                var startIndex = 97;
                                
                this.anims.create({
                    key: this.animPrefix + '-SW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-WSW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-W',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_00' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-WNW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NNW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-N',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-NNE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-NE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-ENE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-E',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });

                this.anims.create({
                    key: this.animPrefix + '-ESE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-SSE',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });
                this.anims.create({
                    key: this.animPrefix + '-S',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });            
                this.anims.create({
                    key: this.animPrefix + '-SSW',
                    frames: [{key: sourceFrameKey, frame: colorString + '_s128_iso_0' + startIndex++}],
                    frameRate: 10,
                });    
                break;     
        }
        */
    }
}