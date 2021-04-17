import { Component } from '@angular/core';
import { PolygonService } from '@app/tools/services/tools/polygon/polygon.service';

@Component({
    selector: 'app-polygon',
    templateUrl: './polygon.component.html',
    styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent {
    constructor(public polygonTool: PolygonService) {}
}
