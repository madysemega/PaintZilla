import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app/components/app/app.component';
import { MainPageComponent } from '@app/app/components/main-page/main-page.component';
import { DrawingComponent } from '@app/drawing/components/drawing/drawing.component';
import { SidebarComponent } from '@app/drawing/components/sidebar/sidebar.component';
import { EditorComponent } from '@app/editor/components/editor/editor.component';
import { ColourPaletteComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-palette/colour-palette.component';
import { ColourSelectorComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-selector.component';
import { ColourSliderComponent } from '@app/tools/components/tool-configurations/colour-selector/colour-slider/colour-slider.component';
import { EllipseToolConfigurationComponent } from '@app/tools/components/tool-configurations/ellipse-tool-configuration/ellipse-tool-configuration.component';
import { PencilToolConfigurationComponent } from '@app/tools/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { RectangleToolConfigurationComponent } from '@app/tools/components/tool-configurations/rectangle-tool-configuration/rectangle-tool-configuration.component';
import { ResizableToolConfigurationComponent } from '@app/tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from '@app/tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';
import { MaterialModule } from './material.module';
import { EraserToolConfigurationComponent } from './tools/components/tool-configurations/eraser-tool-configuration/eraser-tool-configuration.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        EllipseToolConfigurationComponent,
        PencilToolConfigurationComponent,
        EraserToolConfigurationComponent,
        RectangleToolConfigurationComponent,
        ShapeToolConfigurationComponent,
        ResizableToolConfigurationComponent,
        PencilToolConfigurationComponent,
        ColourPaletteComponent,
        ColourSelectorComponent,
        ColourSliderComponent,
    ],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule],

    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
