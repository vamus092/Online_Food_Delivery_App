import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    NgZone
} from '@angular/core';
import { OrderService } from '../services/order-service';
import { Order } from '../model/orderModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserService } from '../services/user-service';
import { UserModel } from '../model/UserModel';

@Component({
    selector: 'app-hotel-manager-order-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    providers: [DatePipe],
    templateUrl: './hotel-manager-order-page.html',
    styleUrl: './hotel-manager-order-page.css',
})
export class HotelManagerOrderPage implements OnInit, OnDestroy {
    Orders: any[] = [];
    selectedStatus: string = 'All';
    todayDate: string = '';
    timerInterval: any;
    currentUser!: UserModel;
    displayTimers: { [orderId: string]: string } = {};

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
                            
                            this.Orders = response.data.map((order: Order) => ({
                                ...order,
                                displayTimer: this.calculateTimer(order)
                            }));
                            
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
                this.Orders = response.data;
                this.cdr.detectChanges();
            },
            error: () => alert("Error fetching orders. Please try again.")
        })
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateLiveTimers();
        }, 8000); // smoother countdown
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
        this.loadOrders();
        this.Orders.forEach(order => {
            if (order.etaTime && order.status === 'Delivery in progress') {
                const etaTime = new Date(order.etaTime).getTime();
                const diff = etaTime - now;

                if (diff > 0) {
                    const mins = Math.floor(diff / 60000);
                    const secs = Math.floor((diff % 60000) / 1000);
                    this.displayTimers[order._id] = `${mins}m ${secs}s`;
                } else {
                    this.displayTimers[order._id] = '0m 0s';
                    if (this.timerInterval) clearInterval(this.timerInterval);
                }
            } else {
                this.displayTimers[order._id] = order.etaTime
                    ? this.datePipe.transform(order.eta, 'shortTime') || 'Not set'
                    : 'Not set';
            }
        });
    }

    filterOrders() {
        this.orderService.getAllOrders('createdAt', 'asc', this.selectedStatus).subscribe({

            next: (response: any) => {
                console.log(`Order fetched Successfully based on ${this.selectedStatus}`, response);
                console.log(response.data);
                // Update local Orders array
                this.Orders = response.data;

            
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
                this.Orders = this.Orders.map(o => o._id === updatedOrder.id
                    ? { ...o, ...updatedOrder, displayTimer: this.calculateTimer(updatedOrder) }
                    : o
                );
                this.cdr.detectChanges();
            },
            error: (error: any) => {
                console.error('Error while updating order eta', error);
                alert('Error while updating order eta. Please try again.');
            }
        });
    }


    handleCancelOrder(orderId:string,status:string){
          this.orderService.changeDeliveryStaus(orderId,status).subscribe({
            next:(response)=>{
                console.log("All Cancelled Successfully",response);
                alert("Order Cancelled Successfully..");
            },
            error:(err)=>{
                console.error("Error Occurred while ...");
            }
          })
    }

    ngOnDestroy() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
}

