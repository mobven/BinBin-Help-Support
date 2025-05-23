document.addEventListener('DOMContentLoaded', async function() {
    // Dil kodunu al
    const languageCode = window.currentLanguage || 'TR';
    
    // URL'den araç tipini al
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleType = urlParams.get('vehicle') || 'scooter';

    // JSON dosyalarını yükle
    const [faqResponse, vehicleResponse] = await Promise.all([
        fetch('faq.json'),
        fetch(`${vehicleType}_faq_tr.json`)
    ]);
    const faqData = await faqResponse.json();
    const data = await vehicleResponse.json();

    // Sayfa başlığını güncelle
    const vehicleNameMap = {
        'scooter': 'Scooter',
        'moped': 'Moped',
        'ebike': 'E-Bike'
    };
    document.title = `${vehicleNameMap[vehicleType]} - SSS`;
    document.querySelector('#faq-details-title').textContent = vehicleNameMap[vehicleType];

    // Arama kutusu placeholder'ını güncelle
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.placeholder = faqData['search-placeholder'][languageCode];
    }

    // Filtre sekmelerini oluştur
    const filterTabs = document.querySelector('.filter-tabs');
    if (filterTabs) {
        // Tümü sekmesi
        const allTab = document.createElement('button');
        allTab.className = 'filter-tab active';
        allTab.dataset.filter = 'all';
        allTab.textContent = faqData.all[languageCode];
        filterTabs.appendChild(allTab);

        // Diğer sekmeler
        data.type.forEach(category => {
            const tab = document.createElement('button');
            tab.className = 'filter-tab';
            tab.dataset.filter = category.id;
            tab.textContent = category[`title (${languageCode})`];
            filterTabs.appendChild(tab);
        });
    }

    // FAQ listesini oluştur
    const faqList = document.querySelector('.faq-list-details');
    if (faqList) {
        // Soruları sıraya göre sırala
        const sortedFaq = data.faq.sort((a, b) => a.Sıra - b.Sıra);

        sortedFaq.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.dataset.category = faq.TypeId;

            faqItem.innerHTML = `
                <div class="faq-question">
                    <span>${faq[`Soru (${languageCode})`]}</span>
                    <img src="images/chevron-down.svg" alt="Aç/Kapat" class="chevron-icon">
                </div>
                <div class="faq-answer" style="display: none;">
                    <p>${faq[`Cevap (${languageCode})`]}</p>
                </div>
            `;
            faqList.appendChild(faqItem);
        });
    }

    // Dil değişikliğini dinle
    window.addEventListener('languageChanged', function() {
        const newLanguageCode = window.currentLanguage;
        
        // Arama kutusu placeholder'ını güncelle
        if (searchInput) {
            searchInput.placeholder = faqData['search-placeholder'][newLanguageCode];
        }

        // Filtre sekmelerini güncelle
        const tabs = document.querySelectorAll('.filter-tab');
        tabs.forEach((tab, index) => {
            if (index === 0) {
                // Tümü sekmesi
                tab.textContent = faqData.all[newLanguageCode];
            } else {
                // Diğer sekmeler
                const category = data.type[index - 1];
                tab.textContent = category[`title (${newLanguageCode})`];
            }
        });

        // FAQ içeriklerini güncelle
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question span');
            const answer = item.querySelector('.faq-answer p');
            const faq = data.faq[index];

            if (question && answer && faq) {
                question.textContent = faq[`Soru (${newLanguageCode})`];
                answer.textContent = faq[`Cevap (${newLanguageCode})`];
            }
        });
    });

    // Filtre sekmelerine tıklama işlevi
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Aktif sekmeyi güncelle
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filtreleme işlemi
            const filter = tab.dataset.filter;
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Arama işlevi
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question span').textContent.toLowerCase();
                
                if (searchTerm === '') {
                    // Arama terimi boşsa, aktif filtreye göre göster
                    const activeFilter = document.querySelector('.filter-tab.active').dataset.filter;
                    item.style.display = activeFilter === 'all' || item.dataset.category === activeFilter ? 'block' : 'none';
                } else {
                    // Arama terimi soru içinde geçiyorsa göster, geçmiyorsa gizle
                    item.style.display = question.includes(searchTerm) ? 'block' : 'none';
                }
            });
        });
    }

    // FAQ öğelerine tıklama işlevi
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.chevron-icon');

        question.addEventListener('click', () => {
            const isVisible = answer.style.display === 'block';
            answer.style.display = isVisible ? 'none' : 'block';
            icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
            item.classList.toggle('active', !isVisible);
        });
    });
}); 