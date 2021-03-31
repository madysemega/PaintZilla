import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EllipseToolConfigurationComponent } from './ellipse-tool-configuration.component';

describe('EllipseToolConfigurationComponent', () => {
    let component: EllipseToolConfigurationComponent;
    let fixture: ComponentFixture<EllipseToolConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipseToolConfigurationComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipseToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
