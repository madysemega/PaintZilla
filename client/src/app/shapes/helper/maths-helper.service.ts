import { Injectable } from '@angular/core';
import { Vec2 } from '@app/app/classes/vec2';

@Injectable({
  providedIn: 'root'
})
export class MathsHelper {

  constructor() { }

  computeCenter(pointA: Vec2, pointB: Vec2): Vec2{
    return { x: (pointA.x + pointB.x)/2, y: (pointA.y + pointB.y)/2};
  }
  
}
