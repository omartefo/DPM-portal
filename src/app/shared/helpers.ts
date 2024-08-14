export class Helpers {
	static alphabetOnly(ev: KeyboardEvent): boolean {
		const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
		if (allowedKeys.includes(ev.key)) {
			return true;
		};

        const letters = /^[a-zA-Z]+$/;
        if (ev.key && ev.key.match(letters) != null)
        {
            return ((ev.key.match(letters) as RegExpMatchArray).length > 0);
        }

        return false;
	}

	static numericOnly(ev: any): boolean
    {
		const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
		if (allowedKeys.includes(ev.key)) {
			return true;
		}

        const letters = /^[0-9]+$/;
        if (ev.key && ev.key.match(letters))
        {
            return (ev.key.match(letters).length > 0);
        }

        return false;
    }
}
