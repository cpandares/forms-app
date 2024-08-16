import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];
  

  public myForm: FormGroup = this.fb.group({
    region: [ '', Validators.required ],
    country: [ '', Validators.required ],
    borders: [ '', Validators.required ]
  })

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService
  ){}


  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }


  get regions(): Region[]{
    return this.countryService.regions;

  }


  onRegionChange ():void{

    this.myForm.get('region')?.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')?.setValue('') ),
      tap( () => this.borders = [] ),
      switchMap( region => this.countryService.getCountriesByRegion(region) )
    )
    .subscribe( region => {
      this.countriesByRegion = region
    })
  }


  onCountryChange():void{


    this.myForm.get('country')?.valueChanges
    .pipe(
      filter( (alphaCode) => alphaCode !== '' ),
      tap( () => this.myForm.get('border')?.setValue('') ),
      tap( () => this.borders = [] ),
      switchMap( (alphaCode) => this.countryService.getCountryByAlphaCode(alphaCode) ),
      switchMap( country => this.countryService.getCountriesByBorders(country.borders) )
    )
    .subscribe( countries => {
      this.borders = countries;
    })

  }


}
