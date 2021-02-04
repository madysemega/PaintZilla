import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

export abstract class ResizableTool extends Tool {
    lineWidth: number;

    constructor(protected drawingService: DrawingService) {
        super(drawingService);
        this.lineWidth = 1;
    }

    abstract adjustLineWidth(lineWidth: number): void;
}
