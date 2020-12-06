const BOT_LOCALSTORAGE_KEYS = {
    channel: 'botChannelName',
    name: 'botName',
    OAuthPassword: 'botOAuthPassword',
    spotifyClientID: 'spotifyClientID',
    spotifyClientSecret: 'spotifyClientSecret'
}

class Bot {
    command = 'ssr';
    channel = window.localStorage.getItem('botChannelName') || '';
    name = window.localStorage.getItem('botName') || '';
    OAuthPassword = window.localStorage.getItem('botOAuthPassword') || '';
    spotifyClientID = window.localStorage.getItem('spotifyClientID') || '';
    spotifyClientSecret = window.localStorage.getItem('spotifyClientSecret') || '';
    client = null;

    constructor() {
        window.addEventListener('beforeunload', () => {
            this.disconnect();
        });

        this._setInputValuesToLocalStorageValues();
        this.connect();
    }

    _setInputValuesToLocalStorageValues() {
        if (this.channel.length !== 0) {
            document.querySelector('input#botChannelName').value = this.channel;
        }

        if (this.name.length !== 0) {
            document.querySelector('input#botName').value = this.name;
        }

        if (this.OAuthPassword.length !== 0) {
            document.querySelector('input#botOAuthPassword').value = this.OAuthPassword;
        }

        if (this.spotifyClientID.length !== 0) {
            document.querySelector('input#spotifyClientID').value = this.spotifyClientID;
        }

        if (this.spotifyClientSecret.length !== 0) {
            document.querySelector('input#spotifyClientSecret').value = this.spotifyClientSecret;
        }
    }

    _setupMessageHandler() {
        this.client.on('message', (channel, tags, message, self) => {
            const sender = tags['display-name'];
            const trimmedMessage = message.trim();
            if (trimmedMessage.startsWith(`!${this.command}`)) {
                this._makeRequest(channel, sender, message.split(' ')[1]);
            }
        });
    }

    async _makeRequest(channel, sender, link) {
        console.log('Processing request...');
        try {
            const track = await this._getTrack(link);
            console.log(track);
            this.client.say(channel, `!sr ${track} @${sender}`);
        } catch (err) {
            console.error(err)
        }
    }

    async _getCredentials() {
        const bearer = btoa(`${this.spotifyClientID}:${this.spotifyClientSecret}`);
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        const request = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${bearer}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });
        const json = await request.json();
        return json['access_token'];
    }

    async _getTrack(link) {
        const accessToken = await this._getCredentials();
        const parts = link.split('/');
        const trackId = parts[parts.length - 1].split('?')[0];
        const request = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });
        const json = await request.json();
        const artist = json['artists'][0].name;
        const name = json['name'];
        return `${artist} - ${name}`;
    }

    connect() {
        if (
            this.channel.length === 0
            || this.name.length === 0
            || this.OAuthPassword.length === 0
            || this.spotifyClientID.length === 0
            || this.spotifyClientSecret.length === 0
        ) {
            console.warn('Connection failed! Missing bot and spoitfy credentials!');
            return;
        } else if (this.client !== null) {
            console.warn('Connection failed! A client already exists!');
            return;
        }

        this.client = new tmi.Client({
            options: { debug: true },
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: this.name,
                password: this.OAuthPassword
            },
            channels: [this.channel]
        });

        this.client.connect();

        this._setupMessageHandler();

        document.querySelector('button#toggleConnection').textContent = 'Disconnect';
        document.querySelector('span#status').classList = 'badge badge-success';
        document.querySelector('span#status').textContent = 'Connected';
    }

    disconnect() {
        if (this.client === null) {
            return;
        }

        document.querySelector('button#toggleConnection').textContent = 'Connect';
        document.querySelector('span#status').classList = 'badge badge-danger';
        document.querySelector('span#status').textContent = 'Disconnected';

        this.client.disconnect();
        this.client = null;
    }

    isConnected() {
        return this.client !== null;
    }

    setChannel(value) {
        this.channel = value;
        window.localStorage.setItem(BOT_LOCALSTORAGE_KEYS['channel'], value);
    }

    setName(value) {
        this.name = value;
        window.localStorage.setItem(BOT_LOCALSTORAGE_KEYS['name'], value);
    }

    setOAuthPassword(value) {
        this.OAuthPassword = value;
        window.localStorage.setItem(BOT_LOCALSTORAGE_KEYS['OAuthPassword'], value);
    }

    setSpotifyClientID(value) {
        this.spotifyClientID = value;
        window.localStorage.setItem(BOT_LOCALSTORAGE_KEYS['spotifyClientID'], value);
    }

    setSpotifyClientSecret(value) {
        this.spotifyClientSecret = value;
        window.localStorage.setItem(BOT_LOCALSTORAGE_KEYS['spotifyClientSecret'], value);
    }
}