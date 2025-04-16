document.addEventListener('DOMContentLoaded', function() {
    const vehicleOptions = document.querySelectorAll('.vehicle-option');
    const searchInput = document.querySelector('.search-input');
    const faqList = document.querySelector('.faq-list');

    // URL'den dil ve ülke kodunu al
    const urlParams = new URLSearchParams(window.location.search);
    const langCode = urlParams.get('langCode') || 'TR';
    const countryCode = urlParams.get('countryCode') || 'TR';

    // JSON dosyasından soruları yükle
    loadFaqQuestions(langCode, countryCode);

    // Araç seçeneklerine tıklama işlevi
    vehicleOptions.forEach(option => {
        option.addEventListener('click', () => {
            // İlgili araç türüne özel soruları göster/filtrele
            const vehicleType = option.querySelector('span').textContent.toLowerCase();
            // Burada filtreleme mantığı eklenebilir
        });
    });

    // Arama işlevi
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            
            if (searchTerm === '') {
                // Arama terimi boşsa tüm soruları göster
                item.style.display = 'block';
            } else {
                // Arama terimi soru içinde geçiyorsa göster, geçmiyorsa gizle
                item.style.display = question.includes(searchTerm) ? 'block' : 'none';
            }
        });
    });
});

async function loadFaqQuestions(langCode, countryCode) {
    try {
        // Ülke koduna göre JSON dosyasını seç
        const jsonFile = `ortak_konular_${countryCode.toLowerCase()}.json`;
        const response = await fetch(jsonFile);
        const data = await response.json();

        // FAQ listesini temizle
        const faqList = document.querySelector('.faq-list');
        faqList.innerHTML = '';

        // Soruları sıraya göre sırala
        const sortedQuestions = data.sort((a, b) => a.Sıra - b.Sıra);

        // JSON'dan gelen soruları ekle
        sortedQuestions.forEach(question => {
            // Dil koduna göre soru ve cevabı seç
            const questionText = question[`Soru (${langCode})`];
            const answerText = question[`Cevap (${langCode})`];

            // Eğer seçilen dilde soru ve cevap varsa ekle
            if (questionText && answerText) {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.innerHTML = `
                    <div class="faq-question">
                        <span>${questionText}</span>
                        <img src="images/chevron-down.svg" alt="Aç/Kapat" class="chevron-icon">
                    </div>
                    <div class="faq-answer" style="display: none;">
                        <p>${answerText}</p>
                    </div>
                `;
                faqList.appendChild(faqItem);
            }
        });

        // Yeni eklenen öğelere tıklama işlevi ekle
        const newFaqItems = document.querySelectorAll('.faq-item');
        newFaqItems.forEach(item => {
            item.addEventListener('click', () => {
                const answer = item.querySelector('.faq-answer');
                const chevron = item.querySelector('.chevron-icon');
                
                // Cevabı göster/gizle
                answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
                
                // Ok ikonunu döndür
                chevron.style.transform = answer.style.display === 'block' 
                    ? 'rotate(180deg)' 
                    : 'rotate(0deg)';
            });
        });

    } catch (error) {
        console.error('FAQ soruları yüklenirken hata oluştu:', error);
        // Hata durumunda varsayılan Türkçe içeriği göster
        if (langCode !== 'TR' || countryCode !== 'TR') {
            loadFaqQuestions('TR', 'TR');
        }
    }
} 