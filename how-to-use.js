document.addEventListener('DOMContentLoaded', function() {
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
                nextButton.textContent = 'Tamam';
            } else {
                fixedBottom.classList.remove('final-slide-active');
                sliderContainer.classList.remove('final-slide-active');
                nextButton.textContent = 'İlerle';
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
        let touchEndX = 0;
        
        // Touch olayları
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, false);

        slider.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Sayfanın kaymasını engelle
        }, false);

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            const currentSlideIndex = Array.from(slides).findIndex(slide => 
                slide.classList.contains('active')
            );

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

        // Eğer buton "Tamam" ise ve son slide'daysa ana sayfaya yönlendir
        if (nextButton.textContent === 'Tamam') {
            window.location.href = 'help-support.html';
            return;
        }
        
        // Diğer durumlarda bir sonraki slide'a geç
        goToSlide(currentIndex, 'next');
    });
}); 