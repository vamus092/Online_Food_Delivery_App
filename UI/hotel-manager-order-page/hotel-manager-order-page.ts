import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { OrderService } from '../services/order-service';
import { Order } from '../model/orderModel'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user-service';
import { UserModel } from '../model/UserModel';
import { OrderItem } from '../model/orderItemModel';
import { MenuItem } from '../model/menuItemModel';
 
@Component({
    selector: 'app-hotel-manager-order-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [DatePipe],
    templateUrl: './hotel-manager-order-page.html',
    styleUrl: './hotel-manager-order-page.css',
})
export class HotelManagerOrderPage implements OnInit, OnDestroy {
    Orders: Order[] = [];
    selectedStatus: string = 'All';
    todayDate: string = '';
    timerInterval: any;
    currentUser!: UserModel;
    displayTimers: { [orderId: string]: string } = {};
    isProcessing:boolean = true;
 
    constructor(
        private userService: UserService,
        private orderService: OrderService,
        private cdr: ChangeDetectorRef,
        private datePipe: DatePipe
    ) { }
 
    ngOnInit(): void {
        this.todayDate = new Date().toISOString().split('T')[0];
        this.userService.getUserProfile().subscribe({
            next: response => {
                console.log('User profile response in AdminPage component:', response.response.data);
                this.currentUser = response.response.data;
                if (this.currentUser && this.currentUser._id && this.currentUser.role === 'HOTEL-MANAGER') {
                    this.orderService.getAllOrders('createdAt', 'asc').subscribe({
                        next: (response: any) => {
                            console.log('All Orders fetched successfully:', response);
                            this.Orders = response.data;
                            // Map each order and add displayTimer
                            this.Orders = response.data.map((order: Order) => ({
                                ...order,
                                displayTimer: this.calculateTimer(order)
                            }));
                           
                            // Start the recurring timer loop
                            this.startTimer();
                            console.log('Orders in Hotel Manager component:', this.Orders);
                            this.cdr.detectChanges();
                        }
                        ,
                        error: (error: any) => {
                            console.error('Error fetching orders:', error);
                            alert("Error fetching orders. Please try again.");
                        }
                    });
                }
                else {
                    alert("Access denied. Manager only.");
                }
            },
            error: (error: any) => {
                console.error('Error fetching user profile in AdminPage component:', error);
                alert("Error fetching user profile. Please try again.");
            }
        });
    }
 
 
   loadOrders() {
        this.orderService.getAllOrders('createdAt', 'asc').subscribe({
            next: (response: any) => {
                console.log("Orders loaded successfully");
                this.Orders = response.data;
               
                // Populate the dictionary using order._id as the key
                this.Orders.forEach((order: Order) => {
                    this.displayTimers[order._id] = this.calculateTimer(order);
                });
               
                this.cdr.detectChanges();
            },
            error: () => alert("Error fetching orders. Please try again.")
        });
    }
 
    startTimer() {
        console.log("Starting Live Timer Loop...");
        // Update the local countdown every 1 second (1000ms) for smoother UI
        // If you prefer 15 seconds, change 1000 to 15000
        this.timerInterval = setInterval(() => {
            this.updateLiveTimers();
        }, 10000);
    }
 
    private calculateTimer(order: Order): string {
        const now = new Date().getTime();
 
        if (order.eta && order.status === 'Delivery in progress') {
            const etaTime = new Date(order.eta).getTime();
            const diff = etaTime - now;
 
            return diff > 0
                ? `${Math.floor(diff / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`
                : '0m 0s';
        } else {
            return order.eta
                ? this.datePipe.transform(order.eta, 'shortTime') || 'Not set'
                : 'Not set';
        }
    }
 
    updateLiveTimers() {
        const now = new Date().getTime();
 
        this.Orders.forEach(order => {
            // Use order.eta instead of the incorrect order.etaTime
            if (order.eta && order.status === 'Delivery in progress') {
                const etaTime = new Date(order.eta).getTime();
                const diff = etaTime - now;
 
                if (diff > 0) {
                    const mins = Math.floor(diff / 60000);
                    const secs = Math.floor((diff % 60000) / 1000);
                    // Update the dictionary
                    this.displayTimers[order._id] = `${mins}m ${secs}s`;
                } else {
                    this.displayTimers[order._id] = '0m 0s';
                    // Do NOT clearInterval here, let other orders keep ticking
                }
            } else {
                this.displayTimers[order._id] = order.eta
                    ? this.datePipe.transform(order.eta, 'shortTime') || 'Not set'
                    : 'Not set';
            }
        });
 
        this.cdr.detectChanges();
    }
 
    filterOrders() {
        this.orderService.getAllOrders('createdAt', 'asc', this.selectedStatus).subscribe({
 
            next: (response: any) => {
                console.log(`Order fetched Successfully based on ${this.selectedStatus}`, response);
                console.log(response.data);
                // Update local Orders array
                this.Orders = response.data;
 
                // Angular will now re-render automatically
                // If using OnPush change detection, you can force it:
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error while fetching  Orders:', error);
                alert("Error while fetching  Orders. Please try again.");
            }
        })
    }
 
    isFutureTime(selectedEta: string): boolean {
        if (!selectedEta) return false;
        const selected = new Date(selectedEta).getTime();
        const now = new Date().getTime();
        return selected > (now + 60000);
    }
 
 
    handleSetDeliveryInProgress(orderId: string, eta: string, status: string) {
        if (status === 'Delivery in progress' && (!eta || !this.isFutureTime(eta))) {
            alert('Error: You must select a future minute.');
            return;
        }
 
        this.orderService.setDeliveryEta(orderId, eta, status).subscribe({
            next: (response: any) => {
                const updatedOrder = response.data;
               
                // Update the order in the array
                this.Orders = this.Orders.map(o => o._id === updatedOrder._id ? { ...o, ...updatedOrder } : o);
               
                // Update the timer in the dictionary
                this.displayTimers[updatedOrder._id] = this.calculateTimer(updatedOrder);
               
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error while updating order eta', error);
                alert('Error while updating order eta. Please try again.');
            }
        });
    }
   
 
    handleCancelOrder(orderId: any, item: any, status: string) {
 
    item.isProcessing = true;
    console.log("Calculating total for Item ID:", item.itemId._id);
 
    const grandTotal = this.Orders.reduce((totalSum: number, order: any) => {
   
        const orderSum = order.items.reduce((sum: number, it: any) => {
       
            const currentId = it.itemId?._id?.toString() || it.itemId?.toString();
            console.log("Current Id ....");
            console.log(currentId);
            if (currentId === item.itemId._id) {
                const price = it.itemId?.price || 0;
                const quantity = it.quantity || 0;
                return sum + (price * quantity);
            }
            return sum;
        }, 0);
 
        return totalSum + orderSum;
    }, 0);
 
    console.log("Grand Total for this Item across orders:", grandTotal);
 
          this.orderService.changeDeliveryStaus(orderId, status,  grandTotal).subscribe({
            next: (response) => {
              console.log("Order Cancelled Successfully", response);
              alert(`Order Cancelled Successfully. Total Amount: ${ grandTotal}`);
               if (this.timerInterval) clearInterval(this.timerInterval);
            },
            error: (err) => {
              console.error("Error Occurred while cancelling order", err);
            }
          });
 
    }
 
    ngOnDestroy() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
}
