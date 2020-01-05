var formData = {
    mobileNumber: '',
    firstName: '',
    lastName: '',
    birthDate: {
        month: 0,
        date: 0,
        year: 0
    },
    birthDateString: undefined,
    gender: undefined,
    email: ''
};

new Vue({
    el: '#app',
    data: {
        months: months,
        years: years,
        date: [],
        showAlert: false,
        message: '',
        formData: formData,
        alertColorTheme: 'alert-default',
        showLoginButton: false
    },
    methods: {
        setDate,
        submitRegister,
        showAlertMessage,
        validateFields,
        validateRequiredFields,
        validateMobileNumber,
        validateEmail,
        goToLoginPage
    }
})

function setDate(event) {
    let monthName = event.target.value;
    let dateCount;

    if(['Feb'].some(m => m == monthName)) dateCount = 29;
    else if(['Apr', 'Jun', 'Sep', 'Nov'].some(m => m == monthName)) dateCount = 30;
    else dateCount = 31;

    this.date = Array(dateCount).fill().map((d, i) => i + 1);
}

function submitRegister() {
    let data = formData;
    let url = '/register/submitForm';

    // Disable all elements of form
    lockFields();

    // If data form is not valid
    if(!this.validateFields()) {
        releaseFields();
        this.showAlertMessage(alert.danger, 'Please check your input.'); 
        return;
    }
    
    axios.post(url, data).then(res => {
        let errCode = res.data.errCode;
        if(errCode == 200) {
            this.showLoginButton = true
            this.showAlertMessage(alert.success, res.data.message);
        } else if(errCode == 102) {
            releaseFields();
            this.showAlertMessage(alert.warning, res.data.message);
        } else if(errCode == 101) {
            releaseFields();
            this.showAlertMessage(alert.danger, res.data.message);
        }
        
    });
}

function validateFields() {
    let isFormDataValid = true;
    let errMsgs = document.getElementsByClassName('err-msg');
    // Hide err-msg
    for(let i = 0; i < errMsgs.length; i++) {
        errMsgs[i].style.display = 'none';
    }

    // Validate required fields
    isFormDataValid = validateRequiredFields(isFormDataValid);

    // Validate mobile number
    isFormDataValid = this.validateMobileNumber(isFormDataValid)

    // Validate email
    isFormDataValid = this.validateEmail(isFormDataValid);

    // Validate birth date
    isFormDataValid = validateBirthDate(JSON.parse(JSON.stringify(this.formData.birthDate)), isFormDataValid);

    return isFormDataValid;
}

function lockFields() {
    let elems = document.forms.registration.elements;
    for(let i = 0; i < elems.length; i++) {
        elems[i].disabled = true
    }
}

function releaseFields() {
    let elems = document.forms.registration.elements;

    setTimeout(() => {
        for(let i = 0; i < elems.length; i++) {
            elems[i].disabled = false
        }
    }, 2000);
}

function isNumber(evt) {
    let mobileNumber = document.getElementById('number').value;
    // Limiting mobile number
    if (mobileNumber.length > 11) return false;
    
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    
    // Set mobile number should not start with 0
    if (charCode == 48 && mobileNumber.length < 1) return false
    
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    
    return true;
}

function validateMobileNumber(isFormDataValid) {
    let mobileNumber = document.getElementById('number').value;
    if (mobileNumber.length < 10) {
        isFormDataValid = false;
        document.getElementById('err-msg-number').style.display = 'block'
    }
    return isFormDataValid;
}

function validateEmail(isFormDataValid) {
    let email = document.getElementById('email').value;
    if (!email.includes('@')) {
        isFormDataValid = false;
        document.getElementById('err-msg-email').style.display = 'block'
    }
    return isFormDataValid;
}

function validateBirthDate(objDate, isFormDataValid) {
    if(objDate.date == '0' && objDate.month == '0' && objDate.year == '0') {
        return isFormDataValid;
    } else if(objDate.date != '0' && objDate.month != '0' && objDate.year != '0') {
        objDate.date = objDate.date.length == 1 ? `0${objDate.date}` : objDate.date;
        this.formData.birthDateString = `${objDate.year}-${monthInt[objDate.month]}-${objDate.date}`;
    } else {
        document.getElementById('err-msg-date').style.display = 'block'
        isFormDataValid = false;
    }
    return isFormDataValid;
}

function validateRequiredFields(isFormDataValid) {
    let requiredFields = document.forms.registration.querySelectorAll("[required]");
    requiredFields.forEach((item) => {
        if(item.value == '') {
            document.getElementById(`err-msg-${item.id}`).style.display = 'block';
            isFormDataValid = false;
        }
    })
    return isFormDataValid;
}

function showAlertMessage(messageType, message) {
    this.alertColorTheme = messageType;
    this.message = message;
    this.showAlert = true;
}

function goToLoginPage() {
    window.open('/login', '_self');
}