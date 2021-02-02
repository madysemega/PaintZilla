import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColourPaletteComponent } from './components/colour-selector/colour-palette/colour-palette.component';
import { ColourSelectorComponent } from './components/colour-selector/colour-selector.component';
import { ColourSliderComponent } from './components/colour-selector/colour-slider/colour-slider.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent,
         MainPageComponent, ColourSelectorComponent, ColourSliderComponent, ColourPaletteComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
