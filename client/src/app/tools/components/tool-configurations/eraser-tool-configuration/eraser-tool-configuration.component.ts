import { Component } from '@angular/core';
import { EraserService } from '@app/tools/services/tools/eraser/eraser-service';

@Component({
    selector: 'app-eraser-tool-configuration',
    templateUrl: './eraser-tool-configuration.component.html',
    styleUrls: ['./eraser-tool-configuration.component.scss'],
})
export class EraserToolConfigurationComponent {
    constructor(public eraserService: EraserService) {}
}
