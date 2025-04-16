document.addEventListener('DOMContentLoaded', function() {
    // Tab değiştirme işlevi
    const tabButtons = document.querySelectorAll('.tab-button');
    const sliders = document.querySelectorAll('.slider');
    const subTabs = document.querySelectorAll('.sub-tab-button');
    const sections = document.querySelectorAll('.rules-section');
    const nextButton = document.querySelector('.next-button');
    const rulesContents = document.querySelectorAll('.rules-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif tab'ı değiştir
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Tab slider'ı güncelle
            const tabSlider = document.querySelector('.tab-slider');
            const isSecondTab = button === tabButtons[1];
            const isThirdTab = button === tabButtons[2];
            if (isSecondTab) {
                tabSlider.style.transform = 'translateX(calc(100%))';
                tabSlider.style.background = '#15B1FF';
                nextButton.style.background = '#15B1FF';
            } else if (isThirdTab) {
                tabSlider.style.transform = 'translateX(calc(200%))';
                tabSlider.style.background = '#3DBCC8';
                nextButton.style.background = '#3DBCC8';
            } else {
                tabSlider.style.transform = 'translateX(0)';
                tabSlider.style.background = '#00DFF4';
                nextButton.style.background = '#00DFF4';
            }

            // İlgili rules-content'i göster
            const targetTab = button.dataset.tab;
            rulesContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-rules`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Alt tab'lar arası geçiş
    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Alt tab'ı güncelle
            subTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // İlgili içeriği göster
            const targetSection = tab.dataset.section;
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.dataset.section === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // Buton metnini güncelle
            const currentIndex = Array.from(subTabs).indexOf(tab);
            if (currentIndex === 0) {
                nextButton.innerHTML = '<span>Sürüş Sırası Kuralları</span>';
            } else if (currentIndex === 1) {
                nextButton.innerHTML = '<span>Sürüş Bitimi Kuralları</span>';
            } else {
                nextButton.innerHTML = '<span>Tamam</span>';
            }
        });
    });

    // İlerle butonu işlevi
    nextButton.addEventListener('click', () => {
        const currentTab = document.querySelector('.sub-tab-button.active');
        const nextTab = currentTab.nextElementSibling;

        if (nextTab) {
            nextTab.click();
        } else if (nextButton.textContent === 'Tamam') {
            window.location.href = 'driving-guide.html';
        }
    });
}); 