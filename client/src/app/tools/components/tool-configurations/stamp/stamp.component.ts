import { Component } from '@angular/core';
import { StampService } from '@app/tools/services/tools/stamp.service';

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent {
    info: string = "Taille de l'étampe";
    infoAngle: string = "Angle d'orientation";
    constructor(public stampTool: StampService) {}
    get imageSize(): number {
        return this.stampTool.imageSize;
    }
    get angle(): number {
        return this.stampTool.degree;
    }
}
