import { Injectable } from '@angular/core';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { SelectionHelperService } from '@app/tools/services/selection/selection-base/selection-helper.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';

@Injectable({
    providedIn: 'root',
})
export class LassoSelectionHelperService extends SelectionHelperService {
    constructor(drawingService: DrawingService, colourService: ColourService, ellipseService: EllipseService) {
        super(drawingService, colourService, ellipseService);
    }
}
