import { Drawing } from '../../models/drawing';
import * as RegularExpressions from '../regular.expressions';

export class Validator {
    static checkId(id: string): void {
        if (!this.isValidId(id)) {
            throw new Error('Invalid id provided');
        }
    }

    static checkName(name: string): void {
        if (!this.isValidName(name)) {
            throw new Error('Invalid name provided');
        }
    }

    static checkDrawing(drawing: string): void {
        if (!this.isValidDrawing(drawing)) {
            throw new Error('Invalid drawing provided');
        }
    }

    static checkLabels(labels: string[]): void {
        if (!this.areValidLabels(labels)) {
            throw new Error('Invalid label(s) provided');
        }
    }

    static checkAll(drawing: Drawing): void {
        this.checkId(drawing.id);
        this.checkName(drawing.name);
        this.checkDrawing(drawing.drawing);
        this.checkLabels(drawing.labels);
    }

    static isValidId(id: string): boolean {
        return RegularExpressions.MONGO_ID_REGEX.test(id);
    }

    static isValidName(name: string): boolean {
        return RegularExpressions.NAME_REGEX.test(name);
    }

    static isValidDrawing(drawing: string): boolean {
        return RegularExpressions.BASE_64_REGEX.test(drawing);
    }

    static areValidLabels(labels: string[]): boolean {
        return labels.every((label: string) => RegularExpressions.LABEL_REGEX.test(label));
    }
}
