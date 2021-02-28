let Validator = require("validatorjs");

function validate(data, rules) {
    let validation = new Validator(data, rules);

    if (validation.passes()) return [true];

    return [false, validation.errors.all()];
}

module.exports = validate;
