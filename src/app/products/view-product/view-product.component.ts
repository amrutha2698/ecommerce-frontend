import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit{
  product:any={}
 constructor(private viewRoute:ActivatedRoute,private api:ApiService,private toaster:ToasterService){}
 ngOnInit(): void {
   this.viewRoute.params.subscribe({
    next:(result:any)=>{
      // destructuring
      const {id} = result
      console.log(id);
      //using id make a call to service to get details of that product
      this.api.viewproduct(id).subscribe({
        next:(result:any)=>{
          console.log(result);
          this.product = result
          },
        error:(err:any)=>{
          console.log(err);
          
        }
      })
    }
   })
 }
 //addtowishlist
 addtowishlist(product:any){
  //make a call to services
  this.api.addtowishlist(product).subscribe({
    next:(res:any)=>{
      console.log(res);
      //alert res
      this.toaster.showSuccess(`${res.title} added to your wishlist`,'success')
      
    },
    error:(err:any)=>{
      console.log(err.error);
      //alert err.error
      this.toaster.showWarning(err.error,'Fail')
    }
  })
  
 }

 //add to cart
addtoCart(product:any){
  //make call to services
  this.api.addtoCart(product).subscribe({
    next:(result:any)=>{
      //get cart count
      this.api.getCartCount()
      //alert result
      this.toaster.showSuccess(result,"success")
    },
    error:(err:any)=>{
      console.log(err);
      
    }
  })
}
}
