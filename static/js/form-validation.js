/**
 * MarketPulse - Form Validation and Submission
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const firstNameInput = document.getElementById('first_name');
    const lastNameInput = document.getElementById('last_name');
    const mobileNumberInput = document.getElementById('mobile_number');
    const firstNameError = document.getElementById('first_name_error');
    const lastNameError = document.getElementById('last_name_error');
    const mobileNumberError = document.getElementById('mobile_number_error');
    const submitButton = document.getElementById('submit-btn');
    const formSuccess = document.getElementById('form-success');
    const whatsappButton = document.getElementById('whatsapp-button');
    const whatsappLink = document.getElementById('whatsapp-link');
    
    if (!form) return;
    
    // Validate first name
    function validateFirstName() {
        if (!firstNameInput.value.trim()) {
            firstNameError.textContent = 'First name is required';
            firstNameError.classList.remove('hidden');
            return false;
        } else if (!/^[a-zA-Z ]+$/.test(firstNameInput.value.trim())) {
            firstNameError.textContent = 'First name should contain only letters';
            firstNameError.classList.remove('hidden');
            return false;
        } else {
            firstNameError.classList.add('hidden');
            return true;
        }
    }
    
    // Validate last name
    function validateLastName() {
        if (!lastNameInput.value.trim()) {
            lastNameError.textContent = 'Last name is required';
            lastNameError.classList.remove('hidden');
            return false;
        } else if (!/^[a-zA-Z ]+$/.test(lastNameInput.value.trim())) {
            lastNameError.textContent = 'Last name should contain only letters';
            lastNameError.classList.remove('hidden');
            return false;
        } else {
            lastNameError.classList.add('hidden');
            return true;
        }
    }
    
    // Validate mobile number
    function validateMobileNumber() {
        if (!mobileNumberInput.value.trim()) {
            mobileNumberError.textContent = 'Mobile number is required';
            mobileNumberError.classList.remove('hidden');
            return false;
        } else if (!/^[0-9]{10}$/.test(mobileNumberInput.value.trim())) {
            mobileNumberError.textContent = 'Please enter a valid 10-digit mobile number';
            mobileNumberError.classList.remove('hidden');
            return false;
        } else {
            mobileNumberError.classList.add('hidden');
            return true;
        }
    }
    
    // Add input event listeners for real-time validation
    firstNameInput.addEventListener('input', validateFirstName);
    lastNameInput.addEventListener('input', validateLastName);
    mobileNumberInput.addEventListener('input', validateMobileNumber);
    
    // Only allow numbers in mobile input
    mobileNumberInput.addEventListener('keypress', function(e) {
        const keyCode = e.which || e.keyCode;
        const keyValue = String.fromCharCode(keyCode);
        
        if (!/^\d+$/.test(keyValue)) {
            e.preventDefault();
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isMobileNumberValid = validateMobileNumber();
        
        if (isFirstNameValid && isLastNameValid && isMobileNumberValid) {
            // Disable submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
            
            // Prepare URL-encoded form data
            const formData = new FormData(form);
            const searchParams = new URLSearchParams();
            for (const pair of formData.entries()) {
                searchParams.append(pair[0], pair[1]);
            }
            
            // Send form data as URL encoded string
            fetch('https://script.google.com/macros/s/AKfycbz3vKrqGzI2mpyI2YY43ofp3Jtb0SE0nDHlHX8NPHODJXq7QvNN_apRq2prY8_Ll4iz/exec', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: searchParams.toString()
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Hide all input and buttons except success message and WhatsApp button
                    Array.from(form.querySelectorAll('input, button, div:not(#form-success):not(#whatsapp-button)')).forEach(el => {
                        if (el.parentElement !== formSuccess && el.parentElement !== whatsappButton) {
                            el.parentElement.style.display = 'none';
                        }
                    });
                    
                    // Show success message and WhatsApp button
                    formSuccess.classList.remove('hidden');
                    whatsappButton.classList.remove('hidden');
                    
                    // Set WhatsApp link from response
                    // Construct the WhatsApp link locally
                    const firstName = form.querySelector('[name="first_name"]').value;
                    const lastName = form.querySelector('[name="last_name"]').value;

                    const message = `Hi, I'm ${firstName} ${lastName} and I'm interested in the free trial for your stock market news service.`;
                    const whatsappUrl = `https://wa.me/918983790844?text=${encodeURIComponent(message)}`;

                    // Option 1: Open in new tab
                    window.open(whatsappUrl, '_blank');

                    // Option 2: Open in same tab
                    // window.location.href = whatsappUrl;

                    
                    // Scroll to success message
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    alert('There was an error processing your request. Please try again.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Start Free Trial';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error submitting the form. Please try again.');
                submitButton.disabled = false;
                submitButton.innerHTML = 'Start Free Trial';
            });
        }
    });
});
