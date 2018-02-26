from flask import Flask, render_template
import random, socket


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

# Create the actual Flask app
app = Flask(__name__)
# Populate words with the initial list
generate_word_list()

# The main route that contains all the user interactable content
@app.route("/")
def index():
    return render_template("./index.html",ip_addr=getIp())

# The route for grabbing the next word
@app.route("/get_new_word")
def get_new_word():
    if len(words) == 0:
        generate_word_list()
    w = str(words[0])
    del words[0]
    return w
