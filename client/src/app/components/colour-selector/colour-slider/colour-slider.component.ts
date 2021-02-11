import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ColourToolService } from '@app/services/tools/colour-tool.service';

const GRDSTEP1 = 0.17;
const GRDSTEP2 = 0.34;
const GRDSTEP3 = 0.51;
const GRDSTEP4 = 0.68;
const GRDSTEP5 = 0.85;

const RECTHEIGHT = 10;
const RECTWIDTH = 5;
@Component({
    selector: 'app-colour-slider',
    templateUrl: './colour-slider.component.html',
    styleUrls: ['./colour-slider.component.scss'],
})
export class ColourSliderComponent implements AfterViewInit {
    @ViewChild('canvas')
    canvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;
    height: number;
    width: number;
    mousedown: boolean = false;
    private selectedHeight: number;

    @Output()
    colour: EventEmitter<string> = new EventEmitter();

    onMouseDown(evt: MouseEvent): void {
        this.mousedown = true;
        this.selectedHeight = evt.offsetY;
        this.draw();
        this.emitColor(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mousedown) {
            this.selectedHeight = evt.offsetY;
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }

    emitColor(x: number, y: number): void {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.colour.emit(rgbaColor);
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    constructor(public service: ColourToolService) {}

    ngAfterViewInit(): void {
        this.draw();
    }

    draw(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        this.width = this.canvas.nativeElement.width;
        this.height = this.canvas.nativeElement.height;
        this.ctx.clearRect(0, 0, this.width, this.height);
        const GRADIENT = this.ctx.createLinearGradient(0, 0, 0, this.height);
        GRADIENT.addColorStop(0, 'rgba(255, 0, 0, 1)');
        GRADIENT.addColorStop(GRDSTEP1, 'rgba(255, 255, 0, 1)');
        GRADIENT.addColorStop(GRDSTEP2, 'rgba(0, 255, 0, 1)');
        GRADIENT.addColorStop(GRDSTEP3, 'rgba(0, 255, 255, 1)');
        GRADIENT.addColorStop(GRDSTEP4, 'rgba(0, 0, 255, 1)');
        GRADIENT.addColorStop(GRDSTEP5, 'rgba(255, 0, 255, 1)');
        GRADIENT.addColorStop(1, 'rgba(255, 0, 0, 1)');
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.fillStyle = GRADIENT;
        this.ctx.fill();
        this.ctx.closePath();
        if (this.selectedHeight) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = RECTWIDTH;
            this.ctx.rect(0, this.selectedHeight - RECTWIDTH, this.width, RECTHEIGHT);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    getColorAtPosition(x: number, y: number): string {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
}
