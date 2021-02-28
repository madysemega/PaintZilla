import { Injectable } from '@angular/core';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ColourToolService } from '../tools/colour-tool.service';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleSelectionHelperService extends SelectionService {
  
  constructor( drawingService : DrawingService,  colourService: ColourToolService) { 
    super(drawingService, colourService);
  }
}
