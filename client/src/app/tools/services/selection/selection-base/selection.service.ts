import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { BehaviorSubject } from 'rxjs';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';

@Injectable({
  providedIn: 'root'
})
export abstract class SelectionService {
  public readonly OUTSIDE_DETECTION_OFFSET_PX: number = 15;
  public isSelectionBeingManipulated: BehaviorSubject<boolean>; 

  public actions: Vec2[]=[]; //////////////////FOR TESTING PURPOSES/////////////////////

  constructor(protected drawingService : DrawingService, protected colourService: ColourToolService) { 
    this.isSelectionBeingManipulated =  new BehaviorSubject<boolean>(false);
  }

  getSquareAjustedPerimeter(startPoint: Vec2, endPoint: Vec2): Vec2 {
    const endPointWithRespectToStartPoint: Vec2 = {
      x: endPoint.x - startPoint.x,
      y: endPoint.y - startPoint.y,
      };
    
    const endPointShortestComponent = Math.min(Math.abs(endPointWithRespectToStartPoint.x), Math.abs(endPointWithRespectToStartPoint.y));

    const isXComponentPositive: boolean = startPoint.x < endPoint.x;
    const isYComponentPositive: boolean = startPoint.y < endPoint.y;

    return {
      x: startPoint.x + (isXComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
      y: startPoint.y + (isYComponentPositive ? endPointShortestComponent : -endPointShortestComponent),
    };
  }

  drawPerimeter(ctx: CanvasRenderingContext2D, startPoint: Vec2, endPoint: Vec2, isShiftDown: boolean): void {
    const DASH_NUMBER = 8;

    const topLeft: Vec2 = {
        x: Math.min(startPoint.x, endPoint.x),
        y: Math.min(startPoint.y, endPoint.y),
    };

    const dimensions: Vec2 = {
        x: Math.abs(endPoint.x - startPoint.x),
        y: Math.abs(endPoint.y - startPoint.y),
    };

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([DASH_NUMBER]);
    ctx.strokeStyle = '#888';
    ctx.rect(topLeft.x, topLeft.y, dimensions.x, dimensions.y);
    ctx.stroke();
    ctx.restore();
}


setIsSelectionBeingManipulated(isItBeingManipulated: boolean) {
  this.isSelectionBeingManipulated.next(isItBeingManipulated);
}

isClickOutsideSelection(positions: Vec2[], isReversedX: boolean, isReversedY: boolean ): boolean {
  let mousePosition: Vec2 = positions[0];
  let topLeft: Vec2 = positions[1];
  let bottomRight: Vec2 = positions[2];

  let xOutsideSelection: boolean;
  let yOutsideSelection: boolean

  if (isReversedX) {
    xOutsideSelection = (mousePosition.x > topLeft.x + this.OUTSIDE_DETECTION_OFFSET_PX)
      || (mousePosition.x < bottomRight.x - this.OUTSIDE_DETECTION_OFFSET_PX);
  }
  else {
    xOutsideSelection = (mousePosition.x < topLeft.x - this.OUTSIDE_DETECTION_OFFSET_PX)
      || (mousePosition.x > bottomRight.x + this.OUTSIDE_DETECTION_OFFSET_PX);
  }

  if (isReversedY) {
    yOutsideSelection = (mousePosition.y > topLeft.y + this.OUTSIDE_DETECTION_OFFSET_PX)
      || (mousePosition.y < bottomRight.y - this.OUTSIDE_DETECTION_OFFSET_PX);
  }
  else {
    yOutsideSelection = (mousePosition.y < topLeft.y - this.OUTSIDE_DETECTION_OFFSET_PX)
      || (mousePosition.y > bottomRight.y + this.OUTSIDE_DETECTION_OFFSET_PX);
  }
  return (xOutsideSelection || yOutsideSelection);
}

add(vect: Vec2, amount: Vec2) {
  vect.x += amount.x;
  vect.y += amount.y;
}

convertToMovement(mousePos: Vec2, mouseDownLastPos: Vec2): Vec2 {
  const mouseMovement: Vec2 = { x: mousePos.x - mouseDownLastPos.x, y: mousePos.y - mouseDownLastPos.y }
  return mouseMovement;
}

}

