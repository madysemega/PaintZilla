import { DrawingService } from '@app/drawing/services/drawing/drawing.service';
import { Tool } from '@app/tools/classes/tool';

export abstract class ResizableTool extends Tool {
    lineWidth: number;

    constructor(protected drawingService: DrawingService) {
        super(drawingService);
        this.lineWidth = 1;
    }

    abstract adjustLineWidth(lineWidth: number): void;
}
