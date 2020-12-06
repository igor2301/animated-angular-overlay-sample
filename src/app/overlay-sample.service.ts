import { EventEmitter, Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { BaseDialogComponent } from './base-dialog.component';
import { OverlaySampleRef } from './overlay-sample-reference';
import { OverlaySampleConfig } from './overlay-sample-config';

export const DIALOG_DATA = new InjectionToken('DIALOG_DATA');

@Injectable()
export class OverlaySampleService {
  openDialogs: OverlaySampleRef[] = [];
  afterOpened = new EventEmitter<OverlaySampleRef>();

  constructor(private overlay: Overlay, private parentInjector: Injector) {}

  open<T extends BaseDialogComponent>(comp: Type<T>, dialogConfig?: OverlaySampleConfig) {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const config = new OverlayConfig({
      positionStrategy,
      hasBackdrop: true
    });

    if (!dialogConfig) {
      dialogConfig = { disableClose: false };
    }

    const overlayRef = this.overlay.create(config);
    const reference = new OverlaySampleRef(overlayRef, dialogConfig);
    const injector = this.createInjector(reference, dialogConfig);
    const portal = new ComponentPortal(comp, null, injector);

    const componentRef = overlayRef.attach(portal);

    reference.componentInstance = componentRef.instance;

    this.openDialogs.push(reference);
    this.afterOpened.emit(reference);

    const subscription = reference.closed.subscribe(() => {
      this.openDialogs = this.openDialogs.filter((dialog) => dialog !== reference);
      subscription.unsubscribe();
    });

    return reference.closed;
  }

  private createInjector(reference: OverlaySampleRef, config: OverlaySampleConfig): PortalInjector {
    const injectionTokens = new WeakMap();
    if (config.data) {
      injectionTokens.set(DIALOG_DATA, config.data);
    }
    injectionTokens.set(OverlaySampleRef, reference);

    return new PortalInjector(this.parentInjector, injectionTokens);
  }

  closeAll() {
    this.openDialogs.forEach((dialog) => dialog.close());
    this.openDialogs = [];
  }

  getActiveDialog() {
    return this.openDialogs.length === 0 ? null : this.openDialogs[this.openDialogs.length - 1];
  }
}
