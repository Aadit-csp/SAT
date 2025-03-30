document.addEventListener('DOMContentLoaded', () => {
    const moduleBoxes = document.querySelectorAll('.module-box');

    moduleBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const moduleKey = box.getAttribute('data-module');
            if (moduleKey) {
                // Store the selected module key in localStorage
                // localStorage is simple storage in the browser
                localStorage.setItem('selectedModuleKey', moduleKey);

                // Redirect to the test page
                window.location.href = 'test.html';
            } else {
                console.error('Module box does not have a data-module attribute');
            }
        });
    });
});
