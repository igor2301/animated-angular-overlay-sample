import { Component, ElementRef, EventEmitter, HostListener, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AnimationEvent } from '@angular/animations';
import { OverlaySampleService } from './overlay-sample.service';

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
export abstract class BaseDialogComponent implements OnInit {
  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();

  private focusableElementSelector =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.autoFocus();
  }

  public onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation() {
    this.animationState = 'leave';
  }

  @HostListener('keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent) {
    const isTab = event.key === 'Tab';
    const backward = event.shiftKey === true;

    if (isTab) {
      this.handleTab(event, backward);
    }
  }

  handleTab(event, backward) {
    const focusableElements = this.getFocusableElements();

    if (focusableElements.length === 0) {
      return;
    }

    const currentFocus = document.activeElement;
    const focusIndex = focusableElements.indexOf(currentFocus);

    const isFocusIndexUnknown = focusIndex === -1;
    const isFirstElementFocused = focusIndex === 0;
    const isLastElementFocused = focusIndex === focusableElements.length - 1;

    let cancelEvent = false;

    if (backward) {
      if (isFocusIndexUnknown || isFirstElementFocused) {
        focusableElements[focusableElements.length - 1].focus();
        cancelEvent = true;
      }
    } else {
      if (isFocusIndexUnknown || isLastElementFocused) {
        focusableElements[0].focus();
        cancelEvent = true;
      }
    }

    if (cancelEvent) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  getFocusableElements() {
    const rawElements = this.elementRef.nativeElement.querySelectorAll(this.focusableElementSelector);
    const tabbableElements = this.filterTabbableElements(rawElements);
    return this.filterVisibleElements(tabbableElements);
  }

  filterTabbableElements(els) {
    const tabbableFocusableElements = [];

    for (let i = 0; i < els.length; i++) {
      const el = els[i];

      if (el.getAttribute('tabindex') !== '-1') {
        tabbableFocusableElements.push(el);
      }
    }

    return tabbableFocusableElements;
  }

  filterVisibleElements(els) {
    const visibleFocusableElements = [];

    for (let i = 0; i < els.length; i++) {
      const el = els[i];

      if (el.offsetWidth > 0 || el.offsetHeight > 0) {
        visibleFocusableElements.push(el);
      }
    }

    return visibleFocusableElements;
  }

  autoFocus() {
    const autoFocusEl = this.elementRef.nativeElement.querySelector('*[autofocus]');
    if (autoFocusEl !== null) {
      autoFocusEl.focus();

      if (document.activeElement === autoFocusEl) {
        return;
      }
    }

    const focusableElements = this.getFocusableElements();

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
}
