import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NeighbouringIndices } from '@app/carousel/data/neighbouring-indices';
import { Drawing } from '@common/models/drawing';

@Component({
    selector: 'app-image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.scss'],
})
export class ImageCarouselComponent {
    drawingsToDisplay: Drawing[];
    @Input() set drawings(drawings: Drawing[]) {
        this.drawingsToDisplay = drawings;
        this.refresh();
    }

    @Output() deleteImage: EventEmitter<string>;

    leftImage: Drawing;
    rightImage: Drawing;
    centerImage: Drawing;

    private centerIndex: number;

    constructor() {
        this.drawingsToDisplay = [];
        this.centerIndex = 1;
        this.deleteImage = new EventEmitter();
    }

    handleDeleteImageEvent(imageId: string): void {
        this.deleteImage.emit(imageId);
        this.refresh();
    }

    @HostListener('window:keyup', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowRight':
                this.rotateRight();
                break;

            case 'ArrowLeft':
                this.rotateLeft();
                break;
        }
    }

    rotateRight(): void {
        const neighbouringIndices = this.getNeighbouringIndices(this.centerIndex + 1);
        this.refreshImages(neighbouringIndices);
    }

    rotateLeft(): void {
        const neighbouringIndices = this.getNeighbouringIndices(this.centerIndex - 1);
        this.refreshImages(neighbouringIndices);
    }

    private refresh(): void {
        const neighbouringIndices = this.getNeighbouringIndices(this.centerIndex);
        this.refreshImages(neighbouringIndices);
    }

    private refreshImages(neighbouringIndices: NeighbouringIndices): void {
        if (this.drawingsToDisplay.length > 0) {
            this.leftImage = this.drawingsToDisplay[neighbouringIndices.left];
            this.centerImage = this.drawingsToDisplay[neighbouringIndices.center];
            this.rightImage = this.drawingsToDisplay[neighbouringIndices.right];

            this.centerIndex = neighbouringIndices.center;
        }
    }

    private getNeighbouringIndices(index: number): NeighbouringIndices {
        return {
            left: this.getRotatedIndex(index - 1),
            center: this.getRotatedIndex(index),
            right: this.getRotatedIndex(index + 1),
        };
    }

    private getRotatedIndex(index: number): number {
        return (index < 0 ? this.drawingsToDisplay.length : 0) + (index % this.drawingsToDisplay.length);
    }
}
