import { Component } from '@angular/core';
import { HistoryService } from '@app/history/service/history.service';

@Component({
    selector: 'app-history-controls',
    templateUrl: './history-controls.component.html',
    styleUrls: ['./history-controls.component.scss'],
})
export class HistoryControlsComponent {
    constructor(public history: HistoryService) {}
}
