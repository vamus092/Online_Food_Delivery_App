

import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { cardNumberValidator } from '../directive/creditCardValidator';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { cvvValidator } from '../directive/cvvValidator';
import { ViewCartService } from '../services/view-cart-service';
import { OrderService } from '../services/order-service';
import { cartItem } from '../model/cartItem';
import { Order } from '../model/orderModel';
import { UserModel } from '../model/UserModel';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-payment-page',
  standalone: true, // Assuming standalone based on your imports array
  imports: [ FormsModule, CommonModule],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.css',
})
export class PaymentPage {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private viewCartService: ViewCartService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  viewSubscription: any;
  totalAmount: number = 0;
  minDate: string = '';
  displayExpiry: string = '';
  currentUser!: UserModel;
  cartItems: cartItem[] = [];
  orderdItems: Order[] = [];

  // --- NEW PROPERTIES FOR UI LOGIC ---
  maskedCardNumber: string = '';

  ngOnInit(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.viewSubscription = this.viewCartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });

    this.userService.getUserProfile().subscribe({
      next: (response: any) => {
        console.log("Inside Payment Page component ...", response);
        this.currentUser = response.response.data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Error Occurred While Login ...", err);
      }
    });

    this.route.params.subscribe((params) => {
      this.totalAmount = params['totalPrice'];
    });
  }

  // --- NEW INPUT RESTRICTION LOGIC ---

  onCardNumberInput(event: any) {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.replace(/\D/g, ''); // 1. Restrict to numbers only
    
    rawValue = rawValue.substring(0, 12); // 2. Limit to 12 digits

    // 3. Set the visual preview text
    this.maskedCardNumber = rawValue.match(/.{1,4}/g)?.join(' ') || '';

    // 4. Auto-indentation for the input field (adds gap every 4 digits)
    input.value = rawValue.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  onCvvInput(event: any) {
    const input = event.target as HTMLInputElement;
    // Restrict to numbers only and limit to 3 digits
    input.value = input.value.replace(/\D/g, '').substring(0, 3);
  }

  onDateChange(event: any) {
    const date = new Date(event.target.value);
    if (!isNaN(date.getTime())) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().substring(2);
      this.displayExpiry = `${month}/${year}`;
    }
  }

  makePayment(formData: NgForm) {
    console.log(formData.value);

    this.orderService.createOrder(
      this.cartItems,
      formData.value.paymentMethod,
      this.totalAmount,
      this.currentUser._id
    ).subscribe({
      next: (response) => {
        console.log("Order created successfully:", response);
        alert(`Payment of ₹${this.totalAmount} successful! 🎉`);

        this.orderService.initiatePayment(response.order._id, 'Paid').subscribe({
          next: (response) => {
            console.log("Payment Receipt generated successfully ....", response);
          },
          error: (err) => {
            console.error("Error while generating payment receipt..");
          }
        });

        this.viewCartService.clearCart();
        this.router.navigate(['/order-page']);
      },
      error: (err) => {
        console.error("Error creating order:", err);
        alert("Payment failed. Please try again.");
      }
    });
  }

  ngOnDestroy() {
    if (this.viewSubscription) {
      this.viewSubscription.unsubscribe();
    }
  }
}
