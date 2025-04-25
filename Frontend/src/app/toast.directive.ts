import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appToast]',
  standalone: true
})
export class ToastDirective implements OnChanges {
@Input('appToast') toastType:string | undefined;
constructor(private el: ElementRef) {}
ngOnChanges() {
  this.updateColor();

  }
  private updateColor() {
    switch (this.toastType) {
      case 'delete':
        this.el.nativeElement.style.color = 'red';
        break;
      case 'add':
        this.el.nativeElement.style.color = 'green';
        break;
      case 'edit':
        this.el.nativeElement.style.color = 'yellow';
        break;
      default:
        this.el.nativeElement.style.color = 'black';
        break;
}
  }
}