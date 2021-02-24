import { Component } from '@angular/core';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { Colour } from '@app/colour-picker/classes/colours.class';
import * as Constants from '@app/colour-picker/constants/colour.service.constants';
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
    }
}
