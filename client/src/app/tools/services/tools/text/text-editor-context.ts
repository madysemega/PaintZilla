import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';

export type TextEditorContext = {
    drawingService: DrawingService;
    colourService: ColourService;
};
