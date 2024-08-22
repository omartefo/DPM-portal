import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default class Validation {
	static match(controlName: string, checkControlName: string): ValidatorFn {
		return (controls: AbstractControl) => {
			const control = controls.get(controlName);
			const checkControl = controls.get(checkControlName);

			if (checkControl?.errors && !checkControl.errors['matching']) {
				return null;
			};

			if (control?.value !== checkControl?.value) {
				controls.get(checkControlName)?.setErrors({ matching: true });
				return { matching: true };
			}
			else {
				return null;
			};
		};
	}

	static priceRangeValidator(minControlName: string, maxControlName: string): ValidatorFn {
		return (formGroup: AbstractControl): ValidationErrors | null => {
		  const minControl = formGroup.get(minControlName);
		  const maxControl = formGroup.get(maxControlName);

		  if (!minControl || !maxControl) {
			return null; // Form controls not found
		  }

		  const minValue = minControl.value;
		  const maxValue = maxControl.value;

		  if (minValue != null && maxValue != null && maxValue <= minValue) {
			maxControl.setErrors({ priceRangeInvalid: true });// Return error if max is less than or equal to min
		  }
		  else {
			maxControl.setErrors(null);
		  }

		  return null; // Return null if no error
		};
	  }
}
