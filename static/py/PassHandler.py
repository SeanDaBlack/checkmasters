from passlib.hash import sha256_crypt


class PassHandler:
    def __init__(self):
        pass

    def hash_password(self, password):
        hashed_password = sha256_crypt.encrypt(password)
        return hashed_password

    def verify_password(self, new_password, old_password):
        return sha256_crypt.verify(new_password, old_password)