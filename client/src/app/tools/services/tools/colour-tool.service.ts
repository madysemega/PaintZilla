import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColourToolService {
    primaryColour: string;
    secondaryColour: string;
    opacity: number = 1;
    colourList: string[] = [];
}
