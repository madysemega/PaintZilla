import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/components/app/app.component';
import { MainPageComponent } from './app/components/main-page/main-page.component';
import { DrawingComponent } from './drawing/components/drawing/drawing.component';
import { SidebarComponent } from './drawing/components/sidebar/sidebar.component';
import { EditorComponent } from './editor/components/editor/editor.component';
import { MaterialModule } from './material.module';
import { EllipseToolConfigurationComponent } from './tools/components/tool-configurations/ellipse-tool-configuration/ellipse-tool-configuration.component';
import { EraserToolConfigurationComponent } from './tools/components/tool-configurations/eraser-tool-configuration/eraser-tool-configuration.component';
import { PencilToolConfigurationComponent } from './tools/components/tool-configurations/pencil-tool-configuration/pencil-tool-configuration.component';
import { RectangleToolConfigurationComponent } from './tools/components/tool-configurations/rectangle-tool-configuration/rectangle-tool-configuration.component';
import { ResizableToolConfigurationComponent } from './tools/components/tool-configurations/resizable-tool-configuration/resizable-tool-configuration.component';
import { ShapeToolConfigurationComponent } from './tools/components/tool-configurations/shape-tool-configuration/shape-tool-configuration.component';

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
    ],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
