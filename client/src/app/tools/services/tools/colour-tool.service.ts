import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColourToolService {
    colour1: string;
    colour2: string;
    colourList: string[] = [];
}
