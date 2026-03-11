import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';


@Directive({
    selector: '[confirmPassword]',
    providers: [{ provide: NG_VALIDATORS, useExisting: confirmPasswordValidator, multi: true }]
})
export class confirmPasswordValidator implements Validator {
    validate(control: AbstractControl): ValidationErrors | null{
        let value = control.value;
        if (value) {
            const password = control.root.get('password');
            if (password && value !== password.value) {
                return { invalidConfirmPassword: true };
            }
        }
        return null;
    }
}