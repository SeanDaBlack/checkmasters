from .models import User, db


class UserRepository:
    """In memory database which is a simple list of movies"""

    def get_all_users(self):
        """Simply return all movies from the database"""
        return User.query.all()

    def get_user_by_username(self, username):

        return User.query.filter(User.username==username).first()
    
    def get_user_by_email(self, email):

        return User.query.filter(User.email.like(f'%{email}%')).first()
    
    def get_user_by_id(self, user_id):

        return User.query.filter(User.user_id.like(f'%{user_id}%')).first()

    def get_new_user_num(self):
        return len(User.query.all())+1

    def create_user(self, fname: str, lname: str, email: str, username: str, password: str) -> User:
        ''' Create a new user and return it'''
        user = User(first_name=fname, last_name=lname, email=email,
                    username=username, password=password)
        db.session.add(user)
        db.session.commit()

        return user


_user_repo = UserRepository()