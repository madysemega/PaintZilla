import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { ImageCarouselComponent } from './image-carousel.component';

// tslint:disable: no-any
// tslint:disable: no-string-literal
describe('ImageCarouselComponent', () => {
    let component: ImageCarouselComponent;
    let fixture: ComponentFixture<ImageCarouselComponent>;
    let getNeightbouringIndicesSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule],
            declarations: [ImageCarouselComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageCarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        getNeightbouringIndicesSpy = spyOn<any>(component, 'getNeighbouringIndices').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('rotate right, should get neighbouring indices with index to the right of the current one', () => {
        const expectedIndex: number = component['centerIndex'] + 1;
        component.rotateRight();
        expect(getNeightbouringIndicesSpy).toHaveBeenCalledWith(expectedIndex);
    });

    it('rotate left, should get neighbouring indices with index to the right of the current one', () => {
        const expectedIndex: number = component['centerIndex'] - 1;
        component.rotateLeft();
        expect(getNeightbouringIndicesSpy).toHaveBeenCalledWith(expectedIndex);
    });
});
