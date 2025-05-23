document.addEventListener('DOMContentLoaded', async function() {
    try {
        // JSON dosyasını yükle
        const response = await fetch('driving_rules.json');
        const data = await response.json();
        
        // Mevcut dil kodunu al
        const languageCode = window.currentLanguage;
        
        // Sayfa başlığını güncelle
        document.title = data.title[languageCode];
        document.querySelector('.header h1').textContent = data.title[languageCode];
        
        // Guide içeriklerini güncelle
        const guideItems = document.querySelectorAll('.guide-item');
        guideItems.forEach((item, index) => {
            const title = item.querySelector('h2');
            const description = item.querySelector('p');
            
            if (data.guide[index]) {
                title.textContent = data.guide[index][`title (${languageCode})`];
                description.textContent = data.guide[index][`description (${languageCode})`];
            }
        });
    } catch (error) {
        console.error('Dil dosyası yüklenirken hata oluştu:', error);
    }
}); 