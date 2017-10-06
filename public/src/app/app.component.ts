import { Component } from '@angular/core';
import { AppService } from './app.service';
// import { b2bChild, getb2bInstance } from './model';
import { getGstr1 } from './artifacts';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subscriptions: any;
  constructor(private appService: AppService) {
    // this.appService.filterOn('post:many:gstr1').subscribe(d => {
    //   console.log(d);
      
    // });
    this.subscriptions = appService.filterOn('post:gstr1:json').subscribe(d => {
      console.log(d);
    });
  }
  createJson() {
    let dbName = 'capi2017';
    let sdate = '2017-09-01', edate = '2017-09-30';
    let options = { dbName: dbName, args: { sdate: sdate, edate: edate } };
    this.appService.httpPost('post:gstr1:json', options);
    // let key1 = 'post:gstr1:reg:sale', key2 = 'post:gstr1:unreg:sale', key3 = 'post:gstr1:hsn:sale', key4 = 'post:gstin';
    // let dbName = 'capi2017';
    // let sdate = '2017-09-01', edate = '2017-09-30';
    // let options = { dbName: dbName, args: { sdate: sdate, edate: edate } };
    // let options1 = Object.assign({}, options, { sqlKey: key1 });
    // let options2 = Object.assign({}, options, { sqlKey: key2 });
    // let options3 = Object.assign({}, options, { sqlKey: key3 });
    // let options4 = Object.assign({}, options, { sqlKey: key4 });

    // this.appService.httpPostMany('post:many:gstr1', [
    //   { urlId: key1, body: options1 },
    //   { urlId: key2, body: options2 }
    //   , { urlId: key3, body: options3 }
    //   , { urlId: key4, body: options4 }
    // ]);
  }
  ngDestroy() {
    this.subscriptions.unsubscribe();
  }
}
