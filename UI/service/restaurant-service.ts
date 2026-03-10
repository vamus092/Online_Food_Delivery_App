import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {

 constructor(private http : HttpClient){}
 
  getAllRestaurant():Observable<any>{
      return this.http.get('http://localhost:8000/restaurant/', { withCredentials: true })
  }

  getRestaurantByID(userId:string|undefined):Observable<any>{
     return this.http.get(`http://localhost:8000/restaurant/${userId}`,{ withCredentials: true })
  }


  addRestaurant(payload:any):Observable<any>{
     console.log("Inside the Restaurent service ",payload);
     return this.http.post('http://localhost:8000/restaurant/createRestaurant',payload,{ withCredentials: true })
  }
}
