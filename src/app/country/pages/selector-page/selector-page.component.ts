import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region } from '../../interfaces/country.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{


  

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
  }


  get regions(): Region[]{
    return this.countryService.regions
  }


  onRegionChange ():void{

    this.myForm.get('region')?.valueChanges
    .pipe(
      switchMap( region => this.countryService.getCountriesByRegion(region) )
    )
    .subscribe( region => {
      console.log( region )
    })
  }

}
