import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ColourToolService } from '@app/services/tools/colour-tool.service';

@Component({
    selector: 'app-colour-selector',
    templateUrl: './colour-selector.component.html',
    styleUrls: ['./colour-selector.component.scss'],
})
export class ColourSelectorComponent {
    show: boolean = false;
    @ViewChild('colorHex') colorHex: ElementRef;
    @Input()
    value: number = 1;
    hue: string;
    colour: string;
    colourInput: string;
    opacity: number = 1;

    constructor(public service: ColourToolService) {}
    changeOpacity(event: MatSliderChange): void {
        // source: https://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
        const NBCOL = 3;
        console.log(event.value);
        const indexThirdComma = this.colour.split(',', NBCOL).join(',').length;
        const opacityString = this.colour.substring(indexThirdComma + 1, this.colour.length - 1);
        this.opacity = parseInt(opacityString, 10);
        this.opacity = event.value as number;
        this.colour = this.colour.substring(0, indexThirdComma + 1) + this.opacity.toString() + ')';
    }
    addColEv(event: MouseEvent): void {
        this.service.colour1 = (event.target as HTMLInputElement).style.backgroundColor;
    }
    addSecEv(event: MouseEvent): void {
        this.service.colour2 = (event.target as HTMLInputElement).style.backgroundColor;
    }
    addFirstCol(isSelected: boolean): void {
        this.service.colour1 = this.colour;
        if (isSelected) {
            this.rememberCol(this.colour);
        }
    }
    addSecCol(isSelected: boolean): void {
        this.service.colour2 = this.colour;
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
                const RPOS = 1;
                const GPOS = 3;
                const BPOS = 5;
                const rValue: number = parseInt(inputString.substr(RPOS, 2), 16);
                const gValue: number = parseInt(inputString.substr(GPOS, 2), 16);
                const bValue: number = parseInt(inputString.substr(BPOS, 2), 16);
                this.colour = 'rgba(' + rValue.toString(10) + ',' + bValue.toString(10) + ',' + gValue.toString(10) + ',1)';
                this.rememberCol(this.colour);
            }
        }
    }

    switchCol(): void {
        const temp = this.service.colour1;
        this.service.colour1 = this.service.colour2;
        this.service.colour2 = temp;
    }

    rememberCol(newCol: string): void {
        const LISTSIZE = 10;
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
