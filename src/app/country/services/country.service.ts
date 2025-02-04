import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { combineLatest, map, Observable, of, tap } from 'rxjs';

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

        return this.http.get<Country[]>( url )
        .pipe(
            map( countries => countries.map( country => ({
                name: country.name.common,
                cca3: country.cca3,
                borders: country.borders ?? []
            }))),
            
        
        )
    }



    getCountryByAlphaCode( alphaCode:string ): Observable<SmallCountry>{
        //if( !alphaCode ) return of({} as SmallCountry);
        const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

        return this.http.get<Country>( url )
            .pipe(
                map( country => ({
                    name: country.name.common,
                    cca3: country.cca3,
                    borders: country.borders ?? []
                }))
            )
        
    }


    getCountriesByBorders( borders: string[] ): Observable<SmallCountry[]>{
        if( !borders || borders.length === 0) return of([]);

        const countryRequests: Observable<SmallCountry>[] = [];

        borders.forEach( alphaCode => {
            const request = this.getCountryByAlphaCode( alphaCode );
            countryRequests.push( request );
        });

        return combineLatest( countryRequests );

    }

    
}