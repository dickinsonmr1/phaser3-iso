import { use } from 'matter';
import * as Phaser from 'phaser';

export enum LocationOnMenuPage {
    CenterScreen,
    NextToMenuItem
}

/*
export enum MenuItemType {
    MenuItem,
    MenuLinkItem,
    StartGameMenuItem,
    UnpauseGameMenuItem,
    ReturnToTitleMenuItem,    
    ComplexMenuItem,
}
*/

export class MenuPage {
    title: Phaser.GameObjects.Text;
    subtitle: Phaser.GameObjects.Text;
    footer: Phaser.GameObjects.Text;
    footer2: Phaser.GameObjects.Text;
    marker: Phaser.GameObjects.Text;    
    subItemMarkerLeft: Phaser.GameObjects.Text;        
    subItemMarkerRight: Phaser.GameObjects.Text;    
    items: Array<Phaser.GameObjects.Text>;
    selectedItemIndex: integer;
    backMenu: MenuPage;
    menuIndex: number;

    statsTitle: Phaser.GameObjects.Text;
    stat1Text: Phaser.GameObjects.Text;
    stat2Text: Phaser.GameObjects.Text;
    stat3Text: Phaser.GameObjects.Text;

    titleIcon: Phaser.GameObjects.Image;

    menuStartX: number;
    menuStartY: number;

    titleOffsetX(): number {return 0;}
    subtitleOffsetY(): number {return 150;}

    highlightedColor(): string {return "rgb(255,255,255)"};
    nonHighlightedColor(): string {return "rgb(150,150,150)"};

    fontFamily(): string {return "Franklin Gothic"};
    align(): string {return "center"};

    fontStrokeColor(): string {return "rgb(0,0,0)" }
    fontStrokeThickness(): number {return 10};
    fontStrokeThicknessSmallText(): number {return 8};

    titleStartX: number;
    titleStartY: number;
    footerStartX: number;
    footerStartY: number;
    footer2StartY: number;

    titleFontSize(): number {return 72;}
    subtitleFontSize(): number {return 48;}
    menuItemFontSize(): number {return 40;}
    footerFontSize(): number {return 32;}

    markerOffsetX(): number {return -300;}
    menuItemDistanceY(): number {return 60;}

    iconOffsetX(): number {return -200;}

    useAudio: boolean = false;

    constructor(scene: Phaser.Scene, useAudio: boolean) {        
        this.items = new Array<MenuItem>();
        this.selectedItemIndex = 0;

        this.titleStartX = scene.game.canvas.width / 2;
        this.titleStartY = scene.game.canvas.height * 0.2;

        this.menuStartX = scene.game.canvas.width / 2;
        this.menuStartY = scene.game.canvas.height * 0.6; //0.667;
        
        this.footerStartX = scene.game.canvas.width / 2;
        this.footerStartY = scene.game.canvas.height - scene.game.canvas.height / 16;
        this.footer2StartY = scene.game.canvas.height - scene.game.canvas.height / 32;

        this.useAudio = useAudio;
    }

    addMenuItem(scene: Phaser.Scene, text: string) {              
        var temp = new MenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: this.fontFamily(),
                align: this.align(),            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        temp.setOrigin(0.5, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    addMenuLinkItem(scene: Phaser.Scene, text: string, menuDestinationLink: MenuPage) {              
        var temp = new MenuLinkItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            menuDestinationLink: menuDestinationLink,
            style: {
                fontFamily: this.fontFamily(),
                align:  this.align(),            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        temp.setOrigin(0.5, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }
    
    addStartGameMenuItem(scene: Phaser.Scene, text: string) {              
        var temp = new StartGameMenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: this.fontFamily(),
                align:  this.align(),            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        temp.setOrigin(0.5, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    addUnpauseGameMenuItem(scene: Phaser.Scene, text: string) {              
        var temp = new UnpauseGameMenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: this.fontFamily(),
                align:  this.align(),            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        temp.setOrigin(0.5, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    addReturnToTitleMenuItem(scene: Phaser.Scene, text: string) {              
        var temp = new ReturnToTitleMenuItem({
            scene: scene,
            x: this.menuStartX,
            y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
            text: text,
            style: {
                fontFamily: this.fontFamily(),
                align:  this.align(),            
                color: this.nonHighlightedColor(),
            }});
        temp.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        temp.setOrigin(0.5, 0.5);
        temp.setFontSize(this.menuItemFontSize());

        scene.add.existing(temp);
        this.items.push(temp);

        this.refreshColorsAndMarker();        
    }

    /*
        addStartMultiplayerGameMenuItem(scene: Phaser.Scene, text: string) {              
            var temp = new StartMultiplayerGameMenuItem({
                scene: scene,
                x: this.menuStartX,
                y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
                text: text,
                style: {
                    fontFamily: this.fontFamily(),
                    align:  this.align(),            
                    color: this.nonHighlightedColor(),
                }});
            temp.setStroke('rgb(0,0,0)', 16);
            temp.setOrigin(0, 0.5);
            temp.setFontSize(this.menuItemFontSize());

            scene.add.existing(temp);
            this.items.push(temp);

            this.refreshColorsAndMarker();        
        }
        
        
        addContinueGameMenuItem(scene: Phaser.Scene, text: string) {              
            var temp = new ContinueGameMenuItem({
                scene: scene,
                x: this.menuStartX,
                y: this.menuStartY + this.menuItemDistanceY() * this.items.length,
                text: text,
                style: {
                    fontFamily: this.fontFamily(),
                    align:  this.align(),            
                    color: this.nonHighlightedColor(),
                }});
            temp.setStroke('rgb(0,0,0)', 16);
            temp.setOrigin(0, 0.5);
            temp.setFontSize(this.menuItemFontSize());

            scene.add.existing(temp);
            this.items.push(temp);

            this.refreshColorsAndMarker();        
        }
    */

    addMenuComplexItem(scene: Phaser.Scene, text: string, subItems: Array<MenuKeyValueMapping>): ComplexMenuItem {

        let menuItemStartX = this.menuStartX;
        let menuItemStartY = this.menuStartY + this.menuItemDistanceY() * this.items.length;
        
        var newComplexMenuPageItem = new ComplexMenuItem({
            scene: scene,
            x: menuItemStartX,
            y: menuItemStartY,
            text: text,
            style: {
                fontFamily: this.fontFamily(),
                align: this.align(),            
                color: this.nonHighlightedColor(),
            },
            subItems});
        newComplexMenuPageItem.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        newComplexMenuPageItem.setOrigin(0.5, 0.5);
        newComplexMenuPageItem.setFontSize(this.menuItemFontSize());

        scene.add.existing(newComplexMenuPageItem);
        this.items.push(newComplexMenuPageItem);

        this.refreshColorsAndMarker();   
        
        return newComplexMenuPageItem;
    }

    addMenuComplexItemWithSprites(scene: Phaser.Scene, text: string, iconMappings: Array<IconValueMapping>, iconLocationOnMenu: LocationOnMenuPage, displayCategoryText: boolean = true): ComplexMenuItem  {

        let menuItemStartX = this.menuStartX;
        let menuItemStartY = this.menuStartY + this.menuItemDistanceY() * this.items.length;
        let iconStartX = this.menuStartX;
        let iconStartY = this.menuStartY - 150;

        if(iconLocationOnMenu == LocationOnMenuPage.NextToMenuItem) {
            menuItemStartX = this.menuStartX;
            menuItemStartY = this.menuStartY + this.menuItemDistanceY() * this.items.length;
            iconStartX = menuItemStartX + this.iconOffsetX();
            iconStartY = menuItemStartY;
        }

        var newComplexMenuPageItem = new ComplexMenuItem({
            scene: scene,
            x: menuItemStartX,
            y: menuItemStartY,
            text: text,
            style: {
                //fontFamily: 'KenneyRocketSquare',
                fontFamily: this.fontFamily(),
                align: this.align(),            
                color: this.nonHighlightedColor(),
            },
            subItems: iconMappings});
        newComplexMenuPageItem.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        newComplexMenuPageItem.setOrigin(0.5, 0.5);
        newComplexMenuPageItem.setFontSize(this.menuItemFontSize());
        if(iconMappings.length > 0 && iconMappings[0].description != null && iconMappings[0].key != null) {
            newComplexMenuPageItem.setIcon(scene, iconMappings[0].key,
                iconStartX,
                iconStartY,
                iconMappings[0].scale, iconMappings[0].color);
        }

        scene.add.existing(newComplexMenuPageItem);
        this.items.push(newComplexMenuPageItem);

        this.refreshColorsAndMarker();     
        
        //this.refreshStats(temp.subItems[temp.selectedSubItemIndex]);   

        return newComplexMenuPageItem;
    }

    setBackMenu(scene: Phaser.Scene, backMenu: MenuPage) {
        this.backMenu = backMenu;
    }

    overrideStartY(startY: number) {
        this.menuStartY = startY;
    }

    setMenuIndex(index: number){
        this.menuIndex = index;
    }

    setTitle(scene: Phaser.Scene, text: string) {
        this.title = scene.add.text(this.titleStartX + this.titleOffsetX(), this.titleStartY, text,
        {
            fontFamily: this.fontFamily(),
            align: 'center',            
            color: "rgb(255,255,255)",
        });
        this.title.setOrigin(0.5, 0.5);
        this.title.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        this.title.setFontSize(this.titleFontSize());
    }

    setSubtitle(scene: Phaser.Scene, text: string) {
        this.subtitle = scene.add.text(this.titleStartX + this.titleOffsetX(), this.titleStartY + this.subtitleOffsetY(), text,
        {
            fontFamily: this.fontFamily(),
            align: 'center',            
            color: "rgb(255,255,255)",
        });
        this.subtitle.setOrigin(0.5, 0.5);
        this.subtitle.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        this.subtitle.setFontSize(this.subtitleFontSize());
    }

    setTitleIcon(scene: Phaser.Scene, texture: string, frame: string, scale: number) {
        this.titleIcon = scene.add.image(this.titleStartX - this.title.width / 2 - 100, this.titleStartY, texture, frame);
        this.titleIcon.setOrigin(0.5, 0.5);
        this.titleIcon.setScale(scale, scale);
        
        this.titleIcon.setDepth(1);
    }

    setFooter(scene: Phaser.Scene, text: string) {
        this.footer = scene.add.text(this.footerStartX, this.footerStartY, text,
        {
            fontFamily: this.fontFamily(),
            align: this.align(),            
            color:"rgb(255,255,255)",
        });
        this.footer.setOrigin(0.5, 0.5);
        this.footer.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        this.footer.setFontSize(this.footerFontSize());
    }

    setFooter2(scene: Phaser.Scene, text: string) {
        this.footer2 = scene.add.text(this.footerStartX, this.footer2StartY, text,
        {
            fontFamily: this.fontFamily(),
            fontSize: this.footerFontSize().toString(),
            align: this.align(),            
            color:"rgb(255,255,255)",
        });
        this.footer2.setOrigin(0.5, 0.5);
        this.footer2.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        this.footer2.setFontSize(this.footerFontSize());
    }

    setInitialStats(scene: Phaser.Scene, complexMenuItem: ComplexMenuItem) {
        this.stat1Text = scene.add.text(scene.game.canvas.width * 0.75, scene.game.canvas.height * 0.5, "stat1",
        {
            fontFamily: this.fontFamily(),
            fontSize: this.footerFontSize().toString(),
            align: this.align(),            
            color:"rgb(255,255,255)",
        });
        this.stat1Text.setOrigin(0, 0.5);
        this.stat1Text.setStroke(this.fontStrokeColor(), this.fontStrokeThicknessSmallText());
        this.stat1Text.setFontSize(this.footerFontSize());

        this.stat2Text = scene.add.text(scene.game.canvas.width * 0.75, scene.game.canvas.height * 0.5 + 50, "stat2",
        {
            fontFamily: this.fontFamily(),
            fontSize: this.footerFontSize().toString(),
            align: this.align(),            
            color:"rgb(255,255,255)",
        });
        this.stat2Text.setOrigin(0, 0.5);
        this.stat2Text.setStroke(this.fontStrokeColor(), this.fontStrokeThicknessSmallText());
        this.stat2Text.setFontSize(this.footerFontSize());

        this.stat3Text = scene.add.text(scene.game.canvas.width * 0.75, scene.game.canvas.height * 0.5 + 100, "stat3",
        {
            fontFamily: this.fontFamily(),
            fontSize: this.footerFontSize().toString(),
            align: this.align(),            
            color:"rgb(255,255,255)",
        });
        this.stat3Text.setOrigin(0, 0.5);
        this.stat3Text.setStroke(this.fontStrokeColor(), this.fontStrokeThicknessSmallText());
        this.stat3Text.setFontSize(this.footerFontSize());

        this.refreshStats(complexMenuItem.subItems[complexMenuItem.selectedSubItemIndex]);
    }

    refreshStats(subItem: IconValueMapping) {

        if(subItem.armorRating != null)
            this.stat1Text.setText("Armor:   " + this.ratingToDots(subItem.armorRating));

        if(subItem.speedRating != null)
            this.stat2Text.setText("Speed:  " + this.ratingToDots(subItem.speedRating));
        
        if(subItem.specialRating != null && subItem.specialDescription != null)
            this.stat3Text.setText("Special: " + this.ratingToDots(subItem.specialRating) + "(" + subItem.specialDescription + ")" );        
    }

    setMarker(scene: Phaser.Scene, text: string) {
        this.marker = scene.add.text(this.menuStartX + this.markerOffsetX(), this.menuStartY, text,
        {
            fontFamily: this.fontFamily(),
            align: this.align(),            
            color:"rgb(255,255,255)",
        });
        this.marker.setOrigin(0.5, 0.5);
        this.marker.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        this.marker.setFontSize(this.menuItemFontSize());
        this.marker.setVisible(false);
        
        this.subItemMarkerLeft = scene.add.text(this.menuStartX + this.markerOffsetX(), this.menuStartY, "<<",
        {
            fontFamily: this.fontFamily(),
            fontSize: 64,
            align: this.align(),            
            color:"rgb(255,255,255)",
        });
        this.subItemMarkerLeft.setOrigin(0.5, 0.5);
        this.subItemMarkerLeft.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        this.subItemMarkerLeft.setFontSize(this.menuItemFontSize());
        this.subItemMarkerLeft.setVisible(false);

        this.subItemMarkerRight = scene.add.text(this.menuStartX + this.markerOffsetX(), this.menuStartY, ">>",
        {
            fontFamily:  this.fontFamily(),
            fontSize: 64,
            align: this.align(),            
            color:"rgb(255,255,255)",
        });
        this.subItemMarkerRight.setOrigin(0.5, 0.5);
        this.subItemMarkerRight.setStroke(this.fontStrokeColor(), this.fontStrokeThickness());
        this.subItemMarkerRight.setFontSize(this.menuItemFontSize());     
        this.subItemMarkerRight.setVisible(false);
    }

    refreshColorsAndMarker() {
        for(var i = 0; i < this.items.length; i++) {
            if(i == this.selectedItemIndex) {
                this.items[i].setColor(this.highlightedColor());
            }
            else {
                this.items[i].setColor(this.nonHighlightedColor());
            }
        }     

        this.marker.setY(this.menuStartY + this.selectedItemIndex * this.menuItemDistanceY());   
        
        this.subItemMarkerRight.setX(this.menuStartX - 300);           
        this.subItemMarkerLeft.setY(this.menuStartY + this.selectedItemIndex * this.menuItemDistanceY());   
        
        this.subItemMarkerRight.setX(this.menuStartX + 300);           
        this.subItemMarkerRight.setY(this.menuStartY + this.selectedItemIndex * this.menuItemDistanceY());   
        
        var temp = this.items[this.selectedItemIndex];
        if(temp instanceof ComplexMenuItem)
        {
            this.marker.setVisible(false);
            this.subItemMarkerLeft.setVisible(true);
            this.subItemMarkerRight.setVisible(true);
        } 
        else {
            this.marker.setVisible(true);
            this.subItemMarkerLeft.setVisible(false);
            this.subItemMarkerRight.setVisible(false);
        }        
    }

    selectNextItem(sound) {
        if(this.selectedItemIndex < this.items.length - 1) {
            this.selectedItemIndex++;      
            
            if(this.useAudio)
                sound.play("menuSwitchItemSound");
        }
            
        this.refreshColorsAndMarker();        
    }

    selectPreviousItem(sound) {
        if(this.selectedItemIndex > 0) {
            this.items[this.selectedItemIndex].setColor(this.nonHighlightedColor());
            this.selectedItemIndex--;        
            
            if(this.useAudio)
                sound.play("menuSwitchItemSound");
        }

        this.refreshColorsAndMarker();        
    }

    trySelectNextSubItem(sound) {
       var temp = this.items[this.selectedItemIndex];
       if(temp instanceof ComplexMenuItem)
       {
            var item = <ComplexMenuItem>this.items[this.selectedItemIndex];
            item.selectNextItem();

            if(this.useAudio)
                sound.play("menuSwitchItemSound");

            this.refreshStats(item.subItems[item.selectedSubItemIndex]);
       }       
    }

    trySelectPreviousSubItem(sound) {
        var temp = this.items[this.selectedItemIndex];
        if(temp instanceof ComplexMenuItem)
        {
             var item = <ComplexMenuItem>this.items[this.selectedItemIndex];
             item.selectPreviousItem();

             if(this.useAudio)
                sound.play("menuSwitchItemSound");

            this.refreshStats(item.subItems[item.selectedSubItemIndex]);   
        }   
     }

     private ratingToDots(rating: number): string{
        let text = '';
        for(var i = 0; i < rating; i++) {
            text += '•';
        }

        return text;
     }

     resetAllSelections() {
        this.items.forEach(x => {
            if(x instanceof ComplexMenuItem) {
                var item = <ComplexMenuItem>x;
                item.resetSelection();
            }                
        });
        this.selectedItemIndex = 0;
     }

     show() {
        this.title.setVisible(true);
        
        if(this.titleIcon != null)
            this.titleIcon.setVisible(true);

        if(this.subtitle != null)
            this.subtitle.setVisible(true);

        if(this.footer != null)
            this.footer.setVisible(true);
        
        if(this.footer2 != null)
            this.footer2.setVisible(true);

        if(this.stat1Text != null)
            this.stat1Text.setVisible(true);

        if(this.stat2Text != null)
            this.stat2Text.setVisible(true);

        if(this.stat3Text != null)
            this.stat3Text.setVisible(true);
        
        this.marker.setVisible(true);

        if(this.subItemMarkerLeft != null
            && this.items[this.selectedItemIndex] instanceof ComplexMenuItem) {

            this.subItemMarkerLeft.setVisible(true);
        }

        if(this.subItemMarkerRight != null
            && this.items[this.selectedItemIndex] instanceof ComplexMenuItem) {
                
            this.subItemMarkerRight.setVisible(true);
        }
        
        this.items.forEach(x => {
            x.setVisible(true);
            if(x instanceof ComplexMenuItem) {
                var icon = x.sprite;
                if(icon != null)
                    icon.setVisible(true);
            }
        });

        this.refreshColorsAndMarker();
     }

     hide() {
        this.title.setVisible(false);

        if(this.titleIcon != null)
            this.titleIcon.setVisible(false);
        
        if(this.subtitle != null)
            this.subtitle.setVisible(false);

        if(this.footer != null)
            this.footer.setVisible(false);
        
        if(this.footer2 != null)
            this.footer2.setVisible(false);
        
        if(this.stat1Text != null)
            this.stat1Text.setVisible(false);

        if(this.stat2Text != null)
            this.stat2Text.setVisible(false);

        if(this.stat3Text != null)
            this.stat3Text.setVisible(false);
        

        this.marker.setVisible(false);

        if(this.subItemMarkerLeft != null)
            this.subItemMarkerLeft.setVisible(false);

        if(this.subItemMarkerRight != null)
            this.subItemMarkerRight.setVisible(false);
        
        this.items.forEach(x => {
            x.setVisible(false);
            if(x instanceof ComplexMenuItem) {
                var icon = x.sprite;
                if(icon != null)
                    icon.setVisible(false);
            }
        });
    }
}

export class MenuItem extends Phaser.GameObjects.Text {
    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }
}

export class MenuLinkItem extends Phaser.GameObjects.Text {
    menuDestinationLink: MenuPage;

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.menuDestinationLink = params.menuDestinationLink;
        this.text = params.text;
    }

    getDestinationMenu(): MenuPage {
        return this.menuDestinationLink;
    }
}

export class StartGameMenuItem extends Phaser.GameObjects.Text {

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }    
}

export class StartMultiplayerGameMenuItem extends Phaser.GameObjects.Text {

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }    
}

export class ContinueGameMenuItem extends Phaser.GameObjects.Text {

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }    
}

export class UnpauseGameMenuItem extends Phaser.GameObjects.Text {

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }    
}

export class ReturnToTitleMenuItem extends Phaser.GameObjects.Text {

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.text = params.text;
    }    
}


export class ComplexMenuItem extends Phaser.GameObjects.Text {
    subItems: Array<MenuKeyValueMapping>;
    itemTitle: string;
    selectedSubItemIndex: integer;
    sprite: Phaser.GameObjects.Sprite;

    constructor(params) {
        super(params.scene, params.x, params.y, params.text, params.style);

        this.itemTitle = params.text;
        this.subItems = params.subItems;
        
        this.selectedSubItemIndex = 0;

        this.refreshText();
    }    

    public setIcon(scene: Phaser.Scene, key: string, x: number, y: number, scale: number, color: number) {
        //this.titleIcon = scene.add.image(this.x - this.width / 2 - 100, this.y, texture, frame);
        if(key != null) {
            this.sprite = scene.add.sprite(x, y, key)
            this.sprite.setOrigin(0.5, 0.5);
            this.sprite.setScale(scale, scale);
            this.sprite.setTexture(key);
            this.sprite.setTint(color);
            
            this.sprite.setDepth(1);
        }
        this.refreshText();
    }

    public selectNextItem() {
        if(this.selectedSubItemIndex < this.subItems.length - 1)
            this.selectedSubItemIndex++;        

        this.refreshText();
    }

    public selectPreviousItem() {
        if(this.selectedSubItemIndex > 0)
            this.selectedSubItemIndex--;        

        this.refreshText();
    }

    public resetSelection() {
        this.selectedSubItemIndex = 0;
        this.refreshText();
    }

    private refreshText() {

        var subItem = this.subItems[this.selectedSubItemIndex];
        this.setOrigin(0.5, 0.5);
                
        if(this.sprite != null) {
            this.text = subItem.description;

            if(subItem instanceof AnimatedSpriteValueMappingWithStats)
                this.sprite.play(subItem.key);
            else
                this.sprite.setTexture(subItem.key);

            this.sprite.setScale(subItem.scale);
            this.sprite.setTint(subItem.color);            
        }
        else {            
            this.text = this.itemTitle + ' - ' + subItem.description;
        }
    }
}

export class MenuKeyValueMapping {
    description: string;
    key: string;
    scale: number;
    selectedIndex: number;
    armorRating: number;
    speedRating: number;
    specialDescription: string;
    specialRating: number;

    color: number;

    constructor(params) {
        this.description = params.description;
        this.selectedIndex = params.selectedIndex;
    }
}


export class IconValueMapping extends MenuKeyValueMapping {
    description: string;
    key: string;
    scale: number;
    selectedIndex: number;

    armorRating: number;
    speedRating: number;
    specialDescription: string;
    specialRating: number;

    color: number;

    constructor(params) {

        super(params);

        this.key = params.key;
        this.scale = params.scale;
        
        this.color = params.color ?? '0xFFFFFF';
    }
}

export class AnimatedSpriteValueMappingWithStats extends IconValueMapping {
    description: string;
    key: string;
    scale: number;
    selectedIndex: number;
    armorRating: number;
    speedRating: number;
    specialDescription: string;
    specialRating: number;

    color: number;

    constructor(params) {

        super(params);

        this.armorRating = params.armorRating;
        this.speedRating = params.speedRating;
        this.specialDescription = params.specialDescription;
        this.specialRating = params.specialRating;
    }
}