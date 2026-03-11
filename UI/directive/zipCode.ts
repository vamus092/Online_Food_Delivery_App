import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';


@Directive({
    selector: '[zipCode]',
    providers: [{ provide: NG_VALIDATORS, useExisting:zipCodeValidator , multi: true }]
})
export class zipCodeValidator implements Validator {
    validate(control: AbstractControl): ValidationErrors | null{
        const zipRegex = /^[0-9]{6}$/;
        console.log(control.value);
        let value = control.value;
        if (!value) {
            return null; 
        }
        const valid = zipRegex.test(control.value);
        console.log(valid)
        return valid ? null : { invalidZipCode: true };
    }
}