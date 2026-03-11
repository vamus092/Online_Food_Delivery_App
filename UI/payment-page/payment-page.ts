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
  imports: [cardNumberValidator, FormsModule, CommonModule, cvvValidator],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.css',
})
export class PaymentPage {
  constructor(private userService : UserService,private orderService: OrderService, private viewCartService: ViewCartService, private route: ActivatedRoute, private router: Router,private cdr : ChangeDetectorRef) { }
  viewSubscription: any;
  totalAmount: number = 0;
  minDate: string = '';
  displayExpiry: string = '';
  currentUser !:UserModel;

  ngOnInit(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.viewSubscription = this.viewCartService.cart$.subscribe(items => {
      this.cartItems = items;
    });

     this.userService.getUserProfile().subscribe({
         next:(response:any)=>{
            console.log("Inside Payment Page component ...",response);
              this.currentUser = response.response.data;
              this.cdr.detectChanges();
         },
         error:(err:any)=>{
           console.error("Error Occurred While Login ...",err);
         }
    })

    this.route.params.subscribe(params => {
      this.totalAmount = params['totalPrice'];
    });
  }

  onDateChange(event: any) {
    const date = new Date(event.target.value);
    if (!isNaN(date.getTime())) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().substring(2);
      this.displayExpiry = `${month}/${year}`;
    }
  }

  cartItems: cartItem[] = [];
  orderdItems: Order[] = [];
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

    
      

    this.orderService.initiatePayment(response.order._id,'Paid').subscribe({
        next:(response)=>{
             console.log("Payment Receipt generated successfully ....",response);
        },
        error:(err)=>{
            console.error("Error while generating payment receipt..")
        }
    })

    
      this.viewCartService.clearCart();

      
      this.router.navigate(['/order-page']);
    },
    error: (err) => {
      console.error("Error creating order:", err);
      alert("Payment failed. Please try again.");
    }
  });
}

  
   ngOnDestroy(){
     this.viewSubscription.unsubscribe();
   }
}

