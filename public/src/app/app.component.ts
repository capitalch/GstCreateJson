import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private appService: AppService) {
    this.appService.filterOn('post:gstr2').subscribe(d=>{
      console.log(d);
    });
  }
  createJson() {
    let options = {
      dbName: 'capi2017',
      sqlKey: 'post:gstr2',
      args:{sdate:'2017-09-01',edate:'2017-09-30'}
    };    
    this.appService.httpPost('post:gstr2', options);
    console.log('json');
  }
}
