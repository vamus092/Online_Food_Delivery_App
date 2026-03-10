import { ChangeDetectorRef, Component } from '@angular/core';
import { cartItem } from '../model/cartItem';
import { ViewCartService } from '../services/view-cart-service';
import { CommonModule } from '@angular/common';
import { Order } from '../model/orderModel';
import { OrderService } from '../services/order-service';
import { Router } from '@angular/router';
import { UserModel } from '../model/UserModel';
import { UserService } from '../services/user-service';
@Component({
  selector: 'app-view-cart',
  imports: [CommonModule],
  templateUrl: './view-cart.html',
  styleUrl: './view-cart.css',
})

export class ViewCart {
  subscription : any;
  viewSubscription: any;
  currentUser!: UserModel;
  cartItems: cartItem[] = [];
  orderdItems: Order[] = [];
  total: number = 0;
  constructor(private userService: UserService, private viewCartService: ViewCartService,private router: Router,private cdr : ChangeDetectorRef) { }

  ngOnInit(): void {
   this. viewSubscription =  this.viewCartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.total = this.viewCartService.getTotalAmount();
    });
    
     this.userService.getUserProfile().subscribe({
         next:(response:any)=>{
            console.log("Inside APP component ...",response);
              this.currentUser = response.response.data;
              this.cdr.detectChanges();
         },
         error:(err:any)=>{
           console.error("Error Occurred While Login ...",err);
         }
    })
  }

  handleIncreaseQuantity(itemId: string|undefined) {
    this.viewCartService.increaseQuantity(itemId);
  }
  handleDecreaseQuantity(itemId: string|undefined) {
    this.viewCartService.decreaseQuantity(itemId);
  }

  handleRemoveItem(itemId: string|undefined) {
    if (confirm('Are you sure you want to remove this item?')) {
      this.viewCartService.removeFromCart(itemId);
    }
  }

  placeOrder() {
    let totalAmount = this.viewCartService.getTotalAmount();
    this.router.navigate(['/payment-page', totalAmount]);
  }

//    ngOnDestroy(){
//      this.subscription.unsubscribe();
//      this.viewSubscription.unsubscribe();
//    }

}
