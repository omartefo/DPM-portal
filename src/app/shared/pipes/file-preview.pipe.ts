import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
	name: 'filePreview',
    standalone: true
})
export class FilePreviewPipe implements PipeTransform {
	transform(url: string): string {
		const fileExtension = url?.split('.').pop();

		switch (fileExtension) {
			case 'pdf':
				return '/assets/images/pdf_img.jpg';

			case 'docx':
			case 'doc':
				return '/assets/images/word_img.png';

			case 'xlsx': case 'csv': case 'xls': case 'xlsm': case 'xlsb': case 'xlt': case 'xltx': case 'xltm': case 'xml':
				return '/assets/images/excel_img.png';

			default:
				return url;
		}
	}
}
