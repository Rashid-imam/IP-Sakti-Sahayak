from passlib.context import CryptContext

# Hum passwords ko encrypt karne ke liye 'bcrypt' algorithm use karenge
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash:
    @staticmethod
    def bcrypt(password: str):
        # Naya password hash karne ke liye
        return pwd_context.hash(password)

    @staticmethod
    def verify(hashed_password, plain_password):
        # Login ke waqt password check karne ke liye
        return pwd_context.verify(plain_password, hashed_password)