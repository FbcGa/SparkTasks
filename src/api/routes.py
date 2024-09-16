"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, List, Task
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/register', methods=['POST'])
def register():
    body = request.json
    email = body.get("email", None)
    password = body.get("password", None)
    password_hash = generate_password_hash(password=password)

    if email is None or password is None:
        return jsonify({"error": "all the fields must be filled out"}), 400
    
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "this email is already taken"}), 400
    
    try:
        new_user = User(email=email, password=password_hash)
        db.session.add(new_user)
        db.session.commit()
        db.session.refresh(new_user)
        auth_token = create_access_token({"user_id": new_user.id})
        return jsonify({"user": new_user.serialize(), "auth": auth_token}),201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}),500
    
@api.route('/login', methods=['POST'])
def login():
    body = request.json
    email = body.get("email", None)
    password = body.get("password", None)

    if email is None or password is None:
        return jsonify({"error": "complet all the fields"}), 400
    
    try:
        old_user = User.query.filter_by(email=email).first()

        if not old_user or not check_password_hash(old_user.password,password):
            return jsonify({"error": "Wrong data!"}), 400
        
        auth_token = create_access_token({"user_id": old_user.id})
        return jsonify({"user": old_user.serialize(), "auth": auth_token}),200
    
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500

 #---------------------------------------------------------------------------------------   
@api.route('/list', methods=['POST'])
@jwt_required()
def add_list():
    current_user = get_jwt_identity()
    body = request.json
    title = body.get('title', None)

    if title is None:
        return jsonify({"error": "fill out the title"})
    
    try:
        new_list = List(title=title, user_id=current_user['user_id'])
        db.session.add(new_list)
        db.session.commit()
        db.session.refresh(new_list)
        return jsonify({"mssg": "list create successfully"}),200
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    

@api.route('/list', methods=['GET'])
@jwt_required()
def get_all_list():
    try:
        current_user = get_jwt_identity()
        lists = List.query.filter_by(user_id=current_user['user_id']).all()
        serialize_list = [list.serialize() for list in lists]
        return jsonify({"lists": serialize_list}),200
    
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    
@api.route('/list/delete', methods=['DELETE'])
@jwt_required()
def delete_list():
    body = request.json
    list_id = body.get("id", None)
    current_user = get_jwt_identity()
    list_delete = List.query.filter_by(id=list_id, user_id=current_user['user_id']).first()

    try:
        if list_id is None:
            return jsonify({"error": "list_id doesn't found"}),404
        
        if not list_delete:
            return jsonify({"error": "list doesn't exist"}), 404
        
        db.session.delete(list_delete)
        db.session.commit()
        return jsonify({"mssg": "list delete successfully"}),200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500 
    
#----------------------------------------------------------------------------------------    
@api.route('/task', methods=['POST'])
@jwt_required()
def add_task():
    current_user = get_jwt_identity()
    body = request.json
    text = body.get("text", None)
    list_id = body.get("list_id", None)

    if not List.query.filter_by(id=list_id, user_id=current_user['user_id']).first():
        return jsonify({"error": "list doesn't exist"}),404

    if text is None or list_id is None:
        return jsonify({"error": "Cannot save a empy task"}),400

    try:
        new_task = Task(list_id=list_id, text=text, user_id=current_user['user_id'])
        db.session.add(new_task)
        db.session.commit()
        db.session.refresh(new_task)
        return jsonify({"mssg": "task add successfully"}),200
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    
@api.route('/task/delete', methods=['DELETE'])
@jwt_required()
def delete_task():
    current_user = get_jwt_identity()
    body = request.json
    task_id = body.get("id", None)
    list_id = body.get("list_id", None)

    if id is None or list_id is None:
        return jsonify({"error": "parameters are missing"}),404
    
    try:
        task = Task.query.filter_by(id=task_id,list_id=list_id,user_id=current_user['user_id']).first()
        if not task:
            return jsonify({"error": "task doesn't exist"}), 404
        
        db.session.delete(task)
        db.session.commit()
        return jsonify({"mssg": "task delete successfully"}),200
    except Exception as error:
        return jsonify({"error": f"{error}"}),500
