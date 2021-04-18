import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { sleep } from '@app/app/classes/sleep';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { AutomaticSavingService } from '@app/file-options/automatic-saving/automatic-saving.service';
import { KeyboardService } from '@app/keyboard/keyboard.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(
        private resizingService: ResizingService,
        public dialog: MatDialog,
        keyboardService: KeyboardService,
        private automaticSavingService: AutomaticSavingService,
    ) {
        keyboardService.context = 'main-page';
    }

    openCarousel(): void {
        this.dialog.open(ImageNavigationComponent, { panelClass: 'custom-modalbox' });
    }

    async resetCanvasDimensions(): Promise<void> {
        this.resizingService.resetCanvasDimensions();
        await sleep();
        this.automaticSavingService.saveDrawingLocally();
    }

    drawingIsSavedLocally(): boolean {
        return localStorage.length !== 0;
    }

    loadMostRecentDrawing(): void {
        this.automaticSavingService.loadMostRecentDrawing();
    }
}
