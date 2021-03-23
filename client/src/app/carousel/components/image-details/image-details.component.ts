import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Vec2 } from '@app/app/classes/vec2';
import { Drawing } from '@common/models/drawing';

@Component({
    selector: 'app-image-details',
    templateUrl: './image-details.component.html',
    styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent {
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

    constructor(private domSanitizer: DomSanitizer, private router: Router) {
        this.delete = new EventEmitter();
    }
    @Input() data: Drawing = {
        id: '',
        name: '',
        drawing: '',
        labels: [],
    };

    @Output() delete: EventEmitter<string>;

    imageContainerWidth: number = 150;
    imageContainerHeight: number = 150;

    loadImage(): void {
        this.router.navigate([`/editor/${this.data.id}`]);
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
}
