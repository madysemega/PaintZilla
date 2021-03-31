import { AfterViewInit, Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { TextService } from '@app/tools/services/tools/text/text.service';

@Component({
    selector: 'app-text-tool-configuration',
    templateUrl: './text-tool-configuration.component.html',
    styleUrls: ['./text-tool-configuration.component.scss'],
})
export class TextToolConfigurationComponent implements AfterViewInit {
    private readonly MAX_SIZE = 300;
    private readonly MIN_SIZE = 12;
    private readonly STEP = 12;

    fontSize: number;
    fontSizesAvailable: number[];

    constructor(private service: TextService) {
        this.generateSizes();
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.fontSize = this.MIN_SIZE;
        });
    }

    private generateSizes(): void {
        this.fontSizesAvailable = new Array<number>();

        for (let i = this.MIN_SIZE; i <= this.MAX_SIZE; i += this.STEP) {
            this.fontSizesAvailable.push(i);
        }
    }

    updateFontSize(event: MatSelectChange): void {
        this.service.updateFontSize(event.value);
    }
}
