import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TenderDocumentSignal } from 'app/models';


@Component({
  selector: 'tender-document',
  templateUrl: './tender-document.component.html',
  styleUrls: ['./tender-document.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class TenderDocumentComponent
{
    @Input() title: string;
    @Input() documentValue: string;
    @Input() key: 'document1' | 'document2' | 'document3';

    @Output() signal = new EventEmitter<TenderDocumentSignal>();
	@ViewChild('uploadDocField') uploadDocField: ElementRef<HTMLInputElement>;

	allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];

    constructor() { }

    onRemoveTenderDocument(): void {
        const ev: TenderDocumentSignal = { type: 'ResetDocument', value: null, key: this.key };
        this.signal.emit(ev);
    }

    onFileChange(): void {
        const file = this.uploadDocField.nativeElement.files[0];
        const ev: TenderDocumentSignal = { type: 'UploadDocument', value: file, key: this.key };
        this.signal.emit(ev);
    }
}
