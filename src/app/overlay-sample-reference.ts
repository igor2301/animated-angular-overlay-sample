import { OverlayRef } from '@angular/cdk/overlay';
import { BaseDialogComponent } from './base-dialog.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { OverlaySampleConfig } from './overlay-sample-config';

export class OverlaySampleRef {
  componentInstance: BaseDialogComponent;

  private subscription = new Subscription();

  backdropClick = new EventEmitter<MouseEvent>();
  closed = new EventEmitter<any>();

  constructor(private overlayRef: OverlayRef, private config: OverlaySampleConfig) {
    const closedSubscription = this.closed.subscribe(() => {
      closedSubscription.unsubscribe();
      this.subscription.unsubscribe();
    });

    const backdropClickSubscription = overlayRef.backdropClick().subscribe((event) => {
      backdropClickSubscription.unsubscribe();
      this.backdropClick.emit(event);
      if (!config.disableClose) {
        this.close();
      }
    });
  }

  public close(): void {
    this.subscription.add(
      this.componentInstance.animationStateChanged
        .pipe(filter((event) => event.phaseName === 'start' && event.toState === 'leave'))
        .subscribe(() => {
          this.overlayRef.detachBackdrop();
        })
    );

    this.subscription.add(
      this.componentInstance.animationStateChanged
        .pipe(filter((event) => event.phaseName === 'done' && event.toState === 'leave'))
        .subscribe(() => {
          this.overlayRef.dispose();
          this.componentInstance = null;
          this.closed.emit();
        })
    );

    this.componentInstance.startExitAnimation();
  }
}
