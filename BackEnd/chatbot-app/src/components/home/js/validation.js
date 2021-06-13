let validate = (text, type, minLength) => {
    let nameRegex = /^[a-zA-Z\s]+$/;
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    let emailRegex = /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/;

    let validationResults = {
        isNotEmpty: false,
        hasMinimumCharacters: false,
        hasCorrectCharacters: false,
    }

    // Check the input text for appropriate text.
    if (type === "name") {
        validationResults.hasCorrectCharacters = nameRegex.test(text);
    }
    else if (type === "username") {
        validationResults.hasCorrectCharacters = usernameRegex.test(text);
    }
    else if (type === "email") {
        validationResults.hasCorrectCharacters = emailRegex.test(text);
    }

    // Check if the input is of minimum length
    if (text.length >= minLength) {
        validationResults.hasMinimumCharacters = true;
    }
    else {
        validationResults.hasMinimumCharacters = false;
    }

    // Check if input is not empty.
    if (text.trim().length === 0) {
        validationResults.isNotEmpty = false;
    }
    else {
        validationResults.isNotEmpty = true;
    }

    return validationResults;
}

export default validate;