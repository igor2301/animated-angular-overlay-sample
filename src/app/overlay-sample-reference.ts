import { OverlayRef } from '@angular/cdk/overlay';
import { BaseDialogComponent } from './base-dialog.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class OverlaySampleRef {
  public componentInstance: BaseDialogComponent;
  private subscription = new Subscription();
  public closed = new EventEmitter();

  constructor(private overlayRef: OverlayRef) {
    this.closed.subscribe(() => {
      this.subscription.unsubscribe();
      this.closed.unsubscribe();
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
