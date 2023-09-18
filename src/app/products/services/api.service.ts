import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  searchKey = new BehaviorSubject("")
  cartCount= new BehaviorSubject(0)
  base_url="https://e-commerce-rvfb.onrender.com"

  constructor(private http:HttpClient) { 
    this.getCartCount()
  }
  //get all products api
  getallproducts(){
    //make an api call to server
    return this.http.get(`${this.base_url}/products/get-all-products`)
  }


  //viewproduct
  
  viewproduct(id:number){
    //make an api call to localhost:3000
   return this.http.get(`${this.base_url}/products/view/${id}`)
  }

  //addtowishlist
  addtowishlist(product:any){

    //req body
    const body={
      id:product.id,
      title:product.title,
      price:product.price,
      image:product.image

    }
    //make an api call wishlist/add-products
    return this.http.post(`${this.base_url}/wishlist/add-product`,body)
  }

  //get wishlist
  getwishlist(){
    return this.http.get(`${this.base_url}/wishlist/all-products`)
  }
  //delete item
  removeWishlistItem(id:any){
    return this.http.delete(`${this.base_url}/wishlist/remove-item/${id}`)
  }
  //add to cart
  addtoCart(product:any){
    //req body
    const body={
      id:product.id,
      title:product.title,
      price:product.price,
      image:product.image,
      quantity:1
    }
    //make an api call
    return this.http.post(`${this.base_url}/cart/add-product`,body)
  }
  getcart(){
    return this.http.get(`${this.base_url}/cart/all-products`)
  }
  //getcart count
  getCartCount(){
    this.getcart().subscribe({
      next:(result:any)=>{
        this.cartCount.next(result.length)
      }
    })
  }

  //remove cart item
  removecartItem(id:any){
    //api call
    return this.http.delete(`${this.base_url}/cart/remove-item/${id}`)
  }

  //incrementcart
  incrementcart(id:any){
    //api call
    return this.http.get(`${this.base_url}/cart/increment-item/${id}`)
  }

   //decrementcart
   decrementcart(id:any){
    //api call
    return this.http.get(`${this.base_url}/cart/decrement-item/${id}`)
  }

  //empty cart
  emptycart(){
    //api call
    return this.http.delete(`${this.base_url}/cart/empty`)
  }
}
