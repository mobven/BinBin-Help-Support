document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleType = urlParams.get('vehicle') || 'scooter'; // Varsayılan scooter
    const langCode = urlParams.get('langCode') || 'TR';
    const countryCode = urlParams.get('countryCode') || 'TR';

    const vehicleNameMap = {
        'scooter': 'Scooter',
        'moped': 'Moped',
        'ebike': 'E-Bike'
    };

    const pageTitle = document.getElementById('faq-details-title');
    const filterTabsContainer = document.querySelector('.filter-tabs');
    const faqListContainer = document.querySelector('.faq-list-details');
    const searchInput = document.querySelector('.search-input');
    const bodyElement = document.body;

    // Sayfa başlığını ayarla
    if (vehicleType && vehicleNameMap[vehicleType]) {
        pageTitle.textContent = vehicleNameMap[vehicleType];
        document.title = `SSS - ${vehicleNameMap[vehicleType]}`;
        // Body elementine araç sınıfını ekle
        bodyElement.classList.add(`vehicle-${vehicleType}`);
    } else {
        pageTitle.textContent = 'Sıkça Sorulan Sorular';
        document.title = 'SSS Detay';
        bodyElement.classList.add('vehicle-default'); // Varsayılan sınıf
    }

    // JSON verisini yükle ve sayfayı oluştur
    loadFAQData(vehicleType, langCode, countryCode);

    async function loadFAQData(vehicle, lang, country) {
        // Önce Türkçe dosyayı deneyelim (varsayılan ve fallback)
        let jsonFile = `${vehicle}_faq_${country.toLowerCase()}.json`;
        let jsonData;

        try {
            const response = await fetch(jsonFile);
            if (!response.ok) {
                // Belirtilen ülke için dosya yoksa veya hata varsa TR'ye fallback
                console.warn(`JSON dosyası bulunamadı: ${jsonFile}. Türkçe'ye fallback yapılıyor.`);
                jsonFile = `${vehicle}_faq_tr.json`;
                const fallbackResponse = await fetch(jsonFile);
                 if (!fallbackResponse.ok) {
                     // TR dosyası da yoksa genel bir hata
                     throw new Error(`Fallback JSON dosyası da bulunamadı: ${jsonFile}`);
                 }
                jsonData = await fallbackResponse.json();
            } else {
                jsonData = await response.json();
            }

            // Sekmeleri ve Soruları Oluştur
            createFilterTabs(jsonData.type);
            createFAQItems(jsonData.faq, lang); 

            // Arama ve Akordiyon işlevlerini yeniden bağla
            setupEventListeners();

        } catch (error) {
            console.error('FAQ verisi yüklenirken hata oluştu:', error);
            faqListContainer.innerHTML = '<p>Sorular yüklenirken bir hata oluştu.</p>';
        }
    }

    function createFilterTabs(types) {
        filterTabsContainer.innerHTML = ''; // Mevcut sekmeleri temizle

        // "Tümü" sekmesini ekle
        const allTab = document.createElement('button');
        allTab.className = 'filter-tab active'; // Başlangıçta aktif
        allTab.dataset.filter = 'all';
        allTab.textContent = 'Tümü';
        filterTabsContainer.appendChild(allTab);

        // JSON'dan gelen tiplere göre sekmeleri ekle
        if (types && Array.isArray(types)) {
            types.forEach(type => {
                const tab = document.createElement('button');
                tab.className = 'filter-tab';
                tab.dataset.filter = type.id; // Filtre değeri TypeId olacak
                tab.textContent = type.title;
                filterTabsContainer.appendChild(tab);
            });
        }
    }

    function createFAQItems(faqData, lang) {
        faqListContainer.innerHTML = ''; // Mevcut soru listesini temizle

        if (!faqData || !Array.isArray(faqData)) return;
        
        // Soruları JSON'daki sıraya göre (veya belirtilmişse Sıra'ya göre) işle
        // Şu anki JSON'da Sıra var gibi görünmüyor, geldiği gibi işleyelim.
        // Eğer sıralama gerekirse: faqData.sort((a, b) => a.Sıra - b.Sıra);

        faqData.forEach(faq => {
            // Dil koduna göre soru ve cevabı seç, yoksa TR veya ENG fallback
            let questionText = faq[`Soru (${lang.toUpperCase()})`];
            let answerText = faq[`Cevap (${lang.toUpperCase()})`];

            if (!questionText) {
                questionText = faq['Soru (TR)'] || faq['Soru (ENG)'] || 'Soru bulunamadı';
            }
            if (!answerText) {
                 answerText = faq['Cevap (TR)'] || faq['Cevap (ENG)'] || 'Cevap bulunamadı';
            }

            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.dataset.category = faq.TypeId; // Kategori TypeId olacak

            faqItem.innerHTML = `
                <div class="faq-question">
                    <span>${questionText}</span>
                    <img src="images/chevron-down.svg" alt="Aç/Kapat" class="chevron-icon">
                </div>
                <div class="faq-answer" style="display: none;">
                    <p>${answerText.replace(/\n/g, '<br>')}</p> <!-- Satır sonlarını HTML'e çevir -->
                </div>
            `;
            faqListContainer.appendChild(faqItem);
        });
    }

    function setupEventListeners() {
        // Filtreleme İşlevi (Yeni sekmeler için)
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.removeEventListener('click', handleTabClick); // Önceki listenerları kaldır (varsa)
            tab.addEventListener('click', handleTabClick); 
        });

        // Arama İşlevi
        searchInput.removeEventListener('input', handleSearchInput); // Önceki listenerı kaldır
        searchInput.addEventListener('input', handleSearchInput);

        // Soru/Cevap Akordiyon İşlevi (Yeni sorular için)
        const faqItems = document.querySelectorAll('.faq-list-details .faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                 question.removeEventListener('click', handleAccordionClick); // Önceki listenerları kaldır
                 question.addEventListener('click', handleAccordionClick);
            }
           
            // Başlangıç stilini ayarla (cevap gizli, ikon normal)
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.chevron-icon');
            if(answer) answer.style.display = 'none';
            if(icon) icon.style.transform = 'rotate(0deg)';
            item.classList.remove('active');
        });
    }
    
    // Event handler fonksiyonları
    function handleTabClick() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const filterValue = this.dataset.filter;
        filterFAQItems(filterValue, searchInput.value.toLowerCase());
    }

    function handleSearchInput() {
        const searchTerm = this.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-tab.active').dataset.filter;
        filterFAQItems(activeFilter, searchTerm);
    }
    
    function handleAccordionClick() {
         const item = this.closest('.faq-item');
         if (!item) return;

         const answer = item.querySelector('.faq-answer');
         const icon = item.querySelector('.chevron-icon');

         if (answer && icon) {
            const isVisible = answer.style.display === 'block';
            answer.style.display = isVisible ? 'none' : 'block';
            icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
            item.classList.toggle('active', !isVisible);
         }
    }

    function filterFAQItems(filter, searchTerm = '') {
        const faqItems = document.querySelectorAll('.faq-list-details .faq-item');
        faqItems.forEach(item => {
            const category = item.dataset.category; // TypeId
            const questionText = item.querySelector('.faq-question span')?.textContent.toLowerCase() || '';
            const answerText = item.querySelector('.faq-answer p')?.textContent.toLowerCase() || '';

            // Kategori eşleşmesi (String karşılaştırması yapalım)
            const categoryMatch = (filter === 'all' || String(category) === String(filter));
            // Arama eşleşmesi
            const searchMatch = (searchTerm === '' || questionText.includes(searchTerm) || answerText.includes(searchTerm));

            if (categoryMatch && searchMatch) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}); 