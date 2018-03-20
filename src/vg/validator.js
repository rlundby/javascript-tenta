/**
 * Objektet FormValidator nedan ska kompletteras med kod för att kunna utföra validering av formulärfält.
 * 
 * Validaring sker i 4 steg:
 * 
 * 1. Inför validering krävs att man först anger s.k. validerare ("validator") via FormValidator.addValidator(). 
 * En validator är en funktion som tar en parameter "value" och returnerar true om validering lyckas, annars false. 
 * Varje validator anges med ett namn.
 *
 *
 *
 *
 *
 * 2. Data från formulärfält mappas till de validators som ska användas. Detta görs genom ett särskilt mappningsobjekt, 
 * där varje property motsvarar ett specifikt formulärfält och dess värde är namnet på den validator som ska användas.
 * 
 * 3. Validering förbereds genom att anropa FormValidator.prepare(), med mappningsobjektet som parameter.
 * 
 * 4. Validera slutligen given formulärdata genom att läsa ut formulärdata och skapa ett särskilt dataobjekt, där
 * varje property motsvarar ett specifikt formulärfält och dess värde är det utlästa värdet. Anropa sedan 
 * FormValidator.validate() med dataobjektet som parameter.
 *
 * VIKTIGT 1: Properties i dataobjektet MÅSTE matcha motsvarande properties i mappningsobjektet. Se exempel nedan.
 * 
 * VIKTIGT 2: Att ange validators med addValidator() och förbereda mappning med prepare() behöver bara göras en gång,
 * och kommer appliceras varje gång validate() körs med ny formulärdata efter en "submit".
 * 
 * Kodexempel på 1-4:
 * 
 * // 1. Ange en validator för att kontrollera att en given sträng inte är tom.
 * FormValidator.addValidator('isStringNotEmpty', function(value) {
 *  // anta att value är en sträng, se till att ta bort alla blanksteg.
 *  if (value.trim() !== '') {
 *      return true;
 *  }
 * 
 *  return false;
 * })
 * 
 * 
 * // 2. Mappa en property "title" (motsvarar ett formulärfält för titel) till validatorn 'isStringNotEmpty'.
 * const mapping {
 *  title: 'isStringNotEmpty'
 * }
 * 
 * // 3. Förbered validering med mappningsobjektet.
 * FormValidator.prepare(mapping)
 * 
 * // 4. Läs ut data från formulärfält och skapa ett dataobjekt, där varje property matchar en property i 
 * // mappningsobjektet.
 * const data = {
 *  title: $('#title-input').val()
 * }
 * 
 * // validera formulärdata.
 * const errorStrings = FormValidator.validate(data);
 * if (errorStrings.length !== 0) {
 *  // iterera över alla felmeddelanden och skriv ut dessa.
 * } else {
 *  // valideringen lyckades!
 * }
 * 
 * TIPS: Ett objekt som FormValidator kan naturligtvis ha properties, och dessa nås i objektets funktioner via this.
 * En sådan property är objektet 'validators'. 
 */

const errors = [];


const FormValidator = {
    validators: {},

    addValidator(validatorName, validatorFunction) {
        if (!this.validators[validatorName]) {
            this.validators[validatorName] = [];
        }

        this.validators[validatorName].push(validatorFunction);
    },

    prepare(mapping) {
        const map = {
            id: 'isIntAndAllowed',
            name: 'isValidName',
            price: 'isValidPrice'
        }

        for (let i in mapping) {
            const validator = this.validators[map[i]];
            validator.forEach(validator => {
                validator(mapping[i]);
            });
        }

    console.log(errors);
    },

    validate(data) {
         this.prepare(data) ;

    }
}



FormValidator.addValidator('isIntAndAllowed', function(value) {
    value = parseInt(value);
    if (Number.isInteger(value)) {
        if (value >= 0 && value < 9999) {
            return true;
        }
        let errorMsg = "Please enter a valid ID"
        errors.push(errorMsg);

        return false;
    }
    return false;
 })

FormValidator.addValidator('isValidName', function(value) {
    console.log(value);
  if (value == '') {
      let errorMsg = "Please enter a name"
      errors.push(errorMsg);
      return false;
      }
  else if (value.length < 3) {
      let errorMsg = "Please enter a name longer than 3 chars"
      errors.push(errorMsg);
      return false;
  }
  else if (/[^a-zA-Z0-9\-]/.test(value)) {
      let errorMsg = "Please don't use symbols"
      errors.push(errorMsg);
      return false;
  }
  else {
      return true;
  }
 })

FormValidator.addValidator('isValidPrice', function(value) {
    value = parseInt(value);
    if (value !== 0 ) {
        return true;
    }
    let errorMsg = "Please enter a valid price"
    errors.push(errorMsg);
   return false;
})

