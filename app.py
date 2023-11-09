import os
import pathlib

import requests
from flask import Flask, session, abort, redirect, request, render_template, make_response
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests

from static.py.chat import socketio
from flask_sqlalchemy import SQLAlchemy
from static.py.models import User, db
import uuid
from static.py.user_repository import _user_repo as users
from static.py.PassHandler import PassHandler


app = Flask(__name__)
app.secret_key = "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"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.abspath('static/db/users.db')

# db = SQLAlchemy(app)
socketio.init_app(app)
db.init_app(app)
with app.app_context():
    db.create_all()

pass_handler = PassHandler()


# Google Login Fuctionlity
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


@app.route("/callback")
def callback():

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

    return redirect("/home")


# Email Login Functionality

@app.route("/signup")
def signup():
    return render_template('signup.html')

@app.route("/elogin")
def elogin():
    return render_template('elogin.html')

@app.route("/loginuser", methods=['POST'])
def loginuser():

    user = users.get_user_by_username(request.form['username'])
    if user is None:
        # print("User not found")
        return render_template('elogin.html', error="User not found")
    if pass_handler.verify_password(request.form['password'], user.password) is False:
        # print("Incorrect password")
        return render_template('elogin.html', error="Incorrect password")
    print(user.username)
    session["name"] = user.username
    session["given_name"] = user.first_name
    # print(user.first_name)
    session["email"] = user.email
    session["profile_picture"] = "/static/images/userAccount.jpg"
    

    return redirect('/home')

@app.route("/setuser", methods=['POST'])
def setuser():

    # print(request.form['username'])

    user = users.get_user_by_username(request.form['username'])
    # print(user)
    if user is not None:
        return render_template('signup.html', error="Username already exists")
    elif users.get_user_by_email(request.form['email']) is not None:
        return render_template('signup.html', error="Email already exists")
    elif request.form['password'] != request.form['confirm_password']:
        return render_template('signup.html', error="Passwords do not match")
    else:
        user = users.create_user(request.form['fname'], request.form['lname'], request.form['email'], request.form['username'], pass_handler.hash_password(request.form['password']))

        session["login_type"] = "email"
        session["name"] = user.username
        session["given_name"] = user.first_name
        session["email"] = user.email
        session["profile_picture"] = "/static/images/userAccount.jpg"
        return redirect('/home')
    
    
    # print("here")

    session["login_type"] = "email"
    session["name"] = request.form['fname'] + " " + request.form['lname']
    session["username"] = request.form['username']
    session["given_name"] = request.form['fname']
    session["email"] = request.form['email']
    session["profile_picture"] = "/static/images/userAccount.jpg"

    return redirect('/home')


@app.route("/spectate")
def spectate():
    return render_template("spectate.html")






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




@app.route("/host")
def host():
    return render_template("host.html")
@app.route("/join")
def join():
    return render_template("join.html")

@app.route("/game")
def game():

    lobby_name = request.args['lobby']
    # spectate = request.args['spectate']

    user_info = {
        "name": session.get("given_name"),
        "full_name": session.get("name"),
        "email": session.get("email"),
        "profile_picture": session.get("profile_picture"),
        # "sid": request.sid
    }
    user_info["name"] = session.get("given_name")
    user_info["profile_picture"] = "static/images/userAccount.jpg"
    # print(user_info)
    return render_template("game.html", user_info=user_info, lobby_name=lobby_name)



@app.route("/")
def index():
    if session.get("name") is not None:
        return redirect("/home")
    return render_template("index.html")


@app.route("/home")
@login_is_required
def home():
    user_name = session.get("given_name")
    return render_template("home.html", user_name=user_name)


if __name__ == "__main__":
    socketio.run(app, debug=True)
