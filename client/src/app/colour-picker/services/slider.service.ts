import { Injectable } from '@angular/core';

@Injectable()
export class SliderService {
    opacityCtx: CanvasRenderingContext2D;
    opacityCanvas: HTMLCanvasElement;

    drawOpacityContext(): void {}
}
