import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {AppService} from './app.service';
import { AppComponent } from './app.component';
import { Gstr1Component } from './gstr1/gstr1.component';

@NgModule({
  declarations: [
    AppComponent,
    Gstr1Component
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
