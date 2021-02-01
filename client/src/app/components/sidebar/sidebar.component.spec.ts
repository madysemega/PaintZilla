import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';

// tslint:disable:no-any
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let keyboard1Event: KeyboardEvent;
    let keyboardShiftEvent: KeyboardEvent;

    keyboard1Event = {
        key: '1',
    } as KeyboardEvent;

    keyboardShiftEvent = {
        key: 'Shift',
    } as KeyboardEvent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set selectedToolName to new toolName when calling selectTool', () => {
        const toolName = 'rectangle';
        component.selectTool('rectangle');
        expect(component.selectedToolName).toBe(toolName);
    });

    it('should set selectedToolName to new toolName when calling pressing a key corresponding to a tool', () => {
        const toolName = 'rectangle';
        component.onKeyDown(keyboard1Event);
        expect(component.selectedToolName).toBe(toolName);
    });

    it('should not set selectedToolName to new toolName when calling pressing a key corresponding to a tool', () => {
        const toolName = component.selectedToolName;
        component.onKeyDown(keyboardShiftEvent);
        expect(component.selectedToolName).toEqual(toolName);
    });

    it('should return the display name of a tool when getDisplayName is called with a valid tool name', () => {
        const expectedDisplayName = 'Crayon';
        const obtainedDisplayName: string = component.getDisplayName('pencil');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it("should return '<Outil inconnu>' when getDisplayName is called with an invalid tool name", () => {
        const expectedDisplayName = '<Outil inconnu>';
        const obtainedDisplayName: string = component.getDisplayName('invalid tool');
        expect(obtainedDisplayName).toBe(expectedDisplayName);
    });

    it('getIconName(toolName) should return the correct icon name if given toolName is valid', () => {
        const expectedIconName = 'pencil';
        const obtainedIconName: string = component.getIconName('pencil');
        expect(obtainedIconName).toBe(expectedIconName);
    });

    it("getIconName(toolName) should return 'unknown' if given toolName is invalid", () => {
        const expectedIconName = 'unknown';
        const obtainedIconName: string = component.getIconName('invalid tool');
        expect(obtainedIconName).toBe(expectedIconName);
    });
});
