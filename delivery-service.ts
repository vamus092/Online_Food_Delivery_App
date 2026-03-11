import { Injectable } from '@angular/core';
import { DeliveryAgent } from '../model/deliveryAgent';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
   constructor(private http :HttpClient) {}
 
createAgent(payload:any):Observable<any>{
    return this.http.post('http://localhost:8000/admin/createAgent',payload,{ withCredentials: true })
}   

   
changeDeliveryStatus(orderId:string,status:string):Observable<any>{
     return this.http.post(`http://localhost:8000/order/${orderId}`,{status},{ withCredentials: true })
}

getAllAgents(available:boolean):Observable<any>{
    return this.http.get(`http://localhost:8000/admin/agents?available=${available}`,{ withCredentials: true })
}

assignDeliveryAgent(orderId:string,agentId:string,status:string):Observable<any>{
    return this.http.post(`http://localhost:8000/admin/${orderId}/${agentId}`,{status},{ withCredentials: true })
}

  
