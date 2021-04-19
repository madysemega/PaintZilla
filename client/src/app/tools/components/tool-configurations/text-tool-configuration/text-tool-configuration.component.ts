import { Component, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatSlider } from '@angular/material/slider';
import { TextService } from '@app/tools/services/tools/text/text.service';

@Component({
    selector: 'app-text-tool-configuration',
    templateUrl: './text-tool-configuration.component.html',
    styleUrls: ['./text-tool-configuration.component.scss'],
})
export class TextToolConfigurationComponent {
    @ViewChild('fontSize') fontSizeSlider: MatSlider;
    @ViewChild('fontName') fontNameSelect: MatSelect;

    constructor(private service: TextService) {
        setTimeout(() => {
            this.fontSizeSlider.value = this.service.getFontSize();
            this.fontNameSelect.value = this.service.getFontName();
        });
    }

    get alignment(): CanvasTextAlign {
        return this.service.getAlignment();
    }

    set alignment(value: CanvasTextAlign) {
        this.service.updateAlignment(value);
    }

    get fontIsItalic(): boolean {
        return this.service.getFontIsItalic();
    }

    updateFontIsItalic(value: boolean): void {
        this.service.updateFontIsItalic(value);
    }

    get fontIsBold(): boolean {
        return this.service.getFontIsBold();
    }

    updateFontIsBold(value: boolean): void {
        this.service.updateFontIsBold(value);
    }

    get fontName(): string {
        return this.service.getFontName();
    }

    updateFontName(name: string): void {
        this.service.updateFontName(name);
    }

    blurFontNameSelect(): void {
        this.fontNameSelect._elementRef.nativeElement.blur();
    }

    get fontSize(): number {
        return this.service.getFontSize();
    }

    updateFontSize(fontSize: number): void {
        this.service.updateFontSize(fontSize);
        this.fontSizeSlider._elementRef.nativeElement.blur();
    }
}
