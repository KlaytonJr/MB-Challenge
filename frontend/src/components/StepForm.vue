<script setup>
import { onMounted, reactive } from 'vue'
import { validateEmail, validateCNPJ, validateCPF, validateDate, validatePhone } from '../helpers/validations'

const state = reactive({
    currentStep: 1,
    formHtml: '',
    formData: {
        email: '',
        user_type: '',
        name: '',
        cpf_or_cnpj: '',
        birth_date: '',
        phone: '',
        password: '',
    },
    validations: {
        email: { required: true, email: true, label: 'E-mail' },
        user_type: { required: true },
        name: { required: true, label: 'Nome ou Razão Social' },
        cpf_or_cnpj: { required: true, cpfOrCnpj: true, label: 'CPF ou CNPJ' },
        birth_date: { required: true, date: true, label: 'Data' },
        phone: { required: true, phone: true, label: 'Telefone' },
        password: { required: true, minLength: 6, label: 'Senha' },
    }
})

async function getForm() {
    try {
        const response = await fetch('http://localhost:3000/registration');
        state.formHtml = await response.text();
    } catch (error) {
        alert('Erro ao carregar o formulário.');
    }
}

function addEventListeners() {
    document.addEventListener('click', function(event) {
        if (event.target.matches('.registration-form__btn--next')) {
            handleNextStep(event);
        } else if (event.target.matches('.registration-form__btn--prev')) {
            handlePrevStep(event);
        } else if (event.target.matches('.registration-form__btn--submit')) {
            submitForm();
        }
    });

    document.addEventListener('input', function(event) {
        updateFormData(event.target);
    });
}

function handleNextStep(event) {
    if(validateStep(state.currentStep)) {
        if (state.currentStep === 1) {
            showStep(2);
            toggleFields();
        } else {
            showStep(state.currentStep + 1);
        }
    }
}

function handlePrevStep(event) {
    showStep(state.currentStep - 1);
}

function showStep(step) {
    const steps = document.querySelectorAll('.registration-form__step');
    steps.forEach(el => el.style.display = 'none');
    document.querySelector(`.registration-form__step--${step}`).style.display = 'block';
    state.currentStep = step;

    if (step === 4) {
        populateReviewStep();
    }
}

function toggleFields() {
    const personType = document.querySelector('input[name="user-type"]:checked').value;
    const pfFields = document.getElementsByClassName('pfFields');
    const pjFields = document.getElementsByClassName('pjFields');

    if (personType === 'pf') {
        for (let i = 0; i < pfFields.length; i++) {
            pfFields[i].style.display = 'block';
        }
        for (let i = 0; i < pjFields.length; i++) {
            pjFields[i].style.display = 'none';
        }
    } else if (personType === 'pj') {
        for (let i = 0; i < pfFields.length; i++) {
            pfFields[i].style.display = 'none';
        }
        for (let i = 0; i < pjFields.length; i++) {
            pjFields[i].style.display = 'block';
        }
    }
}

function updateFormData(target) {
    const name = target.name;
    const value = target.value;

    if (Object.keys(state.formData).includes(name)) {
        state.formData[name] = value;
    }

    if (target.name === 'user-type') {
        state.formData.user_type = target.value;
    }
}

function isElementVisible(element) {
    let currentElement = element;

    while (currentElement) {
        const computedStyle = window.getComputedStyle(currentElement);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
            return false;
        }
        currentElement = currentElement.parentElement;
    }

    return true;
}

function validateStep(step) {
    const stepElements = document.querySelectorAll(`.registration-form__step--${step} [data-validate]`);
    let isValid = true;

    const addInvalidClass = (message, element) => {
        isValid = false;
        element?.classList.add('is-invalid');
        alert(message);
        return false;
    };

    // Validar o preenchimento da seleção
    const radioGroups = [...stepElements].filter(el => el.type === 'radio')
        .reduce((groups, radio) => {
            groups[radio.name] = groups[radio.name] || [];
            groups[radio.name].push(radio);
            return groups;
        }, {});

    for (const groupName in radioGroups) {
        const isChecked = radioGroups[groupName].some(radio => radio.checked);
        if (!isChecked) {
            return addInvalidClass(`Por favor, selecione uma opção de cadastro.`);
        } else {
            radioGroups[groupName].forEach(radio => radio.classList.remove('is-invalid'));
        }
    }

    // Validação dos demais campos
    for (const element of stepElements) {
        if (!isElementVisible(element) || element.type === 'radio') continue;

        const validationType = element.getAttribute('data-validate');
        const value = element.value;
        const validation = state.validations[validationType] || {};
        const isRequired = validation.required;
        const minLength = validation.minLength || 0;

        if (isRequired && !value) {
            return addInvalidClass(`O campo "${state.validations[validationType].label || element.name}" é obrigatório.`, element);
        } else if (validationType === 'email' && !validateEmail(value)) {
            return addInvalidClass('Por favor, insira um endereço de email válido (ex: exemplo@dominio.com).', element);
        } else if (validationType === 'cpf_or_cnpj') {
            const validateFn = state.formData.user_type === 'pf' ? validateCPF : validateCNPJ;
            if (!validateFn(value)) {
                const label = state.formData.user_type === 'pf' ? 'CPF' : 'CNPJ';
                return addInvalidClass(`Por favor, insira um ${label} válido.`, element);
            } else {
                element.classList.remove('is-invalid');
            }
        } else if (validationType === 'birth_date' && !validateDate(value)) {
            return addInvalidClass('Por favor, insira uma data válida no formato YYYY-MM-DD.', element);
        } else if (validationType === 'phone' && !validatePhone(value)) {
            return addInvalidClass('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.', element);
        } else if (minLength && value.length < minLength) {
            return addInvalidClass(`O campo "Senha" deve ter pelo menos ${minLength} caracteres.`, element);
        } else {
            element.classList.remove('is-invalid');
        }
    }

    return isValid;
}



function populateReviewStep() {
    Object.keys(state.formData).forEach(key => {
        const inputs = document.querySelectorAll(`.registration-form__step--4 [name="${key}"]`);
        inputs.forEach(input => {
            input.value = state.formData[key];
        });
    });
}

function submitForm() {
    console.log('👉 state.formData => ', state.formData);
}

onMounted(() => {
    getForm();
    addEventListeners();
})

</script>

<template>
    <div v-html="state.formHtml" v-if="state.formHtml"></div>
    <div v-else>
        <p>Carregando...</p>
    </div>
</template>

<style>
.is-invalid {
    border: 1px solid red;
}

.registration-form {
    box-sizing: border-box;
    width: 400px;
}

.registration-form__step {
    text-align: start;
}

.registration-form__actual-step {
    color: #FF9900;
}

.registration-form__label, .registration-form__input {
    width: 100%;
    box-sizing: border-box;
}

.registration-form__label {
    font-size: 18px;
    font-weight: 500;
}

.registration-form__input {
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid gray;
    margin-bottom: 15px;
}

.registration-form__checkbox-group {
    display: flex;
    gap: 30px;
}

.registration-form__actions {
    width: 100%;
    display: flex;
    gap: 15px;
}

.registration-form__actions button {
    flex: 1;
    background: #FF9900;
    color: #fff;
}

.registration-form__actions .registration-form__btn--prev {
    background: #fff;
    border: 2px solid #FF9900;
    color: #FF9900;
}
</style>