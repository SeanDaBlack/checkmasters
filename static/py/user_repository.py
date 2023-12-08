from .models import User, db


class UserRepository:
    """In memory database which is a simple list of movies"""

    def get_all_users(self):
        """Simply return all movies from the database"""
        return User.query.all()

    def get_user_by_username(self, username):

        return User.query.filter(User.username==username).first()
    
    def get_user_by_email(self, email):

        return User.query.filter(User.email==email).first()
    
    def get_user_by_id(self, user_id):

        return User.query.filter(User.user_id==user_id).first()

    def get_new_user_num(self):
        return len(User.query.all())+1

    def create_user(self, fname: str, lname: str, email: str, username: str, password: str) -> User:
        ''' Create a new user and return it'''
        user = User(first_name=fname, last_name=lname, email=email,
                    username=username, password=password)
        db.session.add(user)
        db.session.commit()

        return user
    

    def get_top_users(self, number: int) -> list:

        #Get users with highest elo = to number
        return User.query.order_by(User.elo.desc()).limit(number).all()
    
    def add_win(self, user_id: int):
        user = self.get_user_by_id(user_id)
        user.wins += 1
        db.session.commit()
    
    def add_loss(self, user_id: int):
        user = self.get_user_by_id(user_id)
        user.losses += 1
        db.session.commit()

    def add_draw(self, user_id: int):
        user = self.get_user_by_id(user_id)
        user.draws += 1
        db.session.commit()
    
    def update_elo(self, user_id: int, elo: int):
        user = self.get_user_by_id(user_id)
        user.elo = elo
        db.session.commit()


    def get_wins(self, user_id: int):
        user = self.get_user_by_id(user_id)
        return user.wins
    
    def get_losses(self, user_id: int):
        user = self.get_user_by_id(user_id)
        return user.losses
    def get_draws(self, user_id: int):
        user = self.get_user_by_id(user_id)
        return user.draws





_user_repo = UserRepository()

def create_username(fname: str, lname: str):
    ''' Create a username from a first and last name'''
    print(fname, lname)
    username = fname.lower() + lname.lower()
    if _user_repo.get_user_by_username(username) is None:
        return username
    else:
        return username + str(_user_repo.get_new_user_num())