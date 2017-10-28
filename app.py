from flask import Flask, render_template
import random, socket

app = Flask(__name__)
ip = socket.gethostbyname(socket.gethostname())

@app.route("/")
def index():
    return render_template("./index.html",ip_addr=ip)

@app.route("/get_new_word")
def get_new_word():
    with open("wordlist.txt", "r") as words:
        num = random.randint(0, 1719)
        for i, line in enumerate(words):
            if i == num:
                return str(line).rstrip();

