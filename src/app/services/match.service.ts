import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match';
import { Global } from './global';

@Injectable()
export class MatchService{
    public url: string;
    public lolVurl: string;
    
    constructor(
        private _http: HttpClient
    ){
        this.url = Global.url
        this.lolVurl = Global.lolVurl
    }

    getMatchs(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');


        return this._http.get(this.url+'get-matches', {headers:headers})
    }
    //------------------------------------
    //not working
    getSummoners(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.get(this.url+'get-summoners/'+id, {headers:headers})
    }
    //need to make proxy server or use comunity ddragon, ill probably use the last one
    getVersion(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.get(this.lolVurl, {headers:headers})
    }
}