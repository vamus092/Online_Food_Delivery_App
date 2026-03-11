import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[password-check]',
    providers: [{ provide: NG_VALIDATORS, useExisting: passwordValidator, multi: true }]
})
export class passwordValidator implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) {
            return null; 
        }

    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        const valid = passwordRegex.test(value);
        return valid ? null : { invalidPassword: true };
    }

}