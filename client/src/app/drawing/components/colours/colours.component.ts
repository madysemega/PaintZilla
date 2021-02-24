import { Component, HostListener } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour.service.constants';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
@Component({
    selector: 'app-colours',
    templateUrl: './colours.component.html',
    styleUrls: ['./colours.component.scss'],
})
export class ColoursComponent {
    colour: Colour = Colour.hexToRgb(Constants.INITIAL_COLOR);
    private isHovering: boolean = false;
    primaryColourSelected: boolean = true;
    showColourPicker: boolean = false;
    constructor(private colourService: ColourService) {
        this.colourService.primaryColourSelected = this.primaryColourSelected;
        this.colourService.showColourPickerChange.subscribe((flag: boolean) => (this.showColourPicker = flag));
        this.colourService.colour = this.colour;
    }

    selectPrimaryColour(): void {
        this.colourService.selectPrimaryColour();
    }

    selectSecondaryColour(): void {
        this.colourService.selectSecondaryColour();
    }

    swapColours(): void {
        this.colourService.swapComponentColours();
    }

    onPreviousColourClick(event: MouseEvent, colour: Colour): void {
        if (event.button === MouseButton.Left || event.button === MouseButton.Right) {
            event.button === MouseButton.Left ? this.colourService.setPrimaryColour(colour) : this.colourService.setSecondaryColour(colour);
        }
        this.colour = colour;
        this.showColourPicker = false;
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.isHovering = true;
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.isHovering = false;
    }

    @HostListener('document:mousedown')
    onMouseDown(): void {
        if (!this.isHovering && this.showColourPicker) {
            this.updateColour();
        }
    }

    updateColour(): void {
        this.colourService.updateColour();
    }

    get primaryColour(): Colour {
        return this.colourService.getPrimaryColour();
    }

    get secondaryColour(): Colour {
        return this.colourService.getSecondaryColour();
    }

    get previousColours(): Colour[] {
        return this.colourService.getPreviousColours();
    }
}
