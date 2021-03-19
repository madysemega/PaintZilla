import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(private resizingService: ResizingService, public dialog: MatDialog) {}

    openCarousel(): void {
        this.dialog.open(ImageNavigationComponent, { panelClass: 'custom-modalbox' });        
    }

    resetCanvasDimensions(): void {
        this.resizingService.resetCanvasDimensions();
    }
}
