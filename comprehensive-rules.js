document.addEventListener('DOMContentLoaded', async function() {
    // Dil kodunu al
    const languageCode = window.currentLanguage || 'TR';
    
    // JSON dosyalarını yükle
    const [ebikeRules, mopedRules, scooterRules, commonData] = await Promise.all([
        fetch('ebike_comprehensive_rules.json').then(response => response.json()),
        fetch('moped_comprehensive_rules.json').then(response => response.json()),
        fetch('scooter_comprehensive_rules.json').then(response => response.json()),
        fetch('comprehensive_rules.json').then(response => response.json())
    ]);

    // Tab butonları ve içerik alanları
    const tabButtons = document.querySelectorAll('.tab-button');
    const rulesContents = document.querySelectorAll('.rules-content');
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const nextButton = document.querySelector('.next-button');
    const tabSlider = document.querySelector('.tab-slider');

    // Tab başlıklarını güncelle
    tabButtons.forEach((button, index) => {
        if (commonData.tabs[index]) {
            button.textContent = commonData.tabs[index]['title (' + languageCode + ')'];
        }
    });

    // İçeriği güncelleme fonksiyonu
    function updateContent(vehicleType, section) {
        const rules = {
            'ebike': ebikeRules,
            'moped': mopedRules,
            'scooter': scooterRules
        }[vehicleType];

        // Sayfa başlığını güncelle
        document.title = commonData.title[languageCode];
        document.querySelector('.header h1').textContent = commonData.title[languageCode];

        // Alt tab başlıklarını güncelle
        subTabButtons.forEach(button => {
            const section = button.dataset.section;
            if (commonData[section]) {
                button.textContent = commonData[section][languageCode];
            }
        });

        // Alt buton metnini güncelle
        const nextButtonSpan = nextButton.querySelector('span');
        if (nextButtonSpan) {
            // Aktif alt tab'a göre buton metnini belirle
            const activeSubTab = document.querySelector('.sub-tab-button.active');
            const section = activeSubTab.dataset.section;
            
            // Section'a göre button array'indeki indeksi belirle
            let buttonIndex = 0;
            if (section === 'during') {
                buttonIndex = 0;
            } else if (section === 'after') {
                buttonIndex = 1;
            }

            nextButtonSpan.textContent = commonData.button[buttonIndex][languageCode];
        }

        // Kural içeriklerini güncelle
        const sectionRules = rules[section];
        const ruleItems = document.querySelectorAll(`#${vehicleType}-rules .rules-section[data-section="${section}"] .rule-item`);

        ruleItems.forEach((item, index) => {
            if (sectionRules[index]) {
                const title = item.querySelector('h2');
                const description = item.querySelector('p');
                
                title.textContent = sectionRules[index][`title (${languageCode})`];
                description.textContent = sectionRules[index][`description (${languageCode})`];
            }
        });
    }

    // Tab değiştirme işlevi
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const vehicleType = button.dataset.tab;
            
            // Aktif tab'ı güncelle
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Tab slider'ı güncelle
            const isSecondTab = button === tabButtons[1];
            const isThirdTab = button === tabButtons[2];
            
            if (isSecondTab) {
                tabSlider.style.transform = 'translateX(calc(100%))';
                tabSlider.style.background = '#15B1FF';
            } else if (isThirdTab) {
                tabSlider.style.transform = 'translateX(calc(200%))';
                tabSlider.style.background = '#3DBCC8';
            } else {
                tabSlider.style.transform = 'translateX(0)';
                tabSlider.style.background = '#00DFF4';
            }

            // İçerik alanlarını güncelle
            rulesContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${vehicleType}-rules`) {
                    content.classList.add('active');
                    // Aktif bölümün içeriğini güncelle
                    const activeSection = document.querySelector(`#${vehicleType}-rules .rules-section.active`).dataset.section;
                    updateContent(vehicleType, activeSection);
                }
            });
        });
    });

    // Alt tab değiştirme işlevi
    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;
            
            // Aktif alt tab'ı güncelle
            subTabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Aktif araç tipini bul
            const activeVehicleType = document.querySelector('.tab-button.active').dataset.tab;
            
            // İlgili bölümün içeriğini güncelle
            const rulesSections = document.querySelectorAll(`#${activeVehicleType}-rules .rules-section`);
            rulesSections.forEach(sectionEl => {
                sectionEl.classList.remove('active');
                if (sectionEl.dataset.section === section) {
                    sectionEl.classList.add('active');
                }
            });

            updateContent(activeVehicleType, section);
        });
    });

    // İlerle butonu işlevi
    nextButton.addEventListener('click', () => {
        const currentTab = document.querySelector('.sub-tab-button.active');
        const nextTab = currentTab.nextElementSibling;

        if (nextTab) {
            nextTab.click();
        } else {
            window.location.href = 'driving-guide.html';
        }
    });

    // Sayfa yüklendiğinde varsayılan içeriği güncelle
    const defaultVehicleType = 'scooter';
    const defaultSection = 'before';
    updateContent(defaultVehicleType, defaultSection);
}); 