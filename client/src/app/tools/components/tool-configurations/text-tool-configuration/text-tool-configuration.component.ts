import { Component } from '@angular/core';
import { TextService } from '@app/tools/services/tools/text/text.service';

@Component({
    selector: 'app-text-tool-configuration',
    templateUrl: './text-tool-configuration.component.html',
    styleUrls: ['./text-tool-configuration.component.scss'],
})
export class TextToolConfigurationComponent {
    constructor(private service: TextService) {}

    get fontSize(): number {
        return this.service.getFontSize();
    }

    updateFontSize(fontSize: number): void {
        this.service.updateFontSize(fontSize);
    }
}
