import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';


@Directive({
    selector: '[card-Number]',
    providers: [{ provide: NG_VALIDATORS, useExisting: cardNumberValidator, multi: true }]
})
export class cardNumberValidator implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        const cardRegex = /^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/;
        if (!control.value) {
            console.log('No card number provided');
            return null; 
        }

        const valid = cardRegex.test(control.value);
        return valid ? null : { invalidCardNumber: true };
    }

}