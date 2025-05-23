// Sayfa içeriğini güncelleme fonksiyonu
function updateContent() {
    // Mevcut dil kodunu al
    const languageCode = window.currentLanguage || 'TR';
    
    // JSON dosyasını yükle
    fetch('map_guide.json')
        .then(response => response.json())
        .then(data => {
            // Sayfa başlığını güncelle
            document.title = data.title[languageCode];
            document.querySelector('.header h1').textContent = data.title[languageCode];
            
            // Tab başlıklarını güncelle
            const tabButtons = document.querySelectorAll('.mode-tab-button');
            tabButtons.forEach((button, index) => {
                if (data['tab-buttons'][index]) {
                    button.textContent = data['tab-buttons'][index][languageCode];
                }
            });

            // Harita Alanları içeriğini güncelle
            const mapSection = document.querySelector('.map-section[data-tab="map"]');
            if (mapSection && data.tabs[0]) {
                // Park Edilemez Alan
                const noParkingArea = mapSection.querySelector('.map-item:nth-child(1)');
                if (noParkingArea) {
                    noParkingArea.querySelector('h2').textContent = data.tabs[0]['no-parking-area']['title (' + languageCode + ')'];
                    noParkingArea.querySelector('p').textContent = data.tabs[0]['no-parking-area']['description (' + languageCode + ')'];
                }

                // İndirimli Park Alanı
                const discountArea = mapSection.querySelector('.map-item:nth-child(2)');
                if (discountArea) {
                    discountArea.querySelector('h2').textContent = data.tabs[0]['discount-area']['title (' + languageCode + ')'];
                    discountArea.querySelector('p').textContent = data.tabs[0]['discount-area']['description (' + languageCode + ')'];
                }

                // Hizmet Dışı Alanlar
                const noServiceArea = mapSection.querySelector('.map-item:nth-child(3)');
                if (noServiceArea) {
                    noServiceArea.querySelector('h2').textContent = data.tabs[0]['no-service-area']['title (' + languageCode + ')'];
                    noServiceArea.querySelector('p').textContent = data.tabs[0]['no-service-area']['description (' + languageCode + ')'];
                }
            }

            // BinBinler içeriğini güncelle
            const binbinSection = document.querySelector('.map-section[data-tab="binbin"]');
            if (binbinSection && data.tabs[1]) {
                // Önerilen BinBin
                const recommendedBinbin = binbinSection.querySelector('.map-item:nth-child(1)');
                if (recommendedBinbin) {
                    recommendedBinbin.querySelector('h2').textContent = data.tabs[1]['recommended-binbin']['title (' + languageCode + ')'];
                    recommendedBinbin.querySelector('p').textContent = data.tabs[1]['recommended-binbin']['description (' + languageCode + ')'];
                }

                // İndirimli BinBin
                const discountedBinbin = binbinSection.querySelector('.map-item:nth-child(2)');
                if (discountedBinbin) {
                    discountedBinbin.querySelector('h2').textContent = data.tabs[1]['discounted-binbin']['title (' + languageCode + ')'];
                    discountedBinbin.querySelector('p').textContent = data.tabs[1]['discounted-binbin']['description (' + languageCode + ')'];
                }

                // Önerilen ve İndirimli BinBin
                const recommendedDiscountedBinbin = binbinSection.querySelector('.map-item:nth-child(3)');
                if (recommendedDiscountedBinbin) {
                    recommendedDiscountedBinbin.querySelector('h2').textContent = data.tabs[1]['recommended-discounted-binbin']['title (' + languageCode + ')'];
                    recommendedDiscountedBinbin.querySelector('p').textContent = data.tabs[1]['recommended-discounted-binbin']['description (' + languageCode + ')'];
                }
            }

            // Alt buton metnini güncelle
            const nextButton = document.querySelector('.next-button span');
            if (nextButton) {
                const activeTab = document.querySelector('.mode-tab-button.active');
                if (activeTab && activeTab.dataset.tab === 'map') {
                    nextButton.textContent = data['tab-buttons'][1][languageCode];
                } else {
                    nextButton.textContent = data['tab-buttons'][0][languageCode];
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
            const sections = document.querySelectorAll('.map-section');
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