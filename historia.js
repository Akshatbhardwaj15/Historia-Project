document.addEventListener('DOMContentLoaded', function() {
    const viewMoreButton = document.querySelector('.viewmore');
    const eventDateInput = document.getElementById('event-date');
    const modal = document.getElementById('myModal');
    const yearContainer = modal.querySelector('.year');
    const sentenceContainer = modal.querySelector('.sentence');
    const additionalDataContainer = modal.querySelector('.additional-data-container');
    const nextButton = modal.querySelector('.next-button');
    const prevButton = modal.querySelector('.prev-button');
    let currentIndex = 0;

    viewMoreButton.addEventListener('click', function() {
        const selectedDate = eventDateInput.value;
        const [year, month, day] = selectedDate.split('-');
        const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.selected && data.selected.length > 0) {
                    const events = data.selected;
                    // Display first event
                    displayEventData(events[currentIndex]);
                    // Show modal
                    modal.style.display = 'block';

                    // Handle next button click
                    nextButton.addEventListener('click', function() {
                        currentIndex = (currentIndex + 1) % events.length;
                        displayEventData(events[currentIndex]);
                    });

                    // Handle previous button click
                    prevButton.addEventListener('click', function() {
                        currentIndex = (currentIndex - 1 + events.length) % events.length;
                        displayEventData(events[currentIndex]);
                    });
                } else {
                    // If no events found, display a message
                    yearContainer.textContent = '';
                    sentenceContainer.textContent = 'No events found for this date.';
                    additionalDataContainer.innerHTML = '';
                    modal.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

    // Close the modal when clicking the close button or outside of it
    modal.addEventListener('click', function(event) {
        if (event.target == modal || event.target.classList.contains('close')) {
            modal.style.display = 'none';
        }
    });

    function displayEventData(event) {
        yearContainer.textContent = event.year;
        sentenceContainer.textContent = event.text;
        // Display additional data
        let additionalDataHtml = '';
        for (const key in event) {
            if (key !== 'year' && key !== 'text' && key !== 'pages') {
                additionalDataHtml += `<p><strong>${key}:</strong> ${event[key]}</p>`;
            }
        }
        additionalDataContainer.innerHTML = additionalDataHtml;
    }
});
