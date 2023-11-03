from flask import request
from .extensions import socketio
from flask_socketio import emit, join_room, leave_room

users = {}

@socketio.on('connect')
def handle_connect():
    print('client connected')

@socketio.on('message')
def handle_message(message):
    print(f'received message: {message}')

    name = message.split(':')[0]
    msg = message.split(':')[1].strip()

    emit('chat', {"message":msg, 'name':name}, broadcast=True)


@socketio.on('room_message')
def handle_room_message(data):
    print(f'received room message: {data["data"]}')

    name = data["data"].split(':')[0]
    msg = data["data"].split(':')[1].strip()

    emit('chat', {"message":msg, 'name':name}, to=data['room'])


@socketio.on('user_join')
def handle_user_join(username):
    print(f'user {username} joined')

@socketio.on('join')
def on_join(data):
    print(f"Joined Room: {data['lobby']}")
    username = data['name']
    room = data['lobby']
    # users[username] = request.sid
    join_room(room)
    emit('join', {'username': username, 'room': room}, broadcast=True)

@socketio.on('leave')
def on_leave(data):
    print(f"Left Room: {data['lobby']}")
    username = data['name']
    room = data['lobby']
    # users[username] = request.sid
    leave_room(room)
    emit('leave', {'username': username, 'room': room}, broadcast=True)




