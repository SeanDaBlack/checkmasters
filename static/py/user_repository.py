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
                    username=username, password=password, elo=1000, wins=0, losses=0, draws=0)
        db.session.add(user)
        db.session.commit()

        return user
    

    def get_top_users(self, number) -> list:

        #Get users with highest elo = to number
        return User.query.order_by(User.elo.desc()).limit(number).all()
    
    def add_win(self, username):
        user = self.get_user_by_username(username)
        user.wins += 1
        db.session.commit()
    
    def add_loss(self, username):
        user = self.get_user_by_username(username)
        user.losses += 1
        db.session.commit()

    def add_draw(self, username):
        user = self.get_user_by_username(username)
        user.draws += 1
        db.session.commit()
    
    def update_elo(self, username, elo):
        user = self.get_user_by_username(username)
        user.elo = elo
        db.session.commit()


    def get_wins(self, username):
        user = self.get_user_by_username(username)
        print(username)
        if user.wins is None:
            return 0
        return user.wins
    
    def get_losses(self, username):
        user = self.get_user_by_username(username)
        print(username)
        if user.losses is None:
            return 0
        return user.losses
    def get_draws(self, username):
        user = self.get_user_by_username(username)
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