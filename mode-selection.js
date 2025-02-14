document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.mode-tab-button');
    const nextButton = document.querySelector('.next-button');
    const sections = document.querySelectorAll('.mode-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif tab'ı değiştir
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const isSecondTab = button === tabButtons[1];
            if (isSecondTab) {
                nextButton.innerHTML = '<span>Tamam</span>';
            } else {
                nextButton.innerHTML = '<span>Kullanım Alanları</span>';
            }

            // İlgili içeriği göster
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.dataset.tab === button.dataset.tab) {
                    section.classList.add('active');
                }
            });
        });
    });

    // İlerle butonu işlevi
    nextButton.addEventListener('click', () => {
        const activeTab = document.querySelector('.mode-tab-button.active');
        const nextTab = activeTab.nextElementSibling;

        if (nextTab) {
            nextTab.click();
        } else if (nextButton.textContent === 'Tamam') {
            window.location.href = 'driving-guide.html';
        }
    });
}); 