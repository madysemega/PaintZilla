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
            const pos = this.selectedPosition;
            if (pos) {
                this.colour.emit(this.getColourAtPosition(pos.x, pos.y));
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
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;
        const NB_COL = 3;
        let hueDrawn = 'rgba(255,255,255,1)';
        if (this.hue) {
            const INDEXTHIRDCOMMA = this.hue.split(',', NB_COL).join(',').length;
            hueDrawn = this.hue.substring(0, INDEXTHIRDCOMMA + 1) + '1)';
        }
        console.log('le hue est', this.hue);
        this.ctx.fillStyle = hueDrawn || 'rgba(255,255,255,1)';
        this.ctx.fillRect(0, 0, width, height);

        const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

        this.ctx.fillStyle = whiteGrad;
        this.ctx.fillRect(0, 0, width, height);

        const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

        this.ctx.fillStyle = blackGrad;
        this.ctx.fillRect(0, 0, width, height);

        if (this.selectedPosition) {
            const ARCRADIUS = 10;
            const LINEWIDTH = 5;
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, ARCRADIUS, 0, 2 * Math.PI);
            this.ctx.lineWidth = LINEWIDTH;
            this.ctx.stroke();
        }
    }

    getColourAtPosition(x: number, y: number): string {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + `,${this.service.opacity})`;
    }

    emitColour(x: number, y: number): void {
        const rgbaColor = this.getColourAtPosition(x, y);
        this.colour.emit(rgbaColor);
    }
}
