import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nestedValue'
})
export class NestedValuePipe implements PipeTransform {
    transform(value: any, col: string, row: any): any {
        if (!row || !col) {
			return value;
		}

        return col.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : 'NA'), row);
    }
}
