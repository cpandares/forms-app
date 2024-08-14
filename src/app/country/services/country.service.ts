import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Region, SmallCountry } from '../interfaces/country.interface';
import { Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CountryService {

    private baseUrl: string = 'https://restcountries.com/v3.1'

    private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ];

    get regions(): Region[]{
        return [ ...this._regions ]
    }

    constructor(
        private http: HttpClient
    ) { }

    getCountriesByRegion( region:Region ):Observable<SmallCountry[]>{

        if( !region ) return of([]);

        const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`

        return this.http.get<SmallCountry[]>( url )
        .pipe(
            tap( res => console.log({ res }) )
        )
    }
    
}