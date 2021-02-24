import { Component } from '@angular/core';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
@Component({
    selector: 'app-colours',
    templateUrl: './colours.component.html',
    styleUrls: ['./colours.component.scss'],
})
export class ColoursComponent {
    constructor(private colourService: ColourService) {}
}
