import { Injectable } from '@angular/core';
import { MenuModel } from '../model/menuModel';
import { MenuSection } from '../model/menuSection';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
 constructor(private http:HttpClient){}

menuSections: MenuSection[] = [];


getAllMenus():Observable<any>{
    return this.http.get('http://localhost:8000/menu/', { withCredentials: true });
}

getMenuBySectionName(resId:string,sectionName:string):Observable<any>{
    return this.http.get(`http://localhost:8000/menu/section/${resId}/${sectionName}`, { withCredentials: true });
}


getMenuById(itemId:string):Observable<any>{
    return this.http.get(`http://localhost:8000/menu/${itemId}`, { withCredentials: true });
}

deleteMenuItem(menuID:string,itemId:string):Observable<any>{
    return this.http.delete(`http://localhost:8000/menu/${menuID}/${itemId}`, { withCredentials: true });
}

editMenuItem(itemId:string,payload:any):Observable<any>{
    console.log("Payload of the menu to be edited...",payload);
    return this.http.put(`http://localhost:8000/menu/edit/${itemId}`,{payload},{ withCredentials: true });
}



addMenu(resId:string,payload:any):Observable<any>{
    return this.http.post(`http://localhost:8000/menu/createMenu/${resId}`,payload,{ withCredentials: true })
}


 searchMenuitems(resId:string,sectionName:string, searchTerm:string):Observable<any> {
   return this.http.get(`http://localhost:8000/menu/searchItems/${resId}/${sectionName}?searchTerm=${searchTerm}`,{ withCredentials: true })
 } 



}
