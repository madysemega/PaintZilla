// source: https://malcoded.com/posts/angular-color-picker/
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';
const NBCOL = 3;
@Component({
    selector: 'app-colour-selector',
    templateUrl: './colour-selector.component.html',
    styleUrls: ['./colour-selector.component.scss'],
})
export class ColourSelectorComponent {
    show: boolean = false;
    @ViewChild('color-div') colordiv: ElementRef<HTMLButtonElement>;
    @Input()
    value: number = 1;
    hue: string;
    colour: string;
    colourInput: string;
    opacity: number = 1;
    constructor(public service: ColourToolService) {}
    changeOpacity(event: MatSliderChange): void {
        // source: https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
        console.log(event);
        const INDEXTHIRDCOMMA = this.colour.split(',', NBCOL).join(',').length;
        const opacityString = this.colour.substring(INDEXTHIRDCOMMA + 1, this.colour.length - 1);
        this.opacity = parseInt(opacityString, 10);
        this.opacity = event.value as number;
        this.colour = this.colour.substring(0, INDEXTHIRDCOMMA + 1) + this.opacity.toString() + ')';
    }
    setOpacityOne(col: string): void {
        const INDEXTHIRDCOMMA = this.colour.split(',', NBCOL).join(',').length;
        this.opacity = 1;
        this.colour = this.colour.substring(0, INDEXTHIRDCOMMA + 1) + '1)';
    }
    addColEv(event: MouseEvent): void {
        console.log(event.target);
        this.service.primaryColour = (event.target as HTMLInputElement).style.backgroundColor;
    }
    addSecEv(event: MouseEvent): void {
        this.service.secondaryColour = (event.target as HTMLInputElement).style.backgroundColor;
    }
    addFirstCol(isSelected: boolean): void {
        this.service.primaryColour = this.colour;
        this.setOpacityOne(this.service.primaryColour);
        if (isSelected) {
            this.rememberCol(this.colour);
        }
    }
    addSecCol(isSelected: boolean): void {
        this.service.secondaryColour = this.colour;
        this.setOpacityOne(this.service.secondaryColour);
        if (isSelected) {
            this.rememberCol(this.colour);
        }
    }

    takeHexClr(event: KeyboardEvent): void {
        console.log(event);
        const inputString: string = (event.target as HTMLInputElement).value;
        const hexSize = 7;
        if (inputString.length === hexSize && inputString[0] === '#' && this.isHex(inputString)) {
            this.toHex(inputString);
            this.rememberCol(this.colour);
        }
        event.stopPropagation();
    }

    toHex(col: string): void {
        const RPOS = 1;
        const GPOS = 3;
        const BPOS = 5;
        const rValue: number = parseInt(col.substr(RPOS, 2), 16);
        const gValue: number = parseInt(col.substr(GPOS, 2), 16);
        const bValue: number = parseInt(col.substr(BPOS, 2), 16);
        this.colour = 'rgba(' + rValue.toString(10) + ',' + gValue.toString(10) + ',' + bValue.toString(10) + ',1)';
        this.opacity = 1;
    }

    isHex(value: string): boolean {
        const NUMBMIN = 48;
        const NUMBMAX = 57;
        const CAPITALMIN = 65;
        const CAPITALMAX = 70;
        const SMALLMIN = 97;
        const SMALLMAX = 102;
        for (let i = 1; i < value.length; i++) {
            if (value.charCodeAt(i) < NUMBMIN || value.charCodeAt(i) > SMALLMAX) {
                return false;
            } else if (value.charCodeAt(i) < CAPITALMIN && value.charCodeAt(i) > NUMBMAX) {
                return false;
            } else if (value.charCodeAt(i) < SMALLMIN && value.charCodeAt(i) > CAPITALMAX) {
                return false;
            }
        }
        return true;
    }

    switchCol(): void {
        const temp = this.service.primaryColour;
        this.service.primaryColour = this.service.secondaryColour;
        this.service.secondaryColour = temp;
    }

    rememberCol(newCol: string): void {
        if (this.service.colourList.indexOf(newCol) >= 0) {
            return;
        }
        const LISTSIZE = 10;
        this.setOpacityOne(newCol);
        if (this.service.colourList.length < LISTSIZE) {
            this.service.colourList.push(newCol);
        } else if (this.service.colourList.length === LISTSIZE) {
            this.service.colourList.shift();
            this.service.colourList.push(newCol);
        }
    }

    showList(): void {
        if (!this.show) {
            this.show = true;
        } else {
            this.show = false;
        }
    }
}
