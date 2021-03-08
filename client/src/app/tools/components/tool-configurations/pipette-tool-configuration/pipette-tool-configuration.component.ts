import { Component } from '@angular/core';
import { PipetteService } from '@app/tools/services/tools/pipette-service';

@Component({
    selector: 'app-pipette-tool-configuration',
    templateUrl: './pipette-tool-configuration.component.html',
    styleUrls: ['./pipette-tool-configuration.component.scss'],
})
export class PipetteToolConfigurationComponent {
    constructor(public pipetteService: PipetteService) {}
}
