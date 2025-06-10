// Dil kodunu URL'den al
const urlParams = new URLSearchParams(window.location.search);
const languageCode = urlParams.get('langCode') || 'TR'; // Varsayılan olarak TR

// Global dil kodu değişkeni
window.currentLanguage = languageCode;

// Dil kodunu diğer sayfalara aktarmak için fonksiyon
function getLanguageCode() {
    return window.currentLanguage;
}

// Dil değişikliği olayını tetikle
function triggerLanguageChange() {
    window.dispatchEvent(new Event('languageChanged'));
}

// Sayfa yüklendiğinde dil kodunu URL'ye ekle
document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = new URL(window.location.href);
    if (!currentUrl.searchParams.has('langCode')) {
        currentUrl.searchParams.set('langCode', languageCode);
        window.history.replaceState({}, '', currentUrl);
    }
});

// Sayfa geçişlerinde dil kodunu korumak için
document.addEventListener('click', function(e) {
    // Tüm link elementlerini kontrol et
    if (e.target.tagName === 'A' || e.target.closest('a')) {
        const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
        const href = link.getAttribute('href');
        
        // Eğer href bir URL ise ve langCode parametresi yoksa ekle
        if (href && !href.startsWith('app://') && !href.startsWith('#')) {
            try {
                const url = new URL(href, window.location.href);
                // Mevcut dil kodunu al
                const currentLangCode = window.currentLanguage;
                // URL'ye dil kodunu ekle
                url.searchParams.set('langCode', currentLangCode);
                // Link'i güncelle
                link.setAttribute('href', url.toString());
            } catch (error) {
                // URL geçerli değilse işlem yapma
                console.log('Invalid URL:', href);
            }
        }
    }
});

// Sayfa yüklendiğinde dil kodunu kontrol et ve güncelle
window.addEventListener('load', function() {
    const currentUrl = new URL(window.location.href);
    console.log('Current URL:', currentUrl.href);
    const urlLangCode = currentUrl.searchParams.get('langCode');
    
    if (urlLangCode && urlLangCode !== window.currentLanguage) {
        window.currentLanguage = urlLangCode;
        triggerLanguageChange();
    }
});