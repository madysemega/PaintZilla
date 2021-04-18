import { Component, ElementRef, ViewChild } from '@angular/core';
import { PipetteService } from '@app/tools/services/tools/pipette/pipette-service';

@Component({
    selector: 'app-pipette-tool-configuration',
    templateUrl: './pipette-tool-configuration.component.html',
    styleUrls: ['./pipette-tool-configuration.component.scss'],
})
export class PipetteToolConfigurationComponent {
    @ViewChild('zoomCanvas', { static: false }) zoomCanvas: ElementRef<HTMLCanvasElement>;
    zoomctx: CanvasRenderingContext2D;
    constructor(public pipetteService: PipetteService) {}
    ngAfterViewInit(): void {
        this.zoomctx = this.zoomCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.pipetteService.setCtx(this.zoomctx);
    }
}
