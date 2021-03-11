import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CarouselCardInformation } from '@app/carousel/data/carousel-card-information';

@Component({
    selector: 'app-image-details',
    templateUrl: './image-details.component.html',
    styleUrls: ['./image-details.component.scss'],
})
export class ImageDetailsComponent implements OnInit {
    @Input() data: CarouselCardInformation;

    constructor(private domSanitizer: DomSanitizer) {}

    get imageSrc(): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(this.data.image);
    }

    ngOnInit(): void {}
}
