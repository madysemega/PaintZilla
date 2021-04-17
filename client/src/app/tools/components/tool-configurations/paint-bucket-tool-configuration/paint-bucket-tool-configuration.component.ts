import { Component } from '@angular/core';
import { PaintBucketService } from '@app/tools/services/tools/paint-bucket.service';
export const INITIAL_TOLERANCE = 5;
@Component({
    selector: 'app-paint-bucket-tool-configuration',
    templateUrl: './paint-bucket-tool-configuration.component.html',
    styleUrls: ['./paint-bucket-tool-configuration.component.scss'],
})
export class PaintBucketToolConfigurationComponent {
    tolerance: number;
    constructor(private paintBucketService: PaintBucketService) {
        this.onToleranceChange(INITIAL_TOLERANCE);
    }

    onToleranceChange(tolerance: number): void {
        this.tolerance = tolerance;
        this.paintBucketService.tolerance = tolerance;
    }
}
