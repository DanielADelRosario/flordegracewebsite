function scrollImages(direction, containerId) {
    const container = document.getElementById(containerId);
    const scrollStep = 330; // 300px image + 30px gap

    const newScrollPosition = direction === 'left' 
        ? container.scrollLeft - scrollStep 
        : container.scrollLeft + scrollStep;

    container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
    });
}
