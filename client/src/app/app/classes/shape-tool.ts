import { ResizableTool } from './resizable-tool';
import { ShapeType } from './shape-type';

export abstract class ShapeTool extends ResizableTool {
    shapeType: ShapeType;
}
