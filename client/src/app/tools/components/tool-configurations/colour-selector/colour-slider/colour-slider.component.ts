// source: https://malcoded.com/posts/angular-color-picker/
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';

const GRD_STEP1 = 0.17;
const GRD_STEP2 = 0.34;
const GRD_STEP3 = 0.51;
const GRD_STEP4 = 0.68;
const GRD_STEP5 = 0.85;
const RECT_HEIGHT = 10;
const RECT_WIDTH = 5;

@Component({
    selector: 'app-colour-slider',
    templateUrl: './colour-slider.component.html',
    styleUrls: ['./colour-slider.component.scss'],
})
export class ColourSliderComponent implements AfterViewInit {
    @ViewChild('canvas')
    canvas: ElementRef<HTMLCanvasElement>;
    ctx: CanvasRenderingContext2D;
    height: number;
    width: number;
    mousedown: boolean = false;
    private selectedHeight: number;

    @Output()
    colour: EventEmitter<string> = new EventEmitter();

    constructor(public service: ColourToolService) {}

    ngAfterViewInit(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        this.width = this.canvas.nativeElement.width;
        this.height = this.canvas.nativeElement.height;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.draw();
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    onMouseDown(evt: MouseEvent): void {
        this.mousedown = true;
        this.selectedHeight = evt.offsetY;
        this.draw();
        this.emitColour(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mousedown) {
            this.selectedHeight = evt.offsetY;
            this.draw();
            this.emitColour(evt.offsetX, evt.offsetY);
        }
    }

    emitColour(x: number, y: number): void {
        const rgbaColour = this.getColourAtPosition(x, y);
        this.colour.emit(rgbaColour);
    }

    draw(): void {
        this.drawGradient();
        this.drawSelectorRect();
    }

    drawSelectorRect(): void{
        if (this.selectedHeight) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = RECT_WIDTH;
            this.ctx.rect(0, this.selectedHeight - RECT_WIDTH, this.width, RECT_HEIGHT);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    drawGradient() : void{
        const GRADIENT = this.ctx.createLinearGradient(0, 0, 0, this.height);
        GRADIENT.addColorStop(0, 'rgba(255, 0, 0, 1)');
        GRADIENT.addColorStop(GRD_STEP1, 'rgba(255, 255, 0, 1)');
        GRADIENT.addColorStop(GRD_STEP2, 'rgba(0, 255, 0, 1)');
        GRADIENT.addColorStop(GRD_STEP3, 'rgba(0, 255, 255, 1)');
        GRADIENT.addColorStop(GRD_STEP4, 'rgba(0, 0, 255, 1)');
        GRADIENT.addColorStop(GRD_STEP5, 'rgba(255, 0, 255, 1)');
        GRADIENT.addColorStop(1, 'rgba(255, 0, 0, 1)');
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.fillStyle = GRADIENT;
        this.ctx.fill();
        this.ctx.closePath();
    }

    getColourAtPosition(x: number, y: number): string {
        const IMAGE_DATA = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + IMAGE_DATA[0] + ',' + IMAGE_DATA[1] + ',' + IMAGE_DATA[2] + `,${this.service.opacity})`;
    }
}
