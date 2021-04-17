import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HotkeyModule } from 'angular2-hotkeys';
import { LassoSelectionComponent } from './lasso-selection.component';

describe('LassoSelectionComponent', () => {
    let component: LassoSelectionComponent;
    let fixture: ComponentFixture<LassoSelectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HotkeyModule.forRoot()],
            declarations: [LassoSelectionComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LassoSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
