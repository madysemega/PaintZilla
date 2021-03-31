import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RectangleToolConfigurationComponent } from './rectangle-tool-configuration.component';

describe('RectangleToolConfigurationComponent', () => {
    let component: RectangleToolConfigurationComponent;
    let fixture: ComponentFixture<RectangleToolConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleToolConfigurationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RectangleToolConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
