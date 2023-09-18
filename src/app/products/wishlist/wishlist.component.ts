import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  allproducts:any=[]
  constructor(private api:ApiService,private toaster:ToasterService){}
  ngOnInit(): void {
    this.api.getwishlist().subscribe({
      next:(res:any)=>{
        console.log(res);
       this.allproducts = res 
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
    
  }
  //removeItem
  removeItem(id:any){
    //make api service call
    this.api.removeWishlistItem(id).subscribe({
     next:(result:any)=>{
      this.allproducts =result
     },
     error:(err:any)=>{
      console.log(err);
      
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
      //remove item from wishlist
      this.removeItem(product.id)
      //alert result
      this.toaster.showSuccess(result,"success")
    },
    error:(err:any)=>{
      console.log(err);
      
    }
  })
}
}
