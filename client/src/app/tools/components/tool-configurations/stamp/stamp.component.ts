import { Component } from '@angular/core';
import { StampService } from '@app/tools/services/tools/stamp.service';

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent {
    constructor(public stampTool: StampService) {}
}
