import { Component, OnInit } from '@angular/core';
import { OverlaySampleService } from '../overlay-sample.service';
import { BaseDialogComponent } from '../base-dialog.component';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss']
})
export class CustomDialogComponent extends BaseDialogComponent implements OnInit {
  constructor(private overlayService: OverlaySampleService) {
    super();
  }

  ngOnInit(): void {}

  public open() {
    this.overlayService.open(CustomDialogComponent).subscribe(() => {
      console.log('closed');
    });
  }
}
