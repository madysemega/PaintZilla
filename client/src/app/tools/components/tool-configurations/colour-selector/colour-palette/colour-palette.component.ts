// source: https://malcoded.com/posts/angular-color-picker/
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ColourToolService } from '@app/tools/services/tools/colour-tool.service';

@Component({
    selector: 'app-colour-palette',
    templateUrl: './colour-palette.component.html',
    styleUrls: ['./colour-palette.component.scss'],
})
export class ColourPaletteComponent implements AfterViewInit, OnChanges {
    private ctx: CanvasRenderingContext2D;
    mousedown: boolean = false;
    selectedPosition: { x: number; y: number };

    @Input()
    hue: string;

    @Output()
    colour: EventEmitter<string> = new EventEmitter(true);

    @ViewChild('canvas')
    canvas: ElementRef<HTMLCanvasElement>;

    ngAfterViewInit(): void {
        this.draw();
    }
    constructor(public service: ColourToolService) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hue && !changes.hue.firstChange) {
            this.draw();
            const POS = this.selectedPosition;
            if (POS) {
                this.colour.emit(this.getColourAtPosition(POS.x, POS.y));
            }
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    onMouseDown(evt: MouseEvent): void {
        this.mousedown = true;
        this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        this.colour.emit(this.getColourAtPosition(evt.offsetX, evt.offsetY));
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mousedown) {
            this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
            this.draw();
            this.emitColour(evt.offsetX, evt.offsetY);
        }
    }

    draw(): void {
        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        const WIDTH = this.canvas.nativeElement.width;
        const HEIGHT = this.canvas.nativeElement.height;
        const NB_COL = 3;
        let hueDrawn = 'rgba(255,255,255,1)';
        if (this.hue) {
            const INDEX_THIRD_COMMA = this.hue.split(',', NB_COL).join(',').length;
            hueDrawn = this.hue.substring(0, INDEX_THIRD_COMMA + 1) + '1)';
        }
        this.ctx.fillStyle = hueDrawn;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        const WHITE_GRAD = this.ctx.createLinearGradient(0, 0, WIDTH, 0);
        WHITE_GRAD.addColorStop(0, 'rgba(255,255,255,1)');
        WHITE_GRAD.addColorStop(1, 'rgba(255,255,255,0)');

        this.ctx.fillStyle = WHITE_GRAD;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        const BLACK_GRAD = this.ctx.createLinearGradient(0, 0, 0, HEIGHT);
        BLACK_GRAD.addColorStop(0, 'rgba(0,0,0,0)');
        BLACK_GRAD.addColorStop(1, 'rgba(0,0,0,1)');

        this.ctx.fillStyle = BLACK_GRAD;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        if (this.selectedPosition) {
            const ARC_RADIUS = 10;
            const LINE_WIDTH = 5;
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, ARC_RADIUS, 0, 2 * Math.PI);
            this.ctx.lineWidth = LINE_WIDTH;
            this.ctx.stroke();
        }
    }

    getColourAtPosition(x: number, y: number): string {
        const IMAGE_DATA = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + IMAGE_DATA[0] + ',' + IMAGE_DATA[1] + ',' + IMAGE_DATA[2] + `,${this.service.opacity})`;
    }

    emitColour(x: number, y: number): void {
        const rgbaColor = this.getColourAtPosition(x, y);
        this.colour.emit(rgbaColor);
    }
}
