import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { Routes, RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
// import { AuthGuard } from './guard/auth.guard';
import { OrderModule } from 'ngx-order-pipe';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
// import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
// import { ProfileComponent } from './components/profile/profile.component';
// import { FavoriteComponent } from './components/favorite/favorite.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
// import { CheckoutComponent } from './components/checkout/checkout.component';
// import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { AllProductComponent } from './components/all-product/all-product.component';
// import { ByCategoryComponent } from './components/by-category/by-category.component';
// import { TestComponent } from './components/test/test.component';


const routes: Routes = [
  // {path: 'checkout', component: CheckoutComponent},
  { path: 'all-product', component: AllProductComponent},
  { path: 'home', component: HomepageComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent }, 
  { path: 'about',component: AboutComponent},
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'sign-form', component: SignFormComponent },
  // { path: 'payment', component: PaymentComponent},
  // { path: 'test', component: TestComponent},
  // { path: 'search/:keyword', component: SearchComponent },
  // { path: 'profile', component: ProfileComponent },
  // { path: 'favorites', component: FavoriteComponent, canActivate: [AuthGuard] },
  // { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  // { path: 'cart', component: CartComponent },
  // { path: 'by-category/:id', component: ByCategoryComponent, canActivate: [AuthGuard] },
  
];


@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    // CheckoutComponent,
    // PaymentComponent,
    // TestComponent,
    HeaderComponent,
    FooterComponent,
    // SearchComponent,
    HomepageComponent,
    // SignFormComponent,
    AboutComponent,
    ContactComponent,
    // ByCategoryComponent,
    AllProductComponent,
    // OrderDetailComponent,
    // ProfileComponent,
    // FavoriteComponent,
    ProductDetailComponent,
    // ForgotPasswordComponent,
    ProductDetailComponent,
    // RateComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    OrderModule,
    NgxPayPalModule,
    RouterModule.forRoot(routes, { enableTracing: true }),
    NgbModule,
     // NgModule,
     ToastrModule.forRoot({
      timeOut: 2500,
      // progressBar: true,
      progressAnimation: 'increasing',
      // preventDuplicates: true,
      closeButton: true,
      // newestOnTop: false,
    }),
  ],
  // providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
