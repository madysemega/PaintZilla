import { Component } from '@angular/core';
import { SprayService } from '@app/tools/services/tools/spray-service';

@Component({
    selector: 'app-spray-tool-configuration',
    templateUrl: './spray-tool-configuration.component.html',
    styleUrls: ['./spray-tool-configuration.component.scss'],
})
export class SprayToolConfigurationComponent {
    diameterChange: number = 1;
    numberChange: number = 1;
    constructor(public sprayService: SprayService) {}

    onDiameterPointChange(diameterChange: number): void {
        this.diameterChange=diameterChange;
        this.sprayService.diameterDraw = diameterChange;
    }
    onNumberPointChange(numberChange: number): void {
        this.numberChange=numberChange;
        this.sprayService.numberPoints = numberChange;
    }
}
