// Page view tracking script
function trackPageView() {
    fetch('/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page: window.location.pathname
        })
    }).catch(error => {
        console.error('Error tracking page view:', error);
    });
}

// Track page view when the script loads
trackPageView();
