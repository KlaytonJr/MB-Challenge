<script setup>
import { onMounted, reactive } from 'vue'

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
        email: { required: true, email: true },
        user_type: { required: true },
        name: { required: true },
        cpf_or_cnpj: { required: true },
        birth_date: { required: true },
        phone: { required: true },
        password: { required: true },
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
        // Iterar sobre pfFields e definir o estilo
        for (let i = 0; i < pfFields.length; i++) {
            pfFields[i].style.display = 'block';
        }
        // Iterar sobre pjFields e ocultar os campos PJ
        for (let i = 0; i < pjFields.length; i++) {
            pjFields[i].style.display = 'none';
        }
    } else if (personType === 'pj') {
        // Iterar sobre pfFields e definir o estilo
        for (let i = 0; i < pfFields.length; i++) {
            pfFields[i].style.display = 'none';
        }
        // Iterar sobre pjFields e ocultar os campos PJ
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
            return false; // Se algum dos pais estiver oculto, o elemento não é visível
        }
        currentElement = currentElement.parentElement;
    }

    return true; // O elemento e todos os seus pais são visíveis
}

function validateStep(step) {
    const stepElements = document.querySelectorAll(`.registration-form__step--${step} [data-validate]`);
    let isValid = true;
    stepElements.forEach(element => {
        if (isElementVisible(element)) {
            const validationType = element.getAttribute('data-validate');
            const value = element.value;
            const isRequired = state.validations[validationType].required;
            
            if (isRequired && !value) {
                isValid = false;
                element.classList.add('is-invalid');
            } else {
                element.classList.remove('is-invalid');
            }
        }
    });
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

<style scoped></style>