document.addEventListener('DOMContentLoaded', async function() {
    try {
        // JSON dosyasını yükle
        const response = await fetch('help_support.json');
        const data = await response.json();
        
        // Mevcut dil kodunu al
        const languageCode = window.currentLanguage;
        
        // Sayfa başlığını güncelle
        document.title = data.title[languageCode];
        document.querySelector('.header h1').textContent = data.title[languageCode];
        
        // BinAsistan başlığını güncelle
        const binAsistanTitle = document.querySelector('#binAsistanCard h2');
        if (binAsistanTitle) {
            binAsistanTitle.textContent = data.assistant[`title (${languageCode})`];
        }
        
        // Nav item başlıklarını güncelle
        const navItems = document.querySelectorAll('.nav-item span');
        navItems.forEach((item, index) => {
            let translationKey;
            switch(index) {
                case 0:
                    translationKey = 'how-to-use';
                    break;
                case 1:
                    translationKey = 'driving-guide';
                    break;
                case 2:
                    translationKey = 'faq';
                    break;
            }
            
            if (translationKey && data[translationKey]) {
                item.textContent = data[translationKey][`title (${languageCode})`];
            }
        });
    } catch (error) {
        console.error('Dil dosyası yüklenirken hata oluştu:', error);
    }
});

function updateFaqLink(langCode, countryCode) {
    const faqLink = document.getElementById('faqLink');
    if (faqLink) {
        faqLink.href = `faq.html?langCode=${langCode}&countryCode=${countryCode}`;
    }
} 