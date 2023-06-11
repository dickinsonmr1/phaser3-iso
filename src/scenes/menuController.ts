import { MenuLinkItem, MenuPage, StartGameMenuItem } from './menuPage'

export class MenuController {
    menuPages: Array<MenuPage>;
    selectedMenuPageIndex: number = 0;
    selectedMenuPage: MenuPage;

    constructor() {
        this.menuPages = new Array<MenuPage>();
    }

    addMenu(menuPage: MenuPage) {        
        menuPage.hide();
        this.menuPages.push(menuPage);

        this.selectedMenuPage = this.menuPages[0];
        this.selectedMenuPage.show();
    }
    
    selectPreviousItem(): void {
        this.selectedMenuPage.selectPreviousItem(null);
    }

    selectNextItem(): void {
        this.selectedMenuPage.selectNextItem(null);
    }

    selectPreviousSubItem(): void {
        this.selectedMenuPage.trySelectPreviousSubItem(null);
    }
    
    selectNextSubItem(): void {
        this.selectedMenuPage.trySelectNextSubItem(null);
    }

    confirmSelection(): boolean {

        let selectedMenuPageItem = this.selectedMenuPage.items[this.selectedMenuPage.selectedItemIndex];
        if(selectedMenuPageItem instanceof MenuLinkItem) {
            this.selectedMenuPage.hide();

            var newMenuPage = selectedMenuPageItem.getDestinationMenu();
            this.selectedMenuPage = newMenuPage;
            this.selectedMenuPage.show();

            return false;
        }
        else if(selectedMenuPageItem instanceof StartGameMenuItem) {
            this.selectedMenuPage.hide();
            
            return true;
        }

        return false;
    }
}