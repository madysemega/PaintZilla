import {Injectable} from "@angular/core";
import { Vec2 } from '@app/app/classes/vec2';
import {CanvasAttributes} from '../../constants/canvas-attributes'

@Injectable({
    providedIn: 'root',
})

export class DrawingSurfaceResizingService {
    isResizingHorizontally: boolean = false;
    isResizingVertically: boolean = false;
    isResizingDiagonally: boolean = false;

    

    
}

