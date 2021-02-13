import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property';
import { Tool } from '@app/tools/classes/tool';

export abstract class ResizableTool extends Tool {
    lineWidth: number;

    constructor(protected drawingService: DrawingService) {
        super(drawingService);
        this.lineWidth = StrokeWidthProperty.DEFAULT_STROKE_WIDTH;
    }

    adjustLineWidth(lineWidth: number): void {
        this.lineWidth = lineWidth;
    }
}
