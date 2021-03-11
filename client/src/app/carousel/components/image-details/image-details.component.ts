import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CarouselCardInformation } from '@app/carousel/data/carousel-card-information';

@Component({
    selector: 'app-image-details',
    templateUrl: './image-details.component.html',
    styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent {
    @Input() data: CarouselCardInformation = {
        name: '',
        image: '',
        labels: [],
    };

    constructor(private domSanitizer: DomSanitizer) {}

    get imageSrc(): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.image);
    }
}
