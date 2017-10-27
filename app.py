from flask import Flask, render_template
import random

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("./index.html")

def get_new_word():
    with open("wordlist.txt", "r") as words:
        num = random.randint(0, 1719)
        for i, line in enumerate(words):
            print(i)
            if i == num:
                line = str(line).rstrip();
                return line

print(get_new_word())
