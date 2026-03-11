import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';


@Directive({
    selector: '[phone-Number]',
    providers: [{ provide: NG_VALIDATORS, useExisting: phoneNumberValidator, multi: true }]
})
export class phoneNumberValidator implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        const phoneRegex = /^[0-9]{10}$/;

        if (!control.value) {
            return null; 
        }

        const valid = phoneRegex.test(control.value);
        return valid ? null : { invalidPhone: true };
    }

}