import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { StrokeWidthProperty } from '@app/shapes/properties/stroke-width-property';
import { Tool } from '@app/tools/classes/tool';
import { ILineWidthChangeListener } from './line-width-change-listener';

export abstract class ResizableTool extends Tool {
    private mlineWidth: number;

    constructor(protected drawingService: DrawingService) {
        super(drawingService);
        this.lineWidth = StrokeWidthProperty.DEFAULT_STROKE_WIDTH;
    }

    get lineWidth(): number {
        return this.mlineWidth;
    }

    set lineWidth(newWidth: number) {
        this.mlineWidth = newWidth;
        if ('onLineWidthChanged' in this) {
            (this as ILineWidthChangeListener).onLineWidthChanged();
        }
    }
}
