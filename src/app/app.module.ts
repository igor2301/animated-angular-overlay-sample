import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { OverlaySampleService } from './overlay-sample.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';

@NgModule({
  declarations: [AppComponent, CustomDialogComponent],
  imports: [BrowserModule, OverlayModule, BrowserAnimationsModule],
  providers: [OverlaySampleService],
  bootstrap: [AppComponent]
})
export class AppModule {}
