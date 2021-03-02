import { Component, HostListener } from '@angular/core';
import { Colour } from '@app/colour-picker/classes/colours.class';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
@Component({
    selector: 'app-colours',
    templateUrl: './colours.component.html',
    styleUrls: ['./colours.component.scss'],
})
export class ColoursComponent {
    primaryColourSelected: boolean = true;
    showColourPicker: boolean = false;
    isHovering: boolean = false;
    constructor(private colourService: ColourService) {
        this.colourService.primaryColourSelected = this.primaryColourSelected;
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
        return this.colourService.primaryColour;
    }

    get secondaryColour(): Colour {
        return this.colourService.secondaryColour;
    }

    get previousColours(): Colour[] {
        return this.colourService.getPreviousColours();
    }
}
