import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';


@Directive({
    selector: '[dateValid]',
    providers: [{ provide: NG_VALIDATORS, useExisting: dateValidator, multi: true }]
})
export class dateValidator implements Validator {
    validate(control: AbstractControl): ValidationErrors | null{
        const  date = control.value;
        console.log(typeof(date));
        console.log("DOB: " +date);
        if (date) {
             const newDate = new Date(control.value);
             console.log(date);
             const currentDate = new Date();
            newDate.setHours(0,0,0,0);
            currentDate.setHours(0,0,0,0);
           if (newDate.getTime() >= currentDate.getTime()) {
               console.log("Invalid Date");
               return { invalidDate: true };
           }
        }
        return null;
    }
}