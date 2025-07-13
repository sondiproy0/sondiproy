 const feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@sondiproy0';

function extractImageFromContent(html) {
    const match = html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
  }

  fetch(feedUrl)
    .then(res => res.json())
    .then(data => {
      const postsContainer = document.getElementById('posts');
      const allItems = data.items;

      // Show only first 9
      allItems.slice(0, 9).forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4 col-lg-3';

        const title = item.title;
        const link = item.link;
        const pubDate = new Date(item.pubDate);
        const daysAgo = Math.floor((new Date() - pubDate) / (1000 * 60 * 60 * 24));
        const image = item.thumbnail && item.thumbnail.startsWith('http')
          ? item.thumbnail
          : extractImageFromContent(item.content) || 'https://i.pinimg.com/1200x/2a/86/a5/2a86a560f0559704310d98fc32bd3d32.jpg';

        col.innerHTML = `
          <a href="${link}" target="_blank" class="text-decoration-none">
            <div class="card text-bg-dark border-0 shadow-sm" style="height:250px;">
              <img src="${image}" class="card-img image-fluid" alt="${title}">
              <div class="card-img-overlay d-flex flex-column justify-content-end bg-dark bg-opacity-50">
                <h5 class="card-title text-white">${title}</h5>
                <p class="card-text"><small>Published ${daysAgo} days ago</small></p>
              </div>
            </div>
          </a>
        `;

        postsContainer.appendChild(col);
      });

      // If more than 9, show "View All" button
      if (allItems.length > 9) {
        const viewAllBtn = document.createElement('div');
        viewAllBtn.className = 'text-center mt-4';
        viewAllBtn.innerHTML = `
          <a href="https://medium.com/@sondiproy0" target="_blank" class="btn btn-outline-primary">
            View All Posts
          </a>
        `;
        postsContainer.parentNode.appendChild(viewAllBtn);
      }
    })
    .catch(err => {
      console.error('Feed error:', err);
      document.getElementById('posts').innerHTML = '<p class="text-danger">Failed to load posts.</p>';
    });