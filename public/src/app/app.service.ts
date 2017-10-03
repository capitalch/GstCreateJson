import {Injectable} from '@angular/core';
import {Http, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class AppService {
  //used to maintain a global object
  global : any = {};
  subject : Subject < any >;
  urlMaps : {};
  messages = {
    idNotMappedToUrl: 'Message id is not mapped to http url in config.ts file at application root',
    httpGetUnknownError: 'Unknown error encountered while making http request'
  };

  constructor(private http : Http, private activatedRoute : ActivatedRoute, private router : Router) {
    
  }

  get(id) {
    return (this.global[id]);
  }

  set(id, value) {
    this.global[id] = value;
  }

  emit(id : string, options?: any) {
    this
      .subject
      .next({id: id, data: options});
  };

  filterOn(id : string) : Observable < any > {
    return(this.subject.filter(d => (d.id === id)));
  };

  httpPost(id : string, body?: any) {
    let url = this.urlMaps[id];
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this
      .http
      .post(url, body, {headers: headers})
      .map(response => response.json())
      .subscribe(d => {
        this
          .subject
          .next({id: id, data: d, body: body});
      }, err => {
        this
          .subject
          .next({
            id: id,
            data: {
              error: err
            }
          });
      });
  };

  httpGet(id : string, queryParams?: [any], headers?: [any], carryBag?: any) {
    try {
      let url = this.urlMaps[id];
      let myParams = new URLSearchParams();
      queryParams && (queryParams.map(x => myParams.append(x.name, x.value)));

      let myHeaders = new Headers();
      headers && (headers.map(x => myHeaders.append(x.name, x.value)));
      let options;
      (headers || queryParams) && (options = new RequestOptions({
        headers: headers
          ? myHeaders
          : null,
        params: queryParams
          ? myParams
          : null
      }));
      if (url) {
        this
          .http
          .get(url, options)
          .map(response => response.json())
          .subscribe(d => {
            this
              .subject
              .next({id: id, data: d, carryBag: carryBag});
          }, err => {
            this
              .subject
              .next({id: id, error: err});
          });
      } else {
        this
          .subject
          .next({id: id, error: this.messages.idNotMappedToUrl})
      }
    } catch (err) {
      this
        .subject
        .next({id: id, error: this.messages.httpGetUnknownError})
    }
  }

  httpPut(id : string, body?: any) {
    let url = this.urlMaps[id];
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this
      .http
      .put(url, body, {headers: headers})
      .map(response => response.json())
      .subscribe(d => this.subject.next({id: id, data: d, body: body}), err => this.subject.next({
        id: id,
        data: {
          error: err
        }
      }));
  };
}
