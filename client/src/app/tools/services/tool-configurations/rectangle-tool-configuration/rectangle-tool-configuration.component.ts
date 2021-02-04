import { Component } from '@angular/core';
import { RectangleService } from '@app/services/tools/rectangle.service';

@Component({
    selector: 'app-rectangle-tool-configuration',
    templateUrl: './rectangle-tool-configuration.component.html',
    styleUrls: ['./rectangle-tool-configuration.component.scss'],
})
export class RectangleToolConfigurationComponent {
    constructor(public rectangleTool: RectangleService) {}
}
