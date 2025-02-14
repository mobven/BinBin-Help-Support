document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.mode-tab-button');
    const sections = document.querySelectorAll('.map-section');
    const nextButton = document.querySelector('.next-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif tab'ı değiştir
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // İlgili içeriği göster
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.dataset.tab === button.dataset.tab) {
                    section.classList.add('active');
                }
            });

            // Buton metnini güncelle
            const isSecondTab = button === tabButtons[1];
            if (isSecondTab) {
                nextButton.innerHTML = '<span>Tamam</span>';
            } else {
                nextButton.innerHTML = '<span>BinBinler</span>';
            }
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