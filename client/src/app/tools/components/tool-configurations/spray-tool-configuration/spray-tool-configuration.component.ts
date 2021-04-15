import { Component } from '@angular/core';
import * as Constants from '@app/tools/components/tool-configurations/spray-tool-configuration/spray-tool-configuration.component.constant';
import { SprayService } from '@app/tools/services/tools/spray-service';
@Component({
    selector: 'app-spray-tool-configuration',
    templateUrl: './spray-tool-configuration.component.html',
    styleUrls: ['./spray-tool-configuration.component.scss'],
})
export class SprayToolConfigurationComponent {
    dropDiameter: number;
    jetDiameter: number;
    nbDropsPerSecond: number;

    constructor(public sprayService: SprayService) {
        this.onDropDiameterChange(Constants.DEFAULT_DROP_DIAMETER);
        this.onJetDiameterChange(Constants.DEFAULT_JET_DIAMETER);
        this.onNbDropsPerSecondChange(Constants.DEFAULT_NB_DROPS_PER_SECONDS);
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
