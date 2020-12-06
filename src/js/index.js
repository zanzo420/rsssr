const botChannelNameInput = document.querySelector('input#botChannelName');
const botNameInput = document.querySelector('input#botName');
const botOAuthPasswordInput = document.querySelector('input#botOAuthPassword');
const spotifyClientIDInput = document.querySelector('input#spotifyClientID');
const spotifyClientSecretInput = document.querySelector('input#spotifyClientSecret');
const toggleConnectionButton = document.querySelector('button#toggleConnection');
const statusSpan = document.querySelector('span#status');

const bot = new Bot();

botChannelNameInput.addEventListener('input', e => {
    e.stopPropagation();
    bot.setChannel(e.target.value);
});

botNameInput.addEventListener('input', e => {
    e.stopPropagation();
    bot.setName(e.target.value);
});

botOAuthPasswordInput.addEventListener('input', e => {
    e.stopPropagation();
    bot.setOAuthPassword(e.target.value);
});

spotifyClientIDInput.addEventListener('input', e => {
    e.stopPropagation();
    bot.setSpotifyClientID(e.target.value);
});

spotifyClientSecretInput.addEventListener('input', e => {
    e.stopPropagation();
    bot.setSpotifyClientSecret(e.target.value);
});

toggleConnectionButton.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    if (bot.isConnected()) {
        bot.disconnect();
    } else {
        bot.connect();
    }
})