import { Injectable, OnDestroy, Type } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { BaseDialogComponent } from './base-dialog.component';
import { OverlaySampleRef } from './overlay-sample-reference';
import { Subscription } from 'rxjs';

@Injectable()
export class OverlaySampleService implements OnDestroy {
  private subscription = new Subscription();

  constructor(private overlay: Overlay) {}

  public open<T extends BaseDialogComponent>(comp: Type<T>) {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const config = new OverlayConfig({
      positionStrategy,
      hasBackdrop: true
    });
    const overlayRef = this.overlay.create(config);
    const samplePortal = new ComponentPortal(comp);

    const componentRef = overlayRef.attach(samplePortal);

    const reference = new OverlaySampleRef(overlayRef);
    reference.componentInstance = componentRef.instance;

    this.subscription.add(
      overlayRef.backdropClick().subscribe(() => {
        reference.close();
      })
    );

    return reference.closed;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
