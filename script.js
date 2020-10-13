const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const pageBtn = document.getElementById('page-select');

var english = true;

// Show Loading
function loading(){
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide Loading
function complete(){
    if(!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

// Change language of page
function togglePage(){
    english = !english;
    getQuote();
}

// Get Quote from API
async function getQuote(){
    loading();


    var apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    const proxyUrl = 'https://corsreverseproxyserver.herokuapp.com/'; // to fix cors error

    try {
        if(english) {
            apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'
            pageBtn.innerText = '中文';
            newQuoteBtn.innerText = 'New Quote'
        }
        else {
            apiUrl = 'https://data.zhai78.com/openOneGood.php';
            pageBtn.innerText = 'English';
            newQuoteBtn.innerText = '新启示'
        }
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        console.log(data.quoteAuthor)
        if(data.quoteAuthor === '' || data.quoteAuthor === undefined) {
            authorText.innerText = ''
        }else {
            authorText.innerText = data.quoteAuthor
        }

        // Reduce font size if there is long quotes
        if(data.quoteText.length > 80 || data.txt.length > 80) {
            quoteText.classList.add('long-quote');
        }else {
            quoteText.classList.remove('long-quote');
        }

        if(english){
            quoteText.innerText = data.quoteText;
        }else {
            quoteText.innerText = data["txt"];
        }

        // Stop loader, show container
        complete()

    }catch(error) {
        getQuote();
    }
}

// Tweet Quote
function tweetQuote(){
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
pageBtn.addEventListener('click', togglePage);

// On load
getQuote()