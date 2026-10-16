fetch('components/header.html')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  })
  .then(html => {
    document.getElementById('header-placeholder').innerHTML = html;
  })
  .catch(error => console.error('Error loading header:', error));