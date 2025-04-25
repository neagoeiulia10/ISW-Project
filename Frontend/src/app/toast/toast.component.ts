import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Toast, ToastService } from '../toast.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastDirective } from '../toast.directive';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule,
    ToastDirective],
  template: `
  <div *ngIf="!!toast" [appToast]="toast.type" class="toast">
      {{ toast.message }}
    </div>`,
  styles: [`
   .toast {
      position: fixed;
      top: 80px;
      right: 20px;
      background-color:#edeceb;
      color: #fff;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgb(3, 3, 3);
            z-index: 1000;
    }
  `]
})
export class ToastComponent implements OnInit {
  toast: Toast | undefined;
  public subscription: Subscription | undefined;

  constructor(private toastService: ToastService) { }

  ngOnInit() {
    this.subscription = this.toastService.toastState.subscribe((toast: Toast) => {
      this.toast = toast;
      setTimeout(() => this.toast = undefined, 1000);
    });
  }
}