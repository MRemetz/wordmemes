from flask import Flask, render_template
import random, socket


def getIp():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close() 
    return ip

app = Flask(__name__)
print(f"Starting server on: {getIp()}")
word_count = 0;

with open("wordlist.txt","r") as f:
    for x in f:
        word_count += 1

@app.route("/")
def index():
    return render_template("./index.html",ip_addr=getIp())

@app.route("/get_new_word")
def get_new_word():
    with open("wordlist.txt", "r") as words:
        num = random.randint(0, word_count)
        for i, line in enumerate(words):
            if i == num:
                return str(line).rstrip();
