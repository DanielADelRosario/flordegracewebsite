document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.background-img');
    let current = 0;

    function showSlide(index) {
        slides.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) img.classList.add('active');
        });
    }

    function nextSlide() {
        current = (current + 1) % slides.length;
        showSlide(current);
    }

    showSlide(current); // Show first image
    setInterval(nextSlide, 10000); // Change image every 5 seconds
});
