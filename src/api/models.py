from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(180), unique=False, nullable=False)

    lists = db.relationship('List', backref = 'user' )

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "lists": [list.serialize() for list in self.lists]
        }
#relación de uno a muchos User con List
class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=False , nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    tasks = db.relationship('Task', backref='list')

    def __repr__(self):
        return f'<List {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "tasks": [task.serialize() for task in self.tasks]
        }
#relación de uno a muchos List con Task    
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), unique=False, nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey('list.id', ondelete='CASCADE'))
    
    def __repr__(self):
        return f'<Task {self.text}>'
    
    def serialize(self):
        return {
            "list_id": self.list_id,
            "id": self.id,
            "text": self.text
        }   