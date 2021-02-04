import { Component } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-pencil-tool-configuration',
    templateUrl: './pencil-tool-configuration.component.html',
    styleUrls: ['./pencil-tool-configuration.component.scss'],
})
export class PencilToolConfigurationComponent {
    constructor(public pencilService: PencilService) {}
}
