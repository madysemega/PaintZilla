import { Drawing } from '@common/models/drawing';
export class ValidatorMock {
    static checkAll(drawing: Drawing): void {}
    static checkId(id: string): void {}
    static checkName(name: string): void {}
    static checkDrawing(drawing: string): void {}
    static checkLabels(labels: string[]): void {}
}

