import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../../_services';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less']
})
export class FileUploadComponent {

  @Input() requiredFileType!: string;

  @Output() selectFiles = new EventEmitter<string>();
  filesToUpload: Array<File> = [];
  constructor(private uploadService: UploadService) { }

  onFileSelected(event: any) {
   
    const formData: any = new FormData();
    const files: Array<File> = <Array<File>>event.target.files;
    

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
   
    this.uploadService.uploadImages(formData).subscribe((imageData) => {
      this.selectFiles.emit(imageData);
    })
  }
}
