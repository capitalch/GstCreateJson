import {Component} from '@angular/core';
import {AppService} from './app.service';
import {urlMaps, AllMonths, AllDbNames, DefaultSettings} from './app.config';
import {getGstr1} from './artifacts';
@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.css']})
export class AppComponent {
  dbName : string;
  months : any[];
  dbNames : string[];
  selectedMonth : number;
  url : () => {};
  selectedDbName : string;

  constructor(private appService : AppService) {
    this.dbNames = AllDbNames;
    this.selectedDbName = AllDbNames[0];
    let tempUrl = urlMaps['get:gstr1:json'];
    this.url = () => tempUrl.concat('?dbName=', this.selectedDbName, '&month=', this.selectedMonth.toString());
    this.months = AllMonths;
    let diff = DefaultSettings['default:return:month:from:current:month'];
    diff = diff || 1;
    this.selectedMonth = (new Date()).getMonth() - diff;
  }

  gstReturns() {
    console.log(this.selectedMonth);
  }
  createJson() {}
  ngDestroy() {
  }
}
