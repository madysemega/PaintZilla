import { ShapeType } from '@app/classes/shape-type';
import { ResizableTool } from './resizable-tool';

export abstract class ShapeTool extends ResizableTool {
    shapeType: ShapeType;
}
