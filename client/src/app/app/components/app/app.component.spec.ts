import { HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from '@app/app/components/main-page/main-page.component';
import { ColourService } from '@app/colour-picker/services/colour/colour.service';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { SidebarComponent } from '@app/drawing/components/sidebar/sidebar.component';
import { DrawingCreatorService } from '@app/drawing/services/drawing-creator/drawing-creator.service';
import { DrawingService } from '@app/drawing/services/drawing-service/drawing.service';
import { ResizingService } from '@app/drawing/services/resizing-service/resizing.service';
import { EditorComponent } from '@app/editor/components/editor/editor.component';
import { KeyboardService } from '@app/keyboard/keyboard.service';
import { MaterialModule } from '@app/material.module';
import { EllipseToolConfigurationComponent } from '@app/tools/components/tool-configurations/ellipse-tool-configuration/ellipse-tool-configuration.component';
import { LineToolConfigurationComponent } from '@app/tools/components/tool-configurations/line-tool-configuration/line-tool-configuration.component';
import { RectangleToolConfigurationComponent } from '@app/tools/components/tool-configurations/rectangle-tool-configuration/rectangle-tool-configuration.component';
import { IndexService } from '@app/tools/services/index/index.service';
import { ToolSelectorService } from '@app/tools/services/tool-selector/tool-selector.service';
import { EllipseService } from '@app/tools/services/tools/ellipse-service';
import { EraserService } from '@app/tools/services/tools/eraser-service';
import { LineService } from '@app/tools/services/tools/line.service';
import { PencilService } from '@app/tools/services/tools/pencil-service';
import { PipetteService } from '@app/tools/services/tools/pipette-service';
import { RectangleService } from '@app/tools/services/tools/rectangle.service';
import { SprayService } from '@app/tools/services/tools/spray-service';
import { HotkeyModule } from 'angular2-hotkeys';
import { AppComponent } from './app.component';

// tslint:disable: no-any
describe('AppComponent', () => {
    @Component({
        selector: 'mat-icon',
        template: '<span></span>',
    })
    class MockMatIconComponent {
        @Input() svgIcon: any;
        @Input() fontSet: any;
        @Input() fontIcon: any;
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, MaterialModule, HttpClientModule, BrowserAnimationsModule, HotkeyModule.forRoot()],
            declarations: [
                AppComponent,
                MainPageComponent,
                EditorComponent,
                DrawingComponent,
                SidebarComponent,
                EllipseToolConfigurationComponent,
                LineToolConfigurationComponent,
                RectangleToolConfigurationComponent,
            ],
            providers: [
                IndexService,
                ResizingService,
                PencilService,
                PipetteService,
                SprayService,
                DrawingService,
                DrawingCreatorService,
                ToolSelectorService,
                ColourService,
                EllipseService,
                EraserService,
                LineService,
                RectangleService,
                KeyboardService,
            ],
        })
            .overrideModule(MatIconModule, {
                remove: {
                    declarations: [MatIcon],
                    exports: [MatIcon],
                },
                add: {
                    declarations: [MockMatIconComponent],
                    exports: [MockMatIconComponent],
                },
            })
            .compileComponents();
    }));

    it('should create the server', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });
});
