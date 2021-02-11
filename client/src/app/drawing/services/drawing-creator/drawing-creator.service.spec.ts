import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DrawingCreatorService } from './drawing-creator.service';

fdescribe('DrawingCreatorService', () => {
    let service: DrawingCreatorService;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        service = TestBed.inject(DrawingCreatorService);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        }).compileComponents();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
