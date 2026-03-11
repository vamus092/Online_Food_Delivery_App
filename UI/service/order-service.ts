import { Injectable } from '@angular/core';
import { Order } from '../model/orderModel';
import { cartItem } from '../model/cartItem';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class OrderService {
  private orders: Order[] = [];

  constructor(private http :HttpClient) {
    const saved = localStorage.getItem('orders');
    this.orders = saved ? JSON.parse(saved) : [];
  }

  private saveOrders() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
  }

createOrder(items: cartItem[],paymentMethod:string,totalAmount:number,userId:string|undefined):Observable<any> {
    return  this.http.post(`http://localhost:8000/order/createOrder/${userId}`,{items,paymentMethod,totalAmount},
    { withCredentials: true })
}


initiatePayment(orderId:string,status:string){
    return  this.http.post(`http://localhost:8000/order/payment/${orderId}`,{status},
    { withCredentials: true })
}

getTotalAmount(Items: cartItem[]): number {
  return Items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}


getOrdersById(userId:string|undefined){
    return  this.http.get(`http://localhost:8000/order/${userId}`,{ withCredentials: true })
}

setDeliveryInProgress(orderId: string, eta: string, newStatus: string = "Delivery in progress") {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order) return;

    order.status = newStatus;
    order.eta = eta;
    this.saveOrders();
  }

getAllOrders(sortBy:string,order:string,status:string='All'):Observable<any>{
    return  this.http.get(`http://localhost:8000/order?status=${status}&sortBy=${sortBy}&order=${order}`,{ withCredentials: true })
}  

  
changeDeliveryStaus(orderId:string,status:string):Observable<any>{
   return  this.http.post(`http://localhost:8000/order/${orderId}`,{status},{ withCredentials: true })
}


filterOrders(status:string):Observable<any>{
    return  this.http.get(`http://localhost:8000/order?status=${status}`,{ withCredentials: true })
}


setDeliveryEta(orderId:string,eta:string,status:string):Observable<any>{
     return  this.http.post(`http://localhost:8000/order/${orderId}`,{status,eta},{ withCredentials: true })
}
 


}
