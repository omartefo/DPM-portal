import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
	name: 'formatDisplayValue'
})
export class FormatDisplayValue implements PipeTransform {
	transform(value: string): string {
		if (!value) {
			return '';
		}

		return value.replace(/_/g, ' '); // Replace underscores with spaces
	}
}
