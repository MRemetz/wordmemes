from websocket_server import WebsocketServer
from flask import Flask, render_template
from threading import Thread
import random
import socket
import base64
import json
import os


# Create the list of words to use
words = []

# Get the IP that the server should embed in the page
def getIp():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close() 
    return ip

# Create a fresh, randomized list of words
def generate_word_list():
    with open("wordlist.txt","r") as f:
        for x in f:
            words.append(x)
    random.shuffle(words)

def ws_send(client, data):
    ws_server.send_message(client, json.dumps(data))

# Handles all WS messages
def msg_recvd(client, server, msg):
    if msg == "NEW_WORD":
        response = {"type": "NEW_WORD", "word": get_new_word()}
    ws_send(client, response)

# Handles all new clients
def new_client(client, server):
    # Get all the audio files
    sounds = os.listdir("./static/sounds/")
    # Send them the timer file first
    with open(f"./static/sounds/timer.wav", "rb") as wav:
        b64_sound = {"name": "timer", "value": str(base64.b64encode(wav.read()), "utf-8")}
        ws_send(client, {"type":"AUDIO","sound":b64_sound})
    # Remove the timer from the list
    sounds.remove("timer.wav")
    # Read each file and b64 encode it
    for s_file in sounds:
        with open(f"./static/sounds/{s_file}", "rb") as wav:
            b64_sound = {"name": s_file.split(".")[0], "value": str(base64.b64encode(wav.read()), "utf-8")}
            ws_send(client, {"type":"AUDIO","sound":b64_sound})

# Create the actual Flask app
app = Flask(__name__)
# Populate words with the initial list
generate_word_list()

# Create the WS server
ws_server = WebsocketServer(5001, host=getIp())
ws_server.set_fn_message_received(msg_recvd)
ws_server.set_fn_new_client(new_client)

# Start a WS thread
t = Thread(target=ws_server.run_forever)
t.start()

# The main route that contains all the user interactable content
@app.route("/")
def index():
    return render_template("./index.html",ip_addr=getIp())


def get_new_word():
    if len(words) == 0:
        generate_word_list()
    w = str(words[0])
    del words[0]
    return w
