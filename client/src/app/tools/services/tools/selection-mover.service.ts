import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { MouseButton } from '@app/tools/classes/mouse-button';
import { Tool } from '@app/tools/classes/tool';
import { EllipseSelectionRendererService } from './ellipse-selection-renderer.service';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})

export class SelectionMoverService extends Tool {
  private selectionCanvas: HTMLCanvasElement;

  private selectionAnchorPoint: Vec2;

  private selectionTopLeft: Vec2;
  private selectionBottomRight: Vec2;

  private mouseLastPos: Vec2 = { x: 0, y: 0 };

  constructor(drawingService: DrawingService, private selectionService: SelectionService, private ellipseSelectionRenderer: EllipseSelectionRendererService) {
    super(drawingService);
    this.key = 'selection-mover';
  }

  setSelection(selectionCanvas: HTMLCanvasElement, selectionStartPoint: Vec2, selectionEndPoint: Vec2) {
    this.selectionCanvas = selectionCanvas;
    this.selectionAnchorPoint = { x: selectionStartPoint.x, y: selectionStartPoint.y };
    this.selectionTopLeft = { x: selectionStartPoint.x, y: selectionStartPoint.y };
    this.selectionBottomRight = { x: selectionEndPoint.x, y: selectionEndPoint.y };
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    const mousePosition = this.getPositionFromMouse(event);
    if (this.mouseDown) {
      if (!this.isClickOnSelection(event)) {
        this.selectionService.isSelectionBeingMoved = false;
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.ellipseSelectionRenderer.sourceTopLeft = this.selectionAnchorPoint;
        this.ellipseSelectionRenderer.targetTopLeft = this.selectionTopLeft;
        this.ellipseSelectionRenderer.isFillWhiteBehindSelection = true;
        this.ellipseSelectionRenderer.selectionCanvas = this.selectionCanvas;
        this.ellipseSelectionRenderer.ctx = this.drawingService.baseCtx;
        this.ellipseSelectionRenderer.render();
      }
      this.mouseLastPos.x = mousePosition.x;
      this.mouseLastPos.y = mousePosition.y;
    }
  }

  isClickOnSelection(event: MouseEvent): boolean {
    const mousePosition = this.getPositionFromMouse(event);
    const xInSelection: boolean = mousePosition.x > Math.min(this.selectionTopLeft.x, this.selectionBottomRight.x)
      && mousePosition.x < Math.max(this.selectionTopLeft.x, this.selectionBottomRight.x);
    const yInSelection: boolean = mousePosition.y > Math.min(this.selectionTopLeft.y, this.selectionBottomRight.y)
      && mousePosition.y < Math.max(this.selectionTopLeft.y, this.selectionBottomRight.y);
    return (xInSelection && yInSelection);
  }

  onMouseUp(event: MouseEvent): void {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent): void {
    const mousePosition = this.getPositionFromMouse(event);

    if (this.mouseDown) {
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      const mouseMovement: Vec2 = { x: mousePosition.x - this.mouseLastPos.x, y: mousePosition.y - this.mouseLastPos.y }

      this.mouseLastPos.x += mouseMovement.x;
      this.mouseLastPos.y += mouseMovement.y;

      this.selectionTopLeft.x += mouseMovement.x;
      this.selectionTopLeft.y += mouseMovement.y;

      this.selectionBottomRight.x += mouseMovement.x;
      this.selectionBottomRight.y += mouseMovement.y;

      this.ellipseSelectionRenderer.sourceTopLeft = this.selectionAnchorPoint;
      this.ellipseSelectionRenderer.targetTopLeft = this.selectionTopLeft;
      this.ellipseSelectionRenderer.isFillWhiteBehindSelection = false;
      this.ellipseSelectionRenderer.selectionCanvas = this.selectionCanvas;
      this.ellipseSelectionRenderer.ctx = this.drawingService.previewCtx;
      this.ellipseSelectionRenderer.render();

      this.selectionService.drawPerimeter(this.drawingService.previewCtx, this.selectionTopLeft, this.selectionBottomRight);
      let center: Vec2 = { x: 0, y: 0 };
      let radii: Vec2 = { x: 0, y: 0 };
      this.selectionService.getEllipseParam(this.selectionTopLeft, this.selectionBottomRight, center, radii);
      this.selectionService.drawSelectionEllipse(center, radii);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
  }

  onKeyUp(event: KeyboardEvent): void {
  }

  drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2): void {
  }

  drawEllipse(isFinalDrawing: boolean, startPoint: Vec2, endPoint: Vec2): void {
  }
}
