import { Component } from '@angular/core';
import { LineService } from '@app/tools/services/tools/line.service';

@Component({
    selector: 'app-line-tool-configuration',
    templateUrl: './line-tool-configuration.component.html',
    styleUrls: ['./line-tool-configuration.component.scss'],
})
export class LineToolConfigurationComponent {
    constructor(public lineTool: LineService) {}
}
