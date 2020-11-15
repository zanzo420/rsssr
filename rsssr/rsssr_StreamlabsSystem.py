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

import base64
import codecs
import json
import os

ScriptName = "ocksmith Spotify Song Requester"
Website = "https://github.com/ajchili/rsssr"
Description = "Rocksmith song request bot for Spotify links"
Creator = "ajchili (Kirin Patel)"
Version = "0.2.0"

configFile = "config.json"
settings = {}


def get_credentials():
    global settings
    client_id = settings['client_id']
    client_secret = settings['client_secret']
    grant_type = 'client_credentials'
    bearer = base64.b64encode('%s:%s' % (client_id, client_secret))
    headers = {
        'Authorization': 'Bearer %s' % (bearer)
    }
    body = {'grant_type': grant_type}
    url = 'https://accounts.spotify.com/api/token'
    response = Parent.PostRequest(url, headers, body, True)
    return json.loads(response)["access_token"]


def is_valid_link(link):
    return link.startswith('https://open.spotify.com/track/')


def get_track_id_from_link(link):
    if not is_valid_link(link):
        return None

    return link.split('/')[-1].split('?')[0]


def get_track_from_id(track_id):
    bearer = get_credentials()
    if bearer is None:
        return None

    headers = {
        'Authorization': 'Bearer %s' % (bearer)
    }
    url = 'https://api.spotify.com/v1/tracks/%s' % (track_id)
    result = Parent.GetRequest(url, headers)
    data = json.loads(result)
    return '%s - %s' % (data['artists'][0]['name'], data['name'])


def Init():
    global settings

    path = os.path.dirname(__file__)
    try:
        with codecs.open(os.path.join(path, configFile), encoding='utf-8-sig', mode='r') as file:
            settings = json.load(file, encoding='utf-8-sig')
    except:
        settings = {
            "liveOnly": True,
            "command": "!ssr"
        }


def Execute(data):
    if data.IsChatMessage() and data.GetParam(0).lower() == settings["command"]:
        outputMessage = '!sr $track @$user'
        username = data.UserName
        track_id = get_track_id_from_link(data.GetParam(1))
        track = get_track_from_id(track_id)

        outputMessage.replace('$track', track)
        outputMessage.replace('$user', username)

        Parent.SendStreamMessage(outputMessage)

    return


def ReloadSettings(jsonData):
    Init()
    return


def Tick():
    return
