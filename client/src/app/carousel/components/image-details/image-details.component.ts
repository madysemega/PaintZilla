import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Vec2 } from '@app/app/classes/vec2';
import { DiscardChangesModalComponent } from '@app/carousel/components/discard-changes-modal/discard-changes-modal.component';
import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from '@app/carousel/components/image-details/image-details.constants';
import { ImageNavigationComponent } from '@app/carousel/components/image-navigation/image-navigation.component';
import { DiscardChangesModalData } from '@app/carousel/interfaces/discard-changes-modal-data';
import { HistoryService } from '@app/history/service/history.service';
import { Drawing } from '@common/models/drawing';

@Component({
    selector: 'app-image-details',
    templateUrl: './image-details.component.html',
    styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent {
    @Input() data: Drawing = {
        id: '',
        name: '',
        drawing: '',
        labels: [],
    };

    @Input() dialogRef: MatDialogRef<ImageNavigationComponent>;

    @Output() delete: EventEmitter<string> = new EventEmitter();

    imageContainerWidth: number = CONTAINER_WIDTH;
    imageContainerHeight: number = CONTAINER_HEIGHT;

    constructor(private domSanitizer: DomSanitizer, private router: Router, private history: HistoryService, private dialog: MatDialog) {}

    get imageSrc(): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.drawing);
    }

    get imageWidth(): number {
        const imageDimensions = this.getRealImageDimensions();
        const isWidthGreaterThanHeight = imageDimensions.x > imageDimensions.y;

        return isWidthGreaterThanHeight ? this.imageContainerWidth : (this.imageContainerHeight / imageDimensions.y) * imageDimensions.x;
    }

    get imageHeight(): number {
        const imageDimensions = this.getRealImageDimensions();
        const isHeightGreaterThanWidth = imageDimensions.x < imageDimensions.y;

        return isHeightGreaterThanWidth ? this.imageContainerHeight : (this.imageContainerWidth / imageDimensions.x) * imageDimensions.y;
    }

    private discardChangesModalData: DiscardChangesModalData = {
        confirmCallback: () => this.navigateToImage(),
    };

    loadImage(): void {
        if (this.history.canUndo() || this.history.canRedo()) {
            this.dialog.open(DiscardChangesModalComponent, {
                panelClass: 'custom-modalbox',
                data: this.discardChangesModalData,
            });
        } else {
            this.navigateToImage();
        }
    }

    deleteImage(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.delete.emit(this.data.id);
    }

    getRealImageDimensions(): Vec2 {
        const image = new Image();
        image.src = this.data.drawing;

        return { x: image.width, y: image.height };
    }

    navigateToImage(): void {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/editor/${this.data.id}`]);
        });
        this.dialogRef.close();
    }
}
