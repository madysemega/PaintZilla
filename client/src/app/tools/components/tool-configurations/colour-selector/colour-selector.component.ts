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
        this.service.colour1 = (event.target as HTMLInputElement).style.backgroundColor;
    }
    addSecEv(event: MouseEvent): void {
        this.service.colour2 = (event.target as HTMLInputElement).style.backgroundColor;
    }
    addFirstCol(isSelected: boolean): void {
        this.service.colour1 = this.colour;
        this.setOpacityOne(this.service.colour1);
        if (isSelected) {
            this.rememberCol(this.colour);
        }
    }
    addSecCol(isSelected: boolean): void {
        this.service.colour2 = this.colour;
        this.setOpacityOne(this.service.colour2);
        if (isSelected) {
            this.rememberCol(this.colour);
        }
    }

    takeHexClr(event: KeyboardEvent): void {
        console.log(event);
        let isValid = true;
        const inputString: string = (event.target as HTMLInputElement).value;
        const hexSize = 7;
        if (inputString.length === hexSize && inputString[0] === '#') {
            for (let i = 1; i < hexSize; i++) {
                if (inputString[i] >= '9' && inputString[i] <= '0') {
                    isValid = false;
                }
            }

            if (isValid) {
                this.toHex(inputString);
                this.rememberCol(this.colour);
            }
        }
    }

    toHex(col: string): void {
        const RPOS = 0;
        const GPOS = 2;
        const BPOS = 4;
        const rValue: number = parseInt(col.substr(RPOS, 2), 16);
        const gValue: number = parseInt(col.substr(GPOS, 2), 16);
        const bValue: number = parseInt(col.substr(BPOS, 2), 16);
        this.colour = 'rgba(' + rValue.toString(10) + ',' + bValue.toString(10) + ',' + gValue.toString(10) + ',1)';
        this.opacity = 1;
    }

    switchCol(): void {
        const temp = this.service.colour1;
        this.service.colour1 = this.service.colour2;
        this.service.colour2 = temp;
    }

    rememberCol(newCol: string): void {
        if (this.service.colourList.indexOf(newCol) >= 0) {
            return;
        }
        const LISTSIZE = 10;
        this.setOpacityOne(newCol);
        if (this.service.colourList.length < LISTSIZE && newCol !== undefined) {
            this.service.colourList.push(newCol);
        } else if (this.service.colourList.length === LISTSIZE && newCol !== undefined) {
            this.service.colourList.shift();
            this.service.colourList.push(newCol);
        }
        console.log(this.service.colourList);
    }

    showList(): void {
        if (!this.show) {
            this.show = true;
        } else {
            this.show = false;
        }
    }
}
