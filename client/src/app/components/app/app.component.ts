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
            'pencil-with-line',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/pencil-with-line.svg')
        );
    }
}
