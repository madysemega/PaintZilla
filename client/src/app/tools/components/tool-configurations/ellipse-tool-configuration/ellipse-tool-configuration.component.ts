import { Component } from '@angular/core';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';

@Component({
    selector: 'app-ellipse-tool-configuration',
    templateUrl: './ellipse-tool-configuration.component.html',
    styleUrls: ['./ellipse-tool-configuration.component.scss'],
})
export class EllipseToolConfigurationComponent {
    constructor(public ellipseTool: EllipseService) {}
}
