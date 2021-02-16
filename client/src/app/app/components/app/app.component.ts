import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private iconRegistryService: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.iconRegistryService.addSvgIcon('pencil', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/pencil.svg'));
        this.iconRegistryService.addSvgIcon('eraser', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/eraser.svg'));
        this.iconRegistryService.addSvgIcon(
            'pencil-with-line',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/pencil-with-line.svg'),
        );
        this.iconRegistryService.addSvgIcon(
            'ellipse-contoured',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/ellipse-contoured.svg'),
        );
        this.iconRegistryService.addSvgIcon('ellipse-filled', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/ellipse-filled.svg'));
        this.iconRegistryService.addSvgIcon(
            'ellipse-contoured-and-filled',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/ellipse-contoured-and-filled.svg'),
        );
        this.iconRegistryService.addSvgIcon(
            'rectangle-contoured',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/rectangle-contoured.svg'),
        );
        this.iconRegistryService.addSvgIcon(
            'rectangle-filled',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/rectangle-filled.svg'),
        );
        this.iconRegistryService.addSvgIcon(
            'rectangle-contoured-and-filled',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/rectangle-contoured-and-filled.svg'),
        );
        this.iconRegistryService.addSvgIcon(
            'line-with-joints',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/line-with-joints.svg'),
        );
        this.iconRegistryService.addSvgIcon(
            'line-without-joints',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/line-without-joints.svg'),
        );
        this.iconRegistryService.addSvgIcon('history-24px', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/history-24px.svg'));
        this.iconRegistryService.addSvgIcon('plus-sign', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/plus-sign.svg'));
    }
}
