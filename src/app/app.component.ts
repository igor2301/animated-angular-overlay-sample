import { Component } from '@angular/core';
import { OverlaySampleService } from './overlay-sample.service';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'overlay-sample';

  constructor(private overlayService: OverlaySampleService) {}

  public open() {
    this.overlayService.open(CustomDialogComponent).subscribe(() => {
      console.log('closed');
    });
  }
}
