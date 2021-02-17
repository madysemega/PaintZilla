// source: https://malcoded.com/posts/angular-color-picker/
import { Component, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
const NB_COL = 3;
@Component({
    selector: 'app-colour-selector',
    templateUrl: './colour-selector.component.html',
    styleUrls: ['./colour-selector.component.scss'],
})
export class ColourSelectorComponent {
    show: boolean = false;
    @Input()
    value: number = 1;
    hue: string;
    colour: string;
    colourInput: string;
    opacity: number = 1;

    constructor(public service: ColourToolService) {}

    changeOpacity(event: MatSliderChange): void {
        // source: https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
        const INDEX_THIRD_COMMA = this.colour.split(',', NB_COL).join(',').length;
        const OPACITY_STRING = this.colour.substring(INDEX_THIRD_COMMA + 1, this.colour.length - 1);
        this.opacity = parseInt(OPACITY_STRING, 10);
        this.opacity = event.value as number;
        this.service.opacity = this.opacity;
        this.colour = this.colour.substring(0, INDEX_THIRD_COMMA + 1) + this.opacity.toString() + ')';
    }

    setOpacityOne(col: string): string {
        const INDEX_THIRD_COMMA = this.colour.split(',', NB_COL).join(',').length;
        this.opacity = 1;
        const COLOUR_ONE_OPACITY = this.colour.substring(0, INDEX_THIRD_COMMA + 1) + '1)';
        return COLOUR_ONE_OPACITY;
    }

    addColEv(event: MouseEvent): void {
        this.service.primaryColour = (event.target as HTMLInputElement).style.backgroundColor;
    }

    addSecEv(event: MouseEvent): void {
        this.service.secondaryColour = (event.target as HTMLInputElement).style.backgroundColor;
    }

    addFirstCol(isSelected: boolean): void {
        this.service.primaryColour = this.colour;
        this.rememberAddedCol(this.service.secondaryColour, isSelected);
    }

    addSecCol(isSelected: boolean): void {
        this.service.secondaryColour = this.colour;
        this.rememberAddedCol(this.service.secondaryColour, isSelected);
    }
    rememberAddedCol(col: string, isSelected: boolean): void {
        if (isSelected) {
            this.rememberCol(this.setOpacityOne(col));
        }
    }

    takeHexClr(event: KeyboardEvent): void {
        const INPUT_STRING: string = (event.target as HTMLInputElement).value;
        const HEX_SIZE = 7;
        if (INPUT_STRING.length === HEX_SIZE && INPUT_STRING[0] === '#') {
            this.toHex(INPUT_STRING);
            this.rememberCol(this.colour);
        }
        event.stopPropagation();
    }

    toHex(col: string): void {
        const R_POS = 1;
        const G_POS = 3;
        const B_POS = 5;
        const R_VALUE: number = parseInt(col.substr(R_POS, 2), 16);
        const G_VALUE: number = parseInt(col.substr(G_POS, 2), 16);
        const B_VALUE: number = parseInt(col.substr(B_POS, 2), 16);
        this.colour = 'rgba(' + R_VALUE.toString(10) + ',' + G_VALUE.toString(10) + ',' + B_VALUE.toString(10) + ',1)';
        this.opacity = 1;
    }

    isHex(value: string): boolean {
        const NUMB_MIN = 48;
        const NUMB_MAX = 57;
        const CAPITAL_MIN = 65;
        const CAPITAL_MAX = 70;
        const SMALL_MIN = 97;
        const SMALL_MAX = 102;
        for (let i = 1; i < value.length; i++) {
            if (value.charCodeAt(i) < NUMB_MIN || value.charCodeAt(i) > SMALL_MAX) {
                return false;
            } else if (value.charCodeAt(i) < CAPITAL_MIN && value.charCodeAt(i) > NUMB_MAX) {
                return false;
            } else if (value.charCodeAt(i) < SMALL_MIN && value.charCodeAt(i) > CAPITAL_MAX) {
                return false;
            }
        }
        return true;
    }

    switchCol(): void {
        const TEMP = this.service.primaryColour;
        this.service.primaryColour = this.service.secondaryColour;
        this.service.secondaryColour = TEMP;
    }

    rememberCol(newCol: string): void {
        if (this.service.colourList.find((col) => col === newCol)) {
            return;
        }
        const LIST_SIZE = 10;
        this.setOpacityOne(newCol);
        if (this.service.colourList.length < LIST_SIZE) {
            this.service.colourList.push(newCol);
        } else if (this.service.colourList.length === LIST_SIZE) {
            this.service.colourList.shift();
            this.service.colourList.push(newCol);
        }
    }

    showList(): void {
        this.show = !this.show;
    }
}
