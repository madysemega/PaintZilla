import { Component } from '@angular/core';
import { SprayService } from '@app/tools/services/tools/spray-service';

@Component({
    selector: 'app-spray-tool-configuration',
    templateUrl: './spray-tool-configuration.component.html',
    styleUrls: ['./spray-tool-configuration.component.scss'],
})
export class SprayToolConfigurationComponent {
    static readonly DEFAULT_DROP_DIAMETER: number = 5;
    static readonly DEFAULT_JET_DIAMETER: number = 50;
    static readonly DEFAULT_NB_DROPS_PER_SECONDS: number = 50;

    dropDiameter: number;
    jetDiameter: number;
    nbDropsPerSecond: number;

    constructor(public sprayService: SprayService) {
        this.onDropDiameterChange(SprayToolConfigurationComponent.DEFAULT_DROP_DIAMETER);
        this.onJetDiameterChange(SprayToolConfigurationComponent.DEFAULT_JET_DIAMETER);
        this.onNbDropsPerSecondChange(SprayToolConfigurationComponent.DEFAULT_NB_DROPS_PER_SECONDS);
    }

    onDropDiameterChange(dropDiameter: number): void {
        this.dropDiameter = dropDiameter;
        this.sprayService.onRadiusChanged(dropDiameter / 2);
    }

    onJetDiameterChange(jetDiameter: number): void {
        this.jetDiameter = jetDiameter;
        this.sprayService.jetDiameter = jetDiameter;
    }

    onNbDropsPerSecondChange(nbDropsPerSecond: number): void {
        this.nbDropsPerSecond = nbDropsPerSecond;
        this.sprayService.nbDropsPerSecond = nbDropsPerSecond;
    }
}
