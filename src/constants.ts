export class Constants {
    public static get depthHealthBar(): number {return 7;}

    public static get depthTurboParticles(): number {return 3;}

    public static get gamepadIndexSelect (): number {return 0;}  
    public static get gamepadIndexBack (): number {return 1;}   
    public static get gamepadIndexInteract (): number {return 2;}   
    public static get gamepadIndexLeft (): number {return 14;}   
    public static get gamepadIndexRight (): number {return 15;}   
    public static get gamepadIndexUp (): number {return 12;}   
    public static get gamepadIndexDown (): number {return 13;}   
    public static get gamepadIndexPause (): number {return 9;}

    public static get gamepadIndexLB (): number {return 4;}   
    public static get gamepadIndexRB (): number {return 5;}  

    public static get gamepadIndexJump (): number {return 0;}   
    public static get gamepadIndexShoot (): number {return 1;}   
    
    // A 0
    // B 1
    // X 2
    // Y 3
    // LB 4
    // RB 5
    // LT 6
    // RT 7
    // window 8
    // options 9
    // LS 10
    // RS 11
    // up 12
    // down 13
    // left 14
    // right 15

    public static get pickupSpawnTile(): number { return 31; }

    public static get treeObjectTile(): number { return 50; }
    public static get houseObjectTile(): number { return 131; }
    public static get buildingObjectTile(): number { return 132; }
    public static get buildingObjectTile2(): number { return 133; }

    public static get building1ObjectTileSW(): number { return 134; }
    public static get building1ObjectTileSE(): number { return 142; }
    public static get building2ObjectTileSW(): number { return 139; }
    public static get building2ObjectTileSE(): number { return 143; }
    public static get building3ObjectTileSW(): number { return 135; }
    public static get building3ObjectTileSE(): number { return 138; }

    public static get respawnTime(): number { return 180; }

    public static get isometricTileHeight(): number { return 64; }
}