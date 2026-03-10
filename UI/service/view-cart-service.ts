import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cartItem } from '../model/cartItem';
import { MenuService } from './menu-service';
import { MenuModel } from '../model/menuModel';
@Injectable({
  providedIn: 'root',
})

export class ViewCartService {
  private cartItems: cartItem[] = [];
  private cartSubject = new BehaviorSubject<cartItem[]>([]);
  cart$ = this.cartSubject.asObservable();
  saveedCart : any
  constructor(private menuService : MenuService){

     // Load cart from localStorage when service starts
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next([...this.cartItems]);
    }
  }

 
  
addToCart(itemId: string) {
    this.menuService.getMenuById(itemId).subscribe({
      next: (response) => {
        const item: MenuModel = response.data; // adjust based on API shape

        const existingItem = this.cartItems.find(ci => ci._id === item._id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          const cartItem:cartItem  = { ...item, quantity: 1 };
          this.cartItems.push(cartItem);
        }

        this.updateCartStorage();
        console.log("Item added to cart:", item.itemName);
      },
      error: (err) => {
        console.error("Error occurred while adding item to cart...", err);
      }
    });
  }


  getCartItems(): cartItem[]{
    return [...this.cartItems];
  }

  clearCart() {
    this.cartItems = [];
    this.updateCartStorage();
  }

  private updateCartStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
  }

  removeFromCart(itemId: string|undefined) {
    this.cartItems = this.cartItems.filter(ci => ci._id !== itemId);
    this.cartSubject.next([...this.cartItems]);
  }

  increaseQuantity(itemId: string|undefined) {
    const item = this.cartItems.find(ci => ci._id === itemId);
    if (item) {
      item.quantity += 1;
      this.cartSubject.next([...this.cartItems]);
    }
  }

  decreaseQuantity(itemId: string|undefined) {
    const item = this.cartItems.find(ci => ci._id === itemId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.cartSubject.next([...this.cartItems]);
    }
    else {
      this.removeFromCart(itemId);
    }
  }


//   getCartItems(){
//     return this.cartItems
//   }
  
getTotalAmount(): number {
  return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}
  

//   clearCart() {
//     this.cartItems = [];
//     this.cartSubject.next([...this.cartItems]);
//   }
}
