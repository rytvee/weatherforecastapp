const API_KEY = "";
    const form = document.getElementById("weatherForm");
    const weatherDiv = document.getElementById("weather");
    const dateInput = document.getElementById("dateInput");

    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 10);

    function formatDate(date) {
      return date.toISOString().split('T')[0];
    }

    dateInput.min = formatDate(today);
    dateInput.max = formatDate(maxDate);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const city = document.getElementById("cityInput").value.trim();
      const targetDate = document.getElementById("dateInput").value;

      weatherDiv.style.display = "none";

      if (!city || !targetDate) return;

      const selected = new Date(targetDate);
      const diffTime = selected.getTime() - new Date().getTime();
      const daysAhead = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysAhead < 0 || daysAhead > 10) {
        weatherDiv.innerHTML = `<p style="color:red;">Please choose a date within the next 10 days.</p>`;
        weatherDiv.style.display = "block";
        return;
      }

      fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=${daysAhead + 1}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch forecast");
          return res.json();
        })
        .then(data => {
          const dayData = data.forecast.forecastday.find(day => day.date === targetDate);
          if (!dayData) {
            weatherDiv.innerHTML = `<p style="color:red;">No forecast available for the selected date.</p>`;
            weatherDiv.style.display = "block";
            return;
          }

          weatherDiv.innerHTML = `
            <h2>${data.location.name}, ${data.location.country}</h2>
            <h3>${dayData.date}</h3>
            <img src="https:${dayData.day.condition.icon}" alt="${dayData.day.condition.text}" onerror="this.style.display='none'">
            <p><strong>Condition:</strong> ${dayData.day.condition.text}</p>
            <p><strong>Max Temp:</strong> ${dayData.day.maxtemp_c}°C</p>
            <p><strong>Min Temp:</strong> ${dayData.day.mintemp_c}°C</p>
          `;
          weatherDiv.style.display = "block";
        })
        .catch(err => {
          weatherDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
          weatherDiv.style.display = "block";
        });
    });
