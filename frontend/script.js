




const form = document.getElementById('videoForm');
const resultDiv = document.getElementById('result');
const originalLikes = document.getElementById('originalLikes');
const formattedLikes = document.getElementById('formattedLikes');
const originalViews = document.getElementById('originalViews');
const formattedViews = document.getElementById('formattedViews');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const videoUrl = document.getElementById('videoUrl').value;

  try {
    const response = await fetch('http://localhost:3000/video-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch video stats');
    }

    const data = await response.json();

    originalLikes.textContent = data.original.likes;
    formattedLikes.textContent = data.formatted.likes;
    originalViews.textContent = data.original.views;
    formattedViews.textContent = data.formatted.views;

    resultDiv.style.display = 'block';

    console.log(data);
  } catch (error) {
    alert('Error: ' + error.message);
    console.error(error);
  }
});

