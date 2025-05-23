// Sayfa içeriğini güncelleme fonksiyonu
function updateContent() {
    // Mevcut dil kodunu al
    const languageCode = window.currentLanguage || 'TR';
    
    // JSON dosyasını yükle
    fetch('mode_selection.json')
        .then(response => response.json())
        .then(data => {
            // Sayfa başlığını güncelle
            document.title = data.title[languageCode];
            document.querySelector('.header h1').textContent = data.title[languageCode];
            
            // Tab başlıklarını güncelle
            const tabButtons = document.querySelectorAll('.mode-tab-button');
            tabButtons.forEach((button, index) => {
                if (data.tabs[index]) {
                    button.textContent = data.tabs[index].title[languageCode];
                }
            });

            // Mod seçimi içeriğini güncelle
            const modSection = document.querySelector('.mode-section[data-tab="mod"]');
            if (modSection && data.tabs[0]) {
                modSection.querySelector('h2').textContent = data.tabs[0].title[languageCode];
                modSection.querySelector('.mode-info').textContent = data.tabs[0]['mod-info'][languageCode];
                modSection.querySelector('.mode-description').textContent = data.tabs[0]['mode-description'][languageCode];
                modSection.querySelector('.mode-tip').textContent = data.tabs[0]['mode-tip'][languageCode];
            }

            // Kullanım alanları içeriğini güncelle
            const usageSection = document.querySelector('.mode-section[data-tab="usage"]');
            if (usageSection && data.tabs[1]) {
                // ECO Mod
                const ecoMode = usageSection.querySelector('.usage-item:nth-child(1)');
                if (ecoMode) {
                    ecoMode.querySelector('h2').textContent = data.tabs[1]['eco-mode'].title[languageCode];
                    ecoMode.querySelector('p').textContent = data.tabs[1]['eco-mode'].description[languageCode];
                }

                // Drive Mod
                const driveMode = usageSection.querySelector('.usage-item:nth-child(2)');
                if (driveMode) {
                    driveMode.querySelector('h2').textContent = data.tabs[1]['drive-mode'].title[languageCode];
                    driveMode.querySelector('p').textContent = data.tabs[1]['drive-mode'].description[languageCode];
                }

                // Sport Mod
                const sportMode = usageSection.querySelector('.usage-item:nth-child(3)');
                if (sportMode) {
                    sportMode.querySelector('h2').textContent = data.tabs[1]['sport-mode'].title[languageCode];
                    sportMode.querySelector('p').textContent = data.tabs[1]['sport-mode'].description[languageCode];
                }
            }

            // Alt buton metnini güncelle
            const nextButton = document.querySelector('.next-button span');
            if (nextButton) {
                const activeTab = document.querySelector('.mode-tab-button.active');
                if (activeTab && activeTab.dataset.tab === 'mod') {
                    nextButton.textContent = data.tabs[1].title[languageCode];
                } else {
                    nextButton.textContent = data.tabs[0].title[languageCode];
                }
            }
        })
        .catch(error => {
            console.error('Dil dosyası yüklenirken hata oluştu:', error);
        });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // İlk içerik güncellemesi
    updateContent();

    // Tab değiştirme işlevi
    const tabButtons = document.querySelectorAll('.mode-tab-button');
    const nextButton = document.querySelector('.next-button span');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Aktif tab'ı güncelle
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // İçerik alanlarını güncelle
            const sections = document.querySelectorAll('.mode-section');
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.dataset.tab === tab) {
                    section.classList.add('active');
                }
            });

            // İçeriği güncelle
            updateContent();
        });
    });

    // Alt buton tıklama işlevi
    const nextButtonElement = document.querySelector('.next-button');
    if (nextButtonElement) {
        nextButtonElement.addEventListener('click', () => {
            const activeTab = document.querySelector('.mode-tab-button.active');
            const nextTab = activeTab === tabButtons[0] ? tabButtons[1] : tabButtons[0];
            nextTab.click();
        });
    }
});