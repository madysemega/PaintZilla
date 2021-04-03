import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { TextToolConfigurationComponent } from './text-tool-configuration.component';


describe('TextToolConfigurationComponent', () => {
  let component: TextToolConfigurationComponent;
  let fixture: ComponentFixture<TextToolConfigurationComponent>;

  let hotkeysServiceStub: jasmine.SpyObj<HotkeysService>;

  beforeEach(async(() => {
    hotkeysServiceStub = jasmine.createSpyObj('HotkeysService', ['add']);

    TestBed.configureTestingModule({
      imports: [HotkeyModule.forRoot()],
      declarations: [ TextToolConfigurationComponent ],
      providers: [{ provide: HotkeysService, useValue: hotkeysServiceStub }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextToolConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
