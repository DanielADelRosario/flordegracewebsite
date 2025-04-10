document.addEventListener("DOMContentLoaded", function () {
    const forgotBtn = document.querySelector(".forgot-btn");
    const forgotContainer = document.querySelector(".forgot-password-container");

    forgotBtn.addEventListener("click", function () {
        // Change border color to green
        forgotContainer.style.border = "2px solid #66bb6a"; 

        // Delay SweetAlert2 by 1 second (1000ms)
        setTimeout(() => {
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "A password reset link has been sent to your email.",
                confirmButtonColor: "#29a53e"
            });
        }, 1000); // 1-second delay

        // Optional: Revert border after 3 seconds
        setTimeout(() => {
            forgotContainer.style.border = "2px solid #ccc"; 
        }, 4000);
    });
});
