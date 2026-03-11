import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';


@Directive({
    selector: '[cvv-Number]',
    providers: [{ provide: NG_VALIDATORS, useExisting: cvvValidator, multi: true }]
})
export class cvvValidator implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        const cvvRegex = /^[0-9]{3}$/;
        if (!control.value) {
            console.log('No CVV provided');
            return null; 
        }

        const valid = cvvRegex.test(control.value);
        return valid ? null : { invalidCvv: true };
    }
    
}