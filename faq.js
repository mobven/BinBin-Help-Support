document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    const vehicleOptions = document.querySelectorAll('.vehicle-option');
    const searchInput = document.querySelector('.search-input');

    // FAQ öğelerine tıklama işlevi
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const chevron = item.querySelector('.chevron-icon');
            chevron.style.transform = chevron.style.transform === 'rotate(180deg)' 
                ? 'rotate(0deg)' 
                : 'rotate(180deg)';
        });
    });

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