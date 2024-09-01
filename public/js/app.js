function shortenUrl() {
    const longUrl = document.getElementById("longUrl").value;

    fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ original_url: longUrl }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("shortUrl").value = window.location.origin + '/' + data.short_url;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function copyUrl() {
    const shortUrl = document.getElementById("shortUrl");
    shortUrl.select();
    document.execCommand("copy");
    alert("Short URL copied to clipboard!");
}
