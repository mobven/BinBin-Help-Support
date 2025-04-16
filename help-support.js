document.addEventListener('DOMContentLoaded', function() {
    // URL'den dil ve ülke kodunu al
    const urlParams = new URLSearchParams(window.location.search);
    const langCode = urlParams.get('langCode') || 'TR'; // Varsayılan olarak 'TR'
    const countryCode = urlParams.get('countryCode') || 'TR'; // Varsayılan olarak 'TR'

    // Dil ve ülke koduna göre içeriği güncelle
    updateContentByLanguage(langCode);
    
    // FAQ linkini güncelle
    updateFaqLink(langCode, countryCode);

    // Bin Asistan kartına tıklama olayı
    const binAsistanCard = document.getElementById('binAsistanCard');
    if (binAsistanCard) {
        binAsistanCard.addEventListener('click', function() {
            window.location.href = 'app://zendesk';
        });
    }
});

function updateContentByLanguage(langCode) {
    // Dil koduna göre içerik güncelleme
    const titleElement = document.querySelector('.header h1');
    const supportTitle = document.querySelector('.support-content h2');
    const supportDescription = document.querySelector('.support-content p');

    switch(langCode.toUpperCase()) {
        case 'TR':
            titleElement.textContent = 'Yardım & Destek';
            supportTitle.textContent = 'BinAsistan';
            supportDescription.textContent = 'Soruların için BinAsistan çok yakında burada!';
            break;
        case 'EN':
            titleElement.textContent = 'Help & Support';
            supportTitle.textContent = 'BinAssistant';
            supportDescription.textContent = 'BinAssistant will be here soon for your questions!';
            break;
        case 'ARN':
            titleElement.textContent = 'Ndihmë & Mbështetje';
            supportTitle.textContent = 'BinAsistent';
            supportDescription.textContent = 'BinAsistent do të jetë këtu së shpejti për pyetjet tuaja!';
            break;
        // Diğer diller için case'ler eklenebilir
        default:
            titleElement.textContent = 'Yardım & Destek';
            supportTitle.textContent = 'BinAsistan';
            supportDescription.textContent = 'Soruların için BinAsistan çok yakında burada!';
    }
}

function updateFaqLink(langCode, countryCode) {
    const faqLink = document.getElementById('faqLink');
    if (faqLink) {
        faqLink.href = `faq.html?langCode=${langCode}&countryCode=${countryCode}`;
    }
} 