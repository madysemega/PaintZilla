import { Component, OnInit } from '@angular/core';
import { PolygonService } from '@app/tools/services/tools/polygon.service';

@Component({
    selector: 'app-polygon',
    templateUrl: './polygon.component.html',
    styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent implements OnInit {
    constructor(public polygonTool: PolygonService) {}

    ngOnInit(): void {}
}
