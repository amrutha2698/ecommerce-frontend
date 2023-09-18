import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartsComponent } from './carts/carts.component';
import { ViewProductComponent } from './view-product/view-product.component';
import{ HttpClientModule } from '@angular/common/http';
import { FilterPipe } from './pipes/filter.pipe'
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [
    ProductsComponent,
    AllProductsComponent,
    WishlistComponent,
    CartsComponent,
    ViewProductComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPayPalModule
  ]
})
export class ProductsModule { }
