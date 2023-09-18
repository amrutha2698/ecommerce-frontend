import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster.service';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.css']
})
export class CartsComponent implements OnInit{
  paymentStatus:boolean=false
  showmodalFooter:boolean=true
  showPaypal:boolean=false
  showSuccess:boolean=false
  showCancel:boolean=false
  showError:boolean=false
  public payPalConfig?: IPayPalConfig;
  couponClicked:boolean=false
  offerbtnclickstatus:boolean=false
  checkoutClickStatus:boolean=false
  totalCartAmount:number=0
  allproducts:any=[]
  username:any
  flat:any
  state:any
  pincode:any

    addressForm=this.fb.group({
    username:["",[Validators.required]],
    flatno:["",[Validators.required]],
    state:["",[Validators.required]],
    pincode:['',[Validators.required]]
  })
 

  constructor(private api:ApiService,private fb:FormBuilder,private toaster:ToasterService){}
  ngOnInit(): void {
  this.getCart()
  }

  //get cart
  getCart(){
  this.api.getcart().subscribe({
    next:(result:any)=>{
      this.allproducts=result
      //get cart total price
      this.getcarttotalprice()
      // paypal call
      //this.initConfig()
      },
      error:(err:any)=>{
        console.log(err);
      }
  })
}

//getcart total price
getcarttotalprice(){
  let total =0
  this.allproducts.forEach((item:any)=>{
    total+=item.total
    this.totalCartAmount=Math.ceil(total)
  })
}

//remove cart item
removeitem(id:any){
this.api.removecartItem(id).subscribe({
  next:(res:any)=>{

    //update cart array
    this.allproducts = res
    //update cart total price
    this.getcarttotalprice()
    //update cart count
    this.api.getCartCount()
  },
  error:(err:any)=>{
    console.log(err);
    
  }
})
}

//increment cart item
incrItem(id:any){
  //make call to service
 this.api.incrementcart(id).subscribe({
  next:(res:any)=>{
    this.allproducts = res
    //update total price 
    this.getcarttotalprice()
  }
 })
}

//decrement cart item
decrItem(id:any){
  //make call to service
 this.api.decrementcart(id).subscribe({
  next:(res:any)=>{
    this.allproducts = res
    //update total price 
    this.getcarttotalprice()
  }
 })
}
//emptycart
emptycart(){
  //call to service
  this.api.emptycart().subscribe({
    next:(res:any)=>{
      this.allproducts=res
      //update cart total price =0
      this.totalCartAmount=0
      //update cart count
      this.api.getCartCount()
    },
    error:(err:any)=>{
      console.log(err);
      
    }
  })
}
checkOut(){
  if(this.addressForm.valid){
    this.checkoutClickStatus=true
    this.username=this.addressForm.value.username
    this.flat=this.addressForm.value.flatno
    this.state=this.addressForm.value.state
    this.pincode=this.addressForm.value.pincode
  }
  else{
    this.toaster.showWarning("Invalid form","warning")
    this.checkoutClickStatus=false
  }
}
// offerbtn clicked
offerClick(){
  this.offerbtnclickstatus=true
}
//discount10
discount10(){
  this.couponClicked=true
  this.totalCartAmount -= Math.ceil(this.totalCartAmount*.1)
}
//discount50
discount50(){
  this.couponClicked=true
  this.totalCartAmount -= Math.ceil(this.totalCartAmount*.5)
}
// paypal method

private initConfig(): void {
  let amount=this.totalCartAmount.toString()
  this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'USD',
                  value: amount,
                  breakdown: {
                      item_total: {
                          currency_code: 'USD',
                          value: amount
                      }
                  }
              },
              items: [{
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                      currency_code: 'USD',
                      value: amount,
                  },
              }]
          }]
      },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'vertical'
      },
      onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then((details:any) => {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
          });

      },
      onClientAuthorization: (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          // payment completed
         this.showSuccess = true;
        //  this.toaster.showSuccess("Payment completed successfully . Order has already placed.Thank you","success")
          //empty cart
          this.emptycart()
          //paypal hidden
          this.showPaypal=false
          this.showmodalFooter=false
          this.paymentStatus=true
      },
      onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);
          this.showCancel = true;
          this.showmodalFooter=false
           //paypal hidden
           this.showPaypal=false
           setTimeout(()=>{
             this.showCancel=false
             this.showmodalFooter=true
           },5000)
      
      },
      onError: err => {
          console.log('OnError', err);
          this.showError = true;
           //paypal hidden
           this.showPaypal=false
           setTimeout(()=>{
            this.showError=false
            this.showmodalFooter=true
          },5000)
      },
      onClick: (data, actions) => {
          console.log('onClick', data, actions);
         
      },
  };
}
//make payment
makePayment(){
  this.showPaypal=true
     //paypal call
     this.initConfig()
}
}

