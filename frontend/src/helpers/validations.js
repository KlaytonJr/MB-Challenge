function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCPF(cpf) {
    const re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return re.test(cpf);
}

function validateCNPJ(cnpj) {
    const re = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    return re.test(cnpj);
}

function validateDate(date) {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(date);
}

function validatePhone(phone) {
    const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return re.test(phone);
}

export {
    validateEmail,
    validateCPF,
    validateCNPJ,
    validateDate,
    validatePhone
}