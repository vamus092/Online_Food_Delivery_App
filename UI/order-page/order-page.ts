import { ChangeDetectorRef, Component } from '@angular/core';
import { ViewCartService } from '../services/view-cart-service';
import { cartItem } from '../model/cartItem';
import { Order } from '../model/orderModel';
import { OrderService } from '../services/order-service';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user-service';
import { UserModel } from '../model/UserModel';
@Component({
  selector: 'app-order-page',
  imports: [CommonModule],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css',
})
export class OrderPage {
  cartItems: cartItem[] = [];
  orderdItems: any[] = [];
  currentUser !: UserModel;
  constructor(private orderService: OrderService, private userService: UserService,private cdr : ChangeDetectorRef) { }
  ngOnInit() {

     this.userService.getUserProfile().subscribe({
         next:(response:any)=>{
            console.log("Inside APP component ...",response);
              this.currentUser = response.response.data;
              this.cdr.detectChanges();
              this.orderService.getOrdersById(this.currentUser._id).subscribe({
                 next:(response:any)=>{
                    console.log("Order fetched successfully...",response);
                    this.orderdItems = response.data;
                    this.cdr.detectChanges();
                 },
                 error:(err)=>{
                    console.error("Error occurred while fetching orders...",err);
                 }
              })
         },
         error:(err:any)=>{
           console.error("Error Occurred While Login ...",err);
         }
    })

  }
}

