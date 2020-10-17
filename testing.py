#    Copyright 2020 Kirin Patel
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

client_id = ''
client_secret = ''

sp = spotipy.Spotify(
    auth_manager=SpotifyClientCredentials(client_id, client_secret))

result = sp.track(
    'https://open.spotify.com/track/7a0Zmtupswb9Faai3Yj3Eo?si=7XcKb9y_QsKdi0IhGQDDTQ')
print(result['artists'][0]['name'] + ' - ' + result['name'])
