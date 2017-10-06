let fs = require('fs');
let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/Observable/forkJoin';
let sqlAny = require('./sqlAny');

function httpPostMany(messsageId, queries
    //     : [{
    //       urlId: string,
    //       body?: any,      
    //     }
    //   ]
) {
    try {

        let forks = queries.map(x =>
            // this.http.post(urlMaps[x.urlId], x.body).map(res => res.json()));
            this.http.post('http://localhost:3005/api/gstr1', x.body).map(res => res.json()));

        Observable
            .forkJoin(forks)
            .subscribe(d => {
                d = d.map((x, i) => {
                    let urlId = queries[i].urlId;
                    let y = {};
                    y[urlId] = x;
                    return (y);
                });
                this
                    .subject
                    .next({ id: messsageId, data: d, carryBag: carryBag });
            }, err => {
                this
                    .subject
                    .next({ id: messsageId, error: err });
            });

    } catch (err) {
        this
            .subject
            .next({ id: messsageId, error: this.messages.httpGetUnknownError })
    }
}