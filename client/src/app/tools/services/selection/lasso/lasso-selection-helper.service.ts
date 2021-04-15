import { Injectable } from '@angular/core';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { EllipseService } from '../../tools/ellipse-service';
import { SelectionHelperService } from '../selection-base/selection-helper.service';

@Injectable({
    providedIn: 'root',
})
export class LassoSelectionHelperService extends SelectionHelperService {
    constructor(drawingService: DrawingService, colourService: ColourService, ellipseService: EllipseService) {
        super(drawingService, colourService, ellipseService);
    }
}
