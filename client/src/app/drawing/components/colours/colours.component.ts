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
    colour: Colour;
    private isHovering: boolean;
    primaryColourSelected: boolean;
    showColorPicker: boolean;
    constructor(private colourService: ColourService) {
        this.colour = Colour.hexToRgb(Constants.INITIAL_COLOR);
        this.primaryColourSelected = true;
        this.isHovering = false;
        this.showColorPicker = false;
    }

    selectPrimaryColor(): void {
        this.primaryColourSelected = true;
        this.showColorPicker = true;
        this.colour = this.colourService.getPrimaryColour();
    }

    selectSecondaryColor(): void {
        this.primaryColourSelected = false;
        this.showColorPicker = true;
        this.colour = this.colourService.getSecondaryColour();
    }

    swapColours(): void {
        this.colourService.swapColours();
        this.colour = this.primaryColourSelected ? this.colourService.getPrimaryColour() : this.colourService.getSecondaryColour();
    }

    onPreviousColourClick(event: MouseEvent, colour: Colour): void {
        if (event.button === MouseButton.Left || event.button === MouseButton.Right) {
            event.button === MouseButton.Left ? this.colourService.setPrimaryColour(colour) : this.colourService.setSecondaryColour(colour);
        }
        this.colour = colour;
        this.showColorPicker = false;
    }

    updateColour(): void {
        this.primaryColourSelected ? this.colourService.setPrimaryColour(this.colour) : this.colourService.setSecondaryColour(this.colour);
        this.showColorPicker = false;
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
        if (!this.isHovering && this.showColorPicker) {
            this.updateColour();
        }
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
