import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { AbstractControl, ValidationErrors ,Validator } from '@angular/forms';

@Directive({
  selector: '[nonNegativePrice]',
  providers: [ { provide: NG_VALIDATORS, useExisting: nonNegativePriceDirective, multi: true } ]
})
export class nonNegativePriceDirective implements Validator { 
  validate(control: AbstractControl):ValidationErrors|null{
      let value = control.value;
      console.log(value);
      if(value !== null && value<11){
         return {negativeValue: true};
      }
      return null;
   }
}