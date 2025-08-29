import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (toast of toasts; track toast.id) {
        <div 
          class="animate-fade-in flex items-center px-6 py-4 rounded-lg shadow-lg max-w-sm"
          [ngClass]="getToastClasses(toast.type)"
        >
          <div class="flex items-center flex-1">
            <span class="mr-3 text-lg">{{ getIcon(toast.type) }}</span>
            <span class="text-sm font-medium">{{ toast.message }}</span>
          </div>
          @if (toast.showClose) {
            <button 
              (click)="removeToast(toast.id)" 
              class="ml-4 text-xl hover:opacity-70 transition-opacity"
            >
              &times;
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }

  getToastClasses(type: Toast['type']) {
    const baseClasses = 'text-white';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-500`;
      case 'error':
        return `${baseClasses} bg-red-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-500`;
      case 'info':
        return `${baseClasses} bg-blue-500`;
      default:
        return `${baseClasses} bg-gray-500`;
    }
  }

  getIcon(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  }
}
