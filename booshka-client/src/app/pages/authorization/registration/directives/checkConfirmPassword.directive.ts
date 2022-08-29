import { AbstractControl, ValidationErrors } from "@angular/forms";


export function checkConfirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password: string = control.parent?.value?.password
    const confirmPassword: string = control.parent?.value?.confirmPassword

    if (
        password?.trim() &&
        confirmPassword?.trim() &&
        password === confirmPassword
    ) {
        return { checkConfirmPassword: { value: control.value } }
    }
    return null
}