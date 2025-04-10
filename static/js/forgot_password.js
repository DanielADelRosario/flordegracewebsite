document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');
    const resetBtn = document.getElementById('resetBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate email
        if (!validateEmail(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            return;
        }
        
        // Show loading state
        resetBtn.disabled = true;
        btnText.textContent = 'Processing...';
        btnLoader.classList.remove('d-none');
        
        // Simulate API call (replace with actual fetch)
        setTimeout(() => {
            // Hide loading state
            resetBtn.disabled = false;
            btnText.textContent = 'Send Reset Link';
            btnLoader.classList.add('d-none');
            
            // Show success message
            Swal.fire({
                title: 'Email Sent!',
                text: 'Password reset instructions have been sent to your email',
                icon: 'success',
                confirmButtonColor: '#198754',
                timer: 5000,
                background: '#f8f9fa',
                backdrop: `
                    rgba(25, 135, 84, 0.2)
                    url("{{ url_for('static', filename='images/nyan-cat.gif') }}")
                    center top
                    no-repeat
                `
            });
            
            // Reset form
            form.reset();
            emailInput.classList.remove('is-invalid');
        }, 2000);
    });
    
    // Realtime email validation
    emailInput.addEventListener('input', function() {
        if (validateEmail(emailInput.value)) {
            emailInput.classList.remove('is-invalid');
        }
    });
    
    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});