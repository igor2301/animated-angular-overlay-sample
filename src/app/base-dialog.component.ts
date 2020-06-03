import { Component, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AnimationEvent } from '@angular/animations';

const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
  selector: 'app-base-dialog',
  template: '',
  animations: [
    trigger('show', [
      state(
        'void',
        style({
          transform: 'translate3d(0, 25%, 0) scale(0.9)',
          opacity: 0
        })
      ),
      state('enter', style({ transform: 'none', opacity: 1 })),
      state('leave', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
      transition('* => *', animate(ANIMATION_TIMINGS))
    ])
  ]
})
export abstract class BaseDialogComponent {
  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  public onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation() {
    this.animationState = 'leave';
  }
}
