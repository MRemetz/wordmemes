from flask import Flask, render_template
import random

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("./index.html")

@app.route("/get_new_word")
def get_new_word():
    with open("wordlist.txt", "r") as words:
        num = random.randint(0, 1719)
        for i, line in enumerate(words):
            if i == num:
                return str(line).rstrip();
