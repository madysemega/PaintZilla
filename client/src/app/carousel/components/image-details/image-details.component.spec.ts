import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MaterialModule } from '@app/material.module';
import { ImageDetailsComponent } from './image-details.component';

describe('ImageDetailsComponent', () => {
    let component: ImageDetailsComponent;
    let fixture: ComponentFixture<ImageDetailsComponent>;

    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ImageDetailsComponent],
            providers: [{ provide: Router, useValue: routerSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('loadImage() should navigate to /editor/:imageId', () => {
        const IMAGE_ID = '1234567890';

        component.data.id = IMAGE_ID;
        component.loadImage();

        expect(routerSpy.navigate).toHaveBeenCalledWith([`/editor/${IMAGE_ID}`]);
    });
});
