import os
import pathlib

import requests
from flask import Flask, session, abort, redirect, request, render_template, make_response
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests

app = Flask(__name__)
app.secret_key = "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"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

GOOGLE_CLIENT_ID = "301822394319-o8gridp2md6qcpc0uk0clkug0puecbio.apps.googleusercontent.com"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email",
            "openid"],
    redirect_uri="http://127.0.0.1:5000/callback?login=google"
)



def login_is_required(function):
    def wrapper(*args, **kwargs):
        if "google" in session and "google_id" not in session:
            return abort(401)  # Authorization required
        elif "email" in session and "name" not in session:
            return abort(401)
        else:
            return function()

    return wrapper


@app.route("/login")
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route("/signup")
def signup():
    # user = ""
    user = request.cookies.get('user')
    print(user)

    if user == None:
        return make_response(render_template('signup.html'))
    
    return render_template('signup.html')

@app.route("/setuser", methods=['POST'])
def setuser():
    # user = request.form['user']

    print(request.form['fname'])

    user = {
        "name": request.form['username'],
        "given_name": request.form['fname'],
        "email": request.form['email'],
    }

    response = make_response(render_template('home.html', cookies=request.cookies))

    response.set_cookie('user', user["name"])
    response.set_cookie('given_name', user["given_name"])
    response.set_cookie('email', user["email"])



    # print(user)
    return redirect('/home')


@app.route("/callback")
def callback():

    login_type = request.args.get("login")

    if login_type == "google":
        flow.fetch_token(authorization_response=request.url)

        if not session["state"] == request.args["state"]:
            abort(500)  # State does not match!

        credentials = flow.credentials
        request_session = requests.session()
        cached_session = cachecontrol.CacheControl(request_session)
        token_request = google.auth.transport.requests.Request(session=cached_session)

        id_info = id_token.verify_oauth2_token(
            id_token=credentials._id_token,
            request=token_request,
            audience=GOOGLE_CLIENT_ID
        )

        session["login_type"] = "google"
        session["google_id"] = id_info.get("sub")
        session["name"] = id_info.get("name")
        session["given_name"] = id_info.get("given_name")
        session["email"] = id_info.get("email")
        session["profile_picture"] = id_info.get("picture")
    
    else:
        session["login_type"] = "email"
        session["name"] = request.cookies.get('name')
        session["given_name"] = request.cookies.get('given_name')
        session["email"] = request.cookies.get('email')
        pass
    return redirect("/home")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/inbox")
def inbox():
    return render_template("inbox.html")


@app.route("/profile")
def profile():
    user_info = {
        "name": session.get("given_name"),
        "full_name": session.get("name"),
        "email": session.get("email"),
        "profile_picture": session.get("profile_picture")
    }
    return render_template("profile.html", user_info=user_info)


@app.route("/game")
def game():
    chat_messages = ""
    return render_template("game.html", chat_messages=chat_messages)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/home")
@login_is_required
def home():
    user_name = session.get("given_name")
    return render_template("home.html", user_name=user_name)


if __name__ == "__main__":
    app.run(debug=True)
