import { Component, OnInit } from '@angular/core';
import { CarouselCardInformation } from '@app/carousel/data/carousel-card-information';
import { NeighbouringIndices } from '@app/carousel/data/neighbouring-indices';

@Component({
    selector: 'app-image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.scss'],
})
export class ImageCarouselComponent implements OnInit {
    images: CarouselCardInformation[];

    leftImage: CarouselCardInformation;
    rightImage: CarouselCardInformation;
    centerImage: CarouselCardInformation;

    private centerIndex: number;

    constructor() {
        this.images = [{ name: 'first' }, { name: 'second' }, { name: 'third' }, { name: 'fourth' }, { name: 'Fifth' }];

        this.centerIndex = 1;

        const neighbouringIndices = this.getNeighbouringIndices(this.centerIndex);
        this.refreshImages(neighbouringIndices);
    }

    rotateRight(): void {
        const neighbouringIndices = this.getNeighbouringIndices(this.centerIndex + 1);
        this.refreshImages(neighbouringIndices);
    }

    rotateLeft(): void {
        const neighbouringIndices = this.getNeighbouringIndices(this.centerIndex - 1);
        this.refreshImages(neighbouringIndices);
    }

    private refreshImages(neighbouringIndices: NeighbouringIndices): void {
        this.leftImage = this.images[neighbouringIndices.left];
        this.centerImage = this.images[neighbouringIndices.center];
        this.rightImage = this.images[neighbouringIndices.right];
    }

    private getNeighbouringIndices(index: number): NeighbouringIndices {
        // console.log(`left: ${this.getRotatedIndex(index - 1)}, center: ${index}, right: ${this.getRotatedIndex(index + 1)}`);
        return {
            left: this.getRotatedIndex(index - 1),
            center: index,
            right: this.getRotatedIndex(index + 1),
        };
    }

    private getRotatedIndex(index: number): number {
        return index % this.images.length;
    }

    ngOnInit(): void {}
}
