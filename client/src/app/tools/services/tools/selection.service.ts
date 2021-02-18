import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  
  public isSelectionBeingMoved: boolean;
  constructor() { }
}
