import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';


@Directive({
    selector: '[email]',
    providers: [{ provide: NG_VALIDATORS, useExisting: customEmailValidator, multi: true }]
})
export class customEmailValidator implements Validator {
    validate(control: AbstractControl): ValidationErrors | null{
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        let value = control.value; 
        if (!value) {
            return null; 
        }
        const valid = emailRegex.test(control.value);
        return valid ? null : { invalidEmail: true };
    }
}