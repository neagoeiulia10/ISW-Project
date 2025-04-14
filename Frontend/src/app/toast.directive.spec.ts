import { ElementRef } from '@angular/core';
import { ToastDirective } from './toast.directive';

describe('ToastDirective', () => {
  it('should create an instance', () => {
    const el: ElementRef<HTMLElement> = {} as ElementRef;
    const directive = new ToastDirective(el);
    expect(directive).toBeTruthy();
  });
});
