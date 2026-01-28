// Sayfa içeriğini güncelleme fonksiyonu
function updateContent() {
    // Mevcut dil kodunu al
    const languageCode = window.currentLanguage || 'TR';
    
    // JSON dosyasını yükle
    fetch('how_to_use.json')
        .then(response => response.json())
        .then(data => {
            // Sayfa başlığını güncelle
            document.title = data.title[languageCode];
            document.querySelector('.header h1').textContent = data.title[languageCode];

            // Tab başlıklarını güncelle
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach((button, index) => {
                if (data.tabs[index]) {
                    button.textContent = data.tabs[index]['title (' + languageCode + ')'];
                }
            });

            // Scooter slider içeriğini güncelle
            const scooterSlider = document.getElementById('scooter-slider');
            if (scooterSlider && data.scooter) {
                const slides = scooterSlider.querySelectorAll('.slide');
                slides.forEach((slide, index) => {
                    if (data.scooter[index]) {
                        const title = slide.querySelector('h2');
                        const description = slide.querySelector('p');
                        if (title) title.textContent = data.scooter[index]['title (' + languageCode + ')'];
                        if (description) description.textContent = data.scooter[index]['description (' + languageCode + ')'];
                    }
                });
            }

            // Moped slider içeriğini güncelle
            const mopedSlider = document.getElementById('moped-slider');
            if (mopedSlider && data.moped) {
                const slides = mopedSlider.querySelectorAll('.slide');
                slides.forEach((slide, index) => {
                    if (data.moped[index]) {
                        const title = slide.querySelector('h2');
                        const description = slide.querySelector('p');
                        if (title) title.textContent = data.moped[index]['title (' + languageCode + ')'];
                        if (description) description.textContent = data.moped[index]['description (' + languageCode + ')'];
                    }
                });
            }

            // E-Bike slider içeriğini güncelle
            const ebikeSlider = document.getElementById('ebike-slider');
            if (ebikeSlider && data.ebike) {
                const slides = ebikeSlider.querySelectorAll('.slide');
                slides.forEach((slide, index) => {
                    if (data.ebike[index]) {
                        const title = slide.querySelector('h2');
                        const description = slide.querySelector('p');
                        if (title) title.textContent = data.ebike[index]['title (' + languageCode + ')'];
                        if (description) description.textContent = data.ebike[index]['description (' + languageCode + ')'];
                    }
                });
            }

            // Son slide içeriğini güncelle (tüm slider'lar için)
            const finalSlides = document.querySelectorAll('.final-slide');
            finalSlides.forEach(slide => {
                const finalTitle = slide.querySelector('.final-title');
                if (finalTitle) {
                    finalTitle.textContent = data.lastslide['title (' + languageCode + ')'];
                }

                const safetyRules = slide.querySelectorAll('.safety-rule');
                safetyRules.forEach((rule, index) => {
                    if (data.lastslide.rules[index]) {
                        const ruleTitle = rule.querySelector('h3');
                        const ruleDescription = rule.querySelector('p');
                        if (ruleTitle) ruleTitle.textContent = data.lastslide.rules[index]['title (' + languageCode + ')'];
                        if (ruleDescription) ruleDescription.textContent = data.lastslide.rules[index]['description (' + languageCode + ')'];
                    }
                });
            });

            // İlerle butonunu güncelle
            const nextButton = document.querySelector('.next-button');
            if (nextButton) {
                const activeSlider = document.querySelector('.slider.active');
                const slides = activeSlider.querySelectorAll('.slide');
                const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
                const isLastSlide = currentIndex === slides.length - 1;
                
                // Son slide'da "Tamam", diğerlerinde "İlerle" göster
                nextButton.textContent = isLastSlide ? 
                    data['next-button'][1]['title (' + languageCode + ')'] : 
                    data['next-button'][0]['title (' + languageCode + ')'];
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
    const tabButtons = document.querySelectorAll('.tab-button');
    const sliders = document.querySelectorAll('.slider');
    const nextButton = document.querySelector('.next-button');
    const dots = document.querySelectorAll('.dot');
    let currentSlideIndex = 0; // Aktif slide indeksini takip etmek için

    // Slide geçiş fonksiyonu
    function goToSlide(currentIndex, direction) {
        const activeSlider = document.querySelector('.slider.active');
        const slides = activeSlider.querySelectorAll('.slide');
        const nextIndex = direction === 'next' 
            ? currentIndex + 1 
            : currentIndex - 1;

        // Son slide dahil tüm slide'ları göster
        if (nextIndex >= 0 && nextIndex <= slides.length - 1) {
            slides[currentIndex].classList.remove('active');
            slides[nextIndex].classList.add('active');
            
            // Dots'ları güncelle
            dots[currentIndex].classList.remove('active');
            dots[nextIndex].classList.add('active');
            
            // Son sayfa kontrolü
            const isLastSlide = nextIndex === slides.length - 1;
            const fixedBottom = document.querySelector('.fixed-bottom');
            const sliderContainer = document.querySelector('.slider-container');
            
            if (isLastSlide) {
                fixedBottom.classList.add('final-slide-active');
                sliderContainer.classList.add('final-slide-active');
                // JSON'dan "Tamam" metnini al
                fetch('how_to_use.json')
                    .then(response => response.json())
                    .then(data => {
                        const languageCode = window.currentLanguage || 'TR';
                        nextButton.textContent = data['next-button'][1]['title (' + languageCode + ')'];
                    });
            } else {
                fixedBottom.classList.remove('final-slide-active');
                sliderContainer.classList.remove('final-slide-active');
                // JSON'dan "İlerle" metnini al
                fetch('how_to_use.json')
                    .then(response => response.json())
                    .then(data => {
                        const languageCode = window.currentLanguage || 'TR';
                        nextButton.textContent = data['next-button'][0]['title (' + languageCode + ')'];
                    });
            }

            currentSlideIndex = nextIndex; // Aktif slide indeksini güncelle
        }
    }

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
                nextButton.style.color = '#323232';
            }

            // İlgili slider'ı göster ve aktif slide'ı ayarla
            const targetTab = button.dataset.tab;
            sliders.forEach(slider => {
                slider.classList.remove('active');
                if (slider.id === `${targetTab}-slider`) {
                    slider.classList.add('active');
                    // Tüm slide'ları gizle
                    const slides = slider.querySelectorAll('.slide');
                    slides.forEach(slide => slide.classList.remove('active'));
                    // Aktif slide'ı göster
                    if (currentSlideIndex < slides.length) {
                        slides[currentSlideIndex].classList.add('active');
                        // Dots'ları güncelle
                        dots.forEach((dot, index) => {
                            if (index === currentSlideIndex) {
                                dot.classList.add('active');
                            } else {
                                dot.classList.remove('active');
                            }
                        });
                    }
                }
            });
        });
    });

    // Slider işlevselliği
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        
        // Touch olayları
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, false);

        slider.addEventListener('touchmove', (e) => {
            // Final slide aktifse scroll'a izin ver
            const activeSlide = slider.querySelector('.slide.active');
            const isFinalSlide = activeSlide && activeSlide.classList.contains('final-slide');
            
            if (isFinalSlide) {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchStartX);
                const deltaY = Math.abs(touch.clientY - touchStartY);
                
                // Dikey scroll yapılıyorsa (yataydan fazla) engelleme
                if (deltaY > deltaX) {
                    // Dikey scroll'a izin ver
                    return;
                }
            }
            
            e.preventDefault(); // Sayfanın kaymasını engelle
        }, false);

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            const currentSlideIndex = Array.from(slides).findIndex(slide => 
                slide.classList.contains('active')
            );
            
            // Final slide'da swipe ile slide geçişini engelle
            const activeSlide = slides[currentSlideIndex];
            const isFinalSlide = activeSlide && activeSlide.classList.contains('final-slide');
            
            if (isFinalSlide) {
                // Final slide'da sadece scroll yapılabilir, slide geçişi yok
                return;
            }

            // Minimum kaydırma mesafesi (piksel)
            const minSwipeDistance = 50;

            if (Math.abs(difference) > minSwipeDistance) {
                // Sağa kaydırma
                if (difference > 0 && currentSlideIndex < slides.length - 1) {
                    goToSlide(currentSlideIndex, 'next');
                }
                // Sola kaydırma
                else if (difference < 0 && currentSlideIndex > 0) {
                    goToSlide(currentSlideIndex, 'prev');
                }
            }
        }, false);
    });

    // İlerle/Tamam butonu tıklama olayı
    nextButton.addEventListener('click', () => {
        const activeSlider = document.querySelector('.slider.active');
        const slides = activeSlider.querySelectorAll('.slide');
        const currentIndex = Array.from(slides).findIndex(slide => 
            slide.classList.contains('active')
        );

        // Son slide kontrolü
        const isLastSlide = currentIndex === slides.length - 1;
        
        // Eğer son slide'daysa ana sayfaya yönlendir
        if (isLastSlide) {
            window.location.href = 'help-support.html';
            return;
        }
        
        // Diğer durumlarda bir sonraki slide'a geç
        goToSlide(currentIndex, 'next');
    });
}); 