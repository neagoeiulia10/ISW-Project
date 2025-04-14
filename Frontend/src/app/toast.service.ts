import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'add' | 'edit' | 'delete' | 'info'; // You can add more types as needed
}
@Injectable({
  providedIn: 'root'
})

  export class ToastService {
    private toastSubject = new Subject<Toast>();
    toastState = this.toastSubject.asObservable();
  
    showToast(message: string, type: 'add' | 'edit' | 'delete' | 'info') {
      this.toastSubject.next({ message, type });
    }
  }
  