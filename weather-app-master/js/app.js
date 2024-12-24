getForecast("Mumbai")
    .then(data => updateUI(data, "Mumbai"))
    .catch(err => console.log(err));

(function ($, document, window) {

    $(document).ready(function () {

        // Cloning main navigation for mobile menu
        $(".mobile-navigation").append($(".main-navigation .menu").clone());

        // Mobile menu toggle 
        $(".menu-toggle").click(function () {
            $(".mobile-navigation").slideToggle();
        });
    });

    $(window).load(function () {

    });

})(jQuery, document, window);

/*******************************************************************
                COMMUNICATING WITH FORECAST.JS
*******************************************************************/

const cityForm = document.querySelector('form');
const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const updateUI = (data, cityName) => {


    const days = document.getElementsByClassName('day');
    const date = document.querySelector('.date');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');
    const windDegree = document.getElementById('wind-degree');
    const location = document.querySelector('.location');
    const temps = document.getElementsByClassName('temp');
    const icons = document.getElementsByClassName('weather-icon');

    location.innerHTML = cityName;
    humidity.innerHTML = data.list[0].main.humidity + "%";

    windSpeed.innerHTML = (Math.round(data.list[0].wind.speed * 3.6 * 10) / 10) + "km/hr";

    windDegree.innerHTML = (data.list[0].wind.deg + "<sup>o</sup>");


    const todaysDate = new Date(data.list[0].dt_txt);
    const todaysMonth = monthName[todaysDate.getMonth()];
    const todaysDay = todaysDate.getDay();
    date.innerHTML = todaysDate.getDate() + " " + todaysMonth;

    var i = 0;
    var j = 0;

    for (let element of days) {
        const day = dayName[(todaysDay + i) % 7];
        element.innerHTML = day;

        const temp = Math.round(data.list[0].main.temp * 10) / 10;
        temps[i].innerHTML = temp + "<sup>o</sup>C";

        icons[i].src = "images/icons/" + data.list[j].weather[0].icon + ".svg";
        i++;
        j += 8;
    }
}

cityForm.addEventListener('submit', e => {
    e.preventDefault();
    let cityName = cityForm.city.value.trim();
    if (cityName == "") {
        cityName = "Mumbai";
    }

    getForecast(cityName)
        .then(data => updateUI(data, cityName))
        .catch(err => console.log(err));


});

document.getElementById('search-button').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent form submission

    const city = document.getElementById('city').value;
    const temp = document.querySelector('.temp').textContent.trim();
    const humidity = document.getElementById('humidity').textContent.trim();
    const windSpeed = document.getElementById('wind-speed').textContent.trim();
    const windDegree = document.getElementById('wind-degree').textContent.trim();
    const language = document.getElementById('language-selector').value;

    const messages = {
        en: `The weather in ${city} is ${temp} with a humidity of ${humidity}, wind speed of ${windSpeed}, and wind direction of ${windDegree}.`,
        hi: `${city} में मौसम ${temp} है, आर्द्रता ${humidity}, हवा की गति ${windSpeed}, और हवा की दिशा ${windDegree} है।`,
        kn: `${city}ನಲ್ಲಿ ಹವಾಮಾನ ${temp}, ಆರ್ದ್ರತೆ ${humidity}, ಗಾಳಿಯ ವೇಗ ${windSpeed}, ಮತ್ತು ಗಾಳಿಯ ದಿಕ್ಕು ${windDegree} ಇದೆ.`,
        mr: `${city} मध्ये हवामान ${temp}, आर्द्रता ${humidity}, वाऱ्याचा वेग ${windSpeed}, आणि वाऱ्याचा दिशा ${windDegree} आहे.`
    };

    const ttsMessage = messages[language] || messages.en;

    const utterance = new SpeechSynthesisUtterance(ttsMessage);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
});
