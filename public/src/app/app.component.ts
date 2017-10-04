import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private appService: AppService) {
    this.appService.filterOn('post:many:gstr1').subscribe(d => {
      console.log(d);
    });
  }
  createJson() {
    let key1 = 'post:gstr1:reg:sale', key2 = 'post:gstr1:unreg:sale', key3 = 'post:gstr1:hsn:sale';
    // let key1 = 'post:acc';
    // let key2 = 'post:bill';
    // let key3='post:gstr1:reg:sale';
    let dbName = 'capi2017';
    let sdate = '2017-09-01', edate = '2017-09-30';
    let options = { dbName: dbName, args: { sdate: sdate, edate: edate } };
    // let options1 = Object.assign({},options,{sqlKey:key1});
    // let options2 = Object.assign({},options,{sqlKey:key2});
    // let options3 = Object.assign({},options,{sqlKey:key3});
    let options1 = {
      dbName: 'capi2017',
      sqlKey: key1,
      args: { sdate: '2017-09-01', edate: '2017-09-30' }
    };
    let options2 = {
      dbName: 'capi2017',
      sqlKey: key2,
      args: { sdate: '2017-09-01', edate: '2017-09-30' }
    };
    let options3 = {
      dbName: 'capi2017',
      sqlKey: key3,
      args: { sdate: '2017-09-01', edate: '2017-09-30' }
    };

    this.appService.httpPostMany('post:many:gstr1', [
      { urlId: key1, body: options1 },
      { urlId: key2, body: options2 }
      ,{ urlId: key3, body: options3 }
    ]);
    // console.log('json');
  }
}
