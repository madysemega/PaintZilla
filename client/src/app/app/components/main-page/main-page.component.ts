import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(private resizingService: ResizingService, public dialog: MatDialog, keyboardService: KeyboardService) {
        keyboardService.context = 'main-page';
    }

    openCarousel(): void {
        this.dialog.open(ImageNavigationComponent, { panelClass: 'custom-modalbox' });
    }

    resetCanvasDimensions(): void {
        this.resizingService.resetCanvasDimensions();
    }
}
