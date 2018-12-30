import datetime, json
from flask_restful import reqparse, abort, Api, Resource, request
from flask_cors import CORS
from flask import Flask, session, render_template
from pymongo import MongoClient
from bson.json_util import dumps
from werkzeug.security import check_password_hash, generate_password_hash, safe_str_cmp
from werkzeug import secure_filename
from flask_jwt_extended import (JWTManager, create_access_token, create_refresh_token, decode_token, jwt_required,
                                jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from bson.objectid import ObjectId
from string_search import Search
import timeline
import sub_timeline

application = Flask(__name__)
CORS(application)
api = Api(application)
application.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(application)

parser = reqparse.RequestParser()
parser.add_argument('user_id')
parser.add_argument('user_pw')
parser.add_argument('user_que')
parser.add_argument('user_ans')
parser.add_argument('access_token')
parser.add_argument('title')
parser.add_argument('contents')
parser.add_argument('_id')
parser.add_argument('id')
parser.add_argument('type')
parser.add_argument('post_id')
parser.add_argument('comment_id')
parser.add_argument('word')
parser.add_argument('option')
parser.add_argument('url')
parser.add_argument('old_pw')
parser.add_argument('new_pw')
parser.add_argument('img')
parser.add_argument('url')
parser.add_argument('date')


def auth(db):
    auth_header = request.headers.get('Authorization')
    auth_token = {}
    if auth_header:
        auth_token = auth_header.split(" ")[1]
        token_user = decode_token(auth_token)
        user_id = token_user['identity']
        collection = db.users
        user = collection.find({'id': user_id})
        return user


def db_manager():
    client = MongoClient('mongodb://localhost:27017')
    db = client.pookle
    return db


class UserList(Resource):
    def get(self):
        db = db_manager()
        user = auth(db)
        if user == None:
            return None
        if user[0]['rank'] == 10:
            collection = db.users
            users = dumps(collection.find())
            MongoClient('mongodb://localhost:27017').close()
            return users

    def post(self):
        args = parser.parse_args()
        user_id = args['user_id']
        user_pw = args['user_pw']
        user_que = args['user_que']
        user_ans = args['user_ans']
        db = db_manager()
        collection = db.users
        duplicate = dumps(collection.find({"user_id": user_id}))[1]
        if duplicate == '{':
            return "Duplicate accounts"
        user = {
            "id": user_id,
            "pw": generate_password_hash(user_pw),
            "que": user_que,
            "ans": generate_password_hash(user_ans),
            "nickname": user_id,
            "fav_timeline": [],
            "fav_board": [],
            "comment": [],
            "fav_tag": [],
            "black_tag": [],
            "reg_date": datetime.datetime.now(),
            "last_date": datetime.datetime.now(),
            "rank": 0
        }
        collection.insert(user)
        MongoClient('mongodb://localhost:27017').close()
        access_token = create_access_token(identity=user_id, expires_delta=False)
        refresh_token = create_refresh_token(identity=user_id, expires_delta=False)
        return {
            'message': 'User {} was created'.format(args['user_id']),
            'access_token': access_token,
            'refresh_token': refresh_token
        }


class UserDetail(Resource):
    def get(self):
        db = db_manager()
        collection = db.users
        user = auth(db)
        if user:
            mongo_user = collection.find({'id': user[0]['id']})
            dict_user = json.loads(dumps(mongo_user))
            json_user = {
                "_id": dict_user[0]['_id'],
                "id": dict_user[0]['id'],
                "nickname": dict_user[0]['nickname'],
                "fav_timeline": dict_user[0]['fav_timeline'],
                "fav_board": dict_user[0]['fav_board'],
                "fav_tag": dict_user[0]['fav_tag'],
                "black_tag": dict_user[0]['black_tag'],
                "rank": dict_user[0]['rank']
            }
            MongoClient('mongodb://localhost:27017').close()
            return json_user


class editNick(Resource):
    def put(self):
        parser.add_argument('nickname')
        args = parser.parse_args()
        new_nickname = args['nickname']
        db = db_manager()
        collection = db.users
        user = auth(db)
        collection.update(
            {'id': user[0]['id']},
            {'$set': {'nickname': new_nickname}}
        )
        MongoClient('mongodb://localhost:27017').close()


class checkId(Resource):
    def post(self):
        args = parser.parse_args()
        user_id = args['user_id']
        db = db_manager()
        collection = db.users
        user = json.loads(dumps(collection.find({"id": user_id})))
        if user:
            return user[0]
        else:
            return 0


class checkQueAns(Resource):
    def post(self):
        args = parser.parse_args()
        user_ans = args['user_ans']
        user_id = args['user_id']
        db = db_manager()
        collection = db.users
        user = json.loads(dumps(collection.find({"id": user_id})))
        if check_password_hash(user[0]['ans'], user_ans):
            return 1
        else:
            return 0


class changePasswd(Resource):
    def put(self):
        db = db_manager()
        collection = db.users
        user = auth(db)
        args = parser.parse_args()
        old_pw = args['old_pw']
        new_pw = args['new_pw']
        if not user:
            user_id = args['user_id']
            collection.update(
                {'id': user_id},
                {'$set': {'pw': generate_password_hash(new_pw)}}
            )
            return 'success'
        if check_password_hash(user[0]['pw'], old_pw):
            collection.update(
                {'id': user[0]['id']},
                {'$set': {'pw': generate_password_hash(new_pw)}}
            )
            return 'success'
        else:
            MongoClient('mongodb://localhost:27017').close()
            return 'fail'


class favriteTag(Resource):
    def post(self):
        parser.add_argument('fav_tag')
        args = parser.parse_args()
        fav_tag = args['fav_tag']
        db = db_manager()
        collection = db.users
        user = auth(db)
        collection.update(
            {'id': user[0]['id']},
            {'$addToSet': {'fav_tag': fav_tag}}
        )
        MongoClient('mongodb://localhost:27017').close()

    def put(self):
        parser.add_argument('fav_tag')
        args = parser.parse_args()
        fav_tag = args['fav_tag']
        db = db_manager()
        collection = db.users
        user = auth(db)
        collection.update(
            {'id': user[0]['id']},
            {'$pull': {'fav_tag': fav_tag}}
        )
        MongoClient('mongodb://localhost:27017').close()


class BlacklistTag(Resource):
    def post(self):
        parser.add_argument('black_tag')
        args = parser.parse_args()
        black_tag = args['black_tag']
        db = db_manager()
        collection = db.users
        user = auth(db)
        collection.update(
            {'id': user[0]['id']},
            {'$push': {'black_tag': black_tag}}
        )
        MongoClient('mongodb://localhost:27017').close()

    def put(self):
        parser.add_argument('black_tag')
        args = parser.parse_args()
        black_tag = args['black_tag']
        db = db_manager()
        collection = db.users
        user = auth(db)
        collection.update(
            {'id': user[0]['id']},
            {'$pull': {'black_tag': black_tag}}
        )
        MongoClient('mongodb://localhost:27017').close()


class FavTimeline(Resource):
    def put(self):
        parser.add_argument('title')
        parser.add_argument('date')
        parser.add_argument('id')
        parser.add_argument('url')
        args = parser.parse_args()
        _id = args['id']
        title = args['title']
        date = args['date']
        url = args['url']
        db = db_manager()
        user = auth(db)
        for col in db.collection_names():
            db[col].update(
                {
                    "$and": [
                        {'_id': ObjectId(_id)},
                        {'title': title}
                    ]
                },
                {'$push': {
                    'fav': {
                        'user_id': user[0]['_id'],
                        'user_name': user[0]['id']
                    }
                },
                    '$inc': {'fav_cnt': 1}
                }
            )
        db.users.update(
            {'_id': ObjectId(user[0]['_id'])},
            {'$push': {
                'fav_timeline': {
                    '_id': _id,
                    'title': title,
                    'url': url,
                    'date': date
                }
            }
            }
        )
        ''' for col in db.collection_names():
             target = db[col].find({ "$and":[
                         {'_id': ObjectId(_id)},
                         {'title':title}
                         ]})'''


class UnFavTimeline(Resource):
    def put(self):
        parser.add_argument('title')
        parser.add_argument('date')
        parser.add_argument('id')
        args = parser.parse_args()
        _id = args['id']
        title = args['title']
        date = args['date']
        db = db_manager()
        user = auth(db)
        for col in db.collection_names():
            db[col].update(
                {
                    "$and": [
                        {'_id': ObjectId(_id)},
                        {'title': title}
                    ]
                },
                {'$pull': {
                    'fav': {'user_id': user[0]['_id']}
                },
                    '$inc': {'fav_cnt': -1}
                }
            )
        db.users.update(
            {'_id': ObjectId(user[0]['_id'])},
            {'$pull': {
                'fav_timeline': {'_id': _id}
            }
            }
        )


class Login(Resource):
    def post(self):
        args = parser.parse_args()
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        collection = db.users
        users = collection.find()
        user_id = args['user_id']
        user_pw = args['user_pw']
        for user in users:
            if user['id'] == user_id:
                if check_password_hash(user['pw'], user_pw):
                    client.close()
                    access_token = create_access_token(identity=args['user_id'], expires_delta=False)
                    refresh_token = create_refresh_token(identity=args['user_id'], expires_delta=False)
                    return {
                        'message': 'User {} was created'.format(args['user_id']),
                        'access_token': access_token,
                        'refresh_token': refresh_token
                    }
        MongoClient('mongodb://localhost:27017').close()
        return False


class Auth(Resource):
    def post(self):
        args = parser.parse_args()
        access_token = args['access_token']
        user_id = decode_token(access_token)['identity']
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        collection = db.users
        users = collection.find()
        for user in users:
            if user['id'] == user_id:
                current_user = {
                    'id': user['id'],
                }
                return current_user
        return {'id': ''}


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user, expires_delta=False)
        return {'access_token': access_token}


class Timeline(Resource):
    def get(self, option):
        db = db_manager()
        user = auth(db)
        priority_tag = []
        exclude_tag = []
        if user:
            priority_tag = user[0]['fav_tag']
            exclude_tag = user[0]['black_tag']
        if option == 0:
            list = timeline.View(db, timeline.include_coll, timeline.include_tag, priority_tag, exclude_tag)
        else:
            list = sub_timeline.View(db, sub_timeline.include_coll[option], sub_timeline.include_tag[option], [])
        json_list = dumps(list)
        return json_list


class TimelineAdmin(Resource):
    def get(self):
        db = db_manager()
        try:
            result = db.admin_post.find().sort([("date", -1), ("_id", 1)]).limit(1)[0]
        except:
            result = {"contents": "no have notice"}
        list = dumps(result)
        return list

    def post(self):
        args = parser.parse_args()
        title = args['title']
        contents = args['contents']
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        now = datetime.datetime.now()
        date = now.strftime("%Y-%m-%d %H:%M:%S")
        post = {
            "title": title,
            "post": contents,
            "date": date
        }
        db.admin_post.insert(post)
        client.close()
        return 0


class TimelineUpdate(Resource):
    def put(self):
        parser.add_argument('$oid')
        args = parser.parse_args()
        _id = args['$oid']
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        db.timeline.remove({'_id': ObjectId(_id)})
        return 0


class Board(Resource):
    def get(self):
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        collection = db.board
        board_posts = dumps(collection.find().sort([("date", -1), ("_id", 1)]).limit(20))
        before_data = json.loads(board_posts)
        for data in before_data:
            data_ = json.loads(
                dumps(db.users.find({"_id": ObjectId(data['author']['$oid'])}, {"nickname": 1, "_id": 0})))
            data['author'] = data_[0]['nickname']
            for comment_data in data['comment']:
                user_nick = json.loads(
                    dumps(db.users.find({"_id": ObjectId(comment_data['_id']['$oid'])}, {"nickname": 1, "_id": 0})))
                comment_data['author'] = user_nick[0]['nickname']
        client.close()
        after_data = dumps(before_data)
        return after_data

    def post(self):
        args = parser.parse_args()
        contents = args['contents']
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        collection = db.board
        if dumps(db.board.find()) != "[]":
            count = json.loads(dumps(db.board.aggregate([{"$match": {}}, {"$count": "cnt"}])))[0]['cnt']
        else:
            count = 0
        while count > 1000:
            recent = json.loads(dumps(collection.find().sort([("date", 1), ("_id", 1)]).limit(1)))[0]['_id']['$oid']
            collection.remove({"_id": ObjectId(recent)})
            count = json.loads(dumps(db.board.aggregate([{"$match": {}}, {"$count": "cnt"}])))[0]['cnt']
        user = auth(db)
        post = {
            "author": user[0]['_id'],
            "contents": contents,
            "fav_cnt": 0,
            "comment": [],
            "date": datetime.datetime.now()
        }
        db.board.insert(post)
        client.close()
        return 0

    def delete(self):
        args = request.args
        id = args['id']
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        db.board.remove({'_id': ObjectId(id)})
        client.close()
        return 0


class Comment(Resource):
    def post(self):
        args = parser.parse_args()
        contents = args['contents']
        _id = args['_id']
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        user = auth(db)
        db.board.update(
            {"_id": ObjectId(_id)},
            {"$push": {
                "comment": {
                    "_id": user[0]['_id'],
                    "contents": contents,
                    "date": datetime.datetime.now()
                }
            }
            }
        )
        client.close()
        return 0

    def put(self):
        args = parser.parse_args()
        type = args['type']
        post_id = args['post_id']
        comment_id = args['comment_id']
        client = MongoClient('mongodb://localhost:27017')
        db = client.pookle
        if type == 'delete':
            db.board.update(
                {'_id': ObjectId(post_id)},
                {'$pull': {
                    "comment": {
                        '_id': ObjectId(comment_id)
                    }
                }
                }
            )
        client.close()
        return 0


class FavBoard(Resource):
    def put(self):
        parser.add_argument('$oid')
        args = parser.parse_args()
        _id = args['$oid']
        db = db_manager()
        user = auth(db)
        db.board.update(
            {'_id': ObjectId(_id)},
            {'$push': {
                'fav': {
                    'user_id': user[0]['_id'],
                    'user_name': user[0]['id']
                }
            },
                '$inc': {'fav_cnt': 1}
            }
        )
        target = db.board.find({'_id': ObjectId(_id)})
        db.users.update(
            {'_id': ObjectId(user[0]['_id'])},
            {'$push': {
                'fav_board': {
                    '_id': _id,
                    'contents': target[0]['contents'],
                    'date': target[0]['date']
                }
            }
            }
        )
        return 0


class UnFavBoard(Resource):
    def put(self):
        parser.add_argument('$oid')
        args = parser.parse_args()
        _id = args['$oid']
        db = db_manager()
        user = auth(db)
        db.board.update(
            {'_id': ObjectId(_id)},
            {'$pull': {
                'fav': {'user_id': user[0]['_id']}
            },
                '$inc': {'fav_cnt': -1}
            }
        )
        db.users.update(
            {'_id': ObjectId(user[0]['_id'])},
            {'$pull': {
                'fav_board': {'_id': _id}
            }
            }
        )


class WordSearch(Resource):
    def post(self):
        args = parser.parse_args()
        word = args['word']
        db = db_manager()
        list = Search(db, word)
        json_list = dumps(list)
        return json_list


class Advertise(Resource):
    def get(self):
        db = db_manager()
        try:
            result = db.advertise.find().limit(1)[0]
        except:
            result = {
                'contents': "no have advertise"
            }
        list = dumps(result)
        return list

    def post(self):
        print('hi')
        args = parser.parse_args()
        title = args['title']
        contents = args['contents']
        url = args['url']
        img = args['img']
        date = args['date']
        now = datetime.datetime.now()
        now_date = now.strftime("%Y-%m-%d %H:%M:%S")
        db = db_manager()
        adv = {
            'title': title,
            'contents': contents,
            'url': url,
            'img': img,
            'date': now_date,
            'fin_date': date
        }
        db.advertise.insert(adv)
        return 0


api.add_resource(UserList, '/users')
api.add_resource(UserDetail, '/user')
api.add_resource(editNick, '/user/nick')
api.add_resource(changePasswd, '/user/pw')
api.add_resource(favriteTag, '/user/fav-tag')
api.add_resource(BlacklistTag, '/user/black-tag')
api.add_resource(Login, '/user/login')
api.add_resource(checkId, '/user/check-id')
api.add_resource(checkQueAns, '/user/check-que-ans')

api.add_resource(Auth, '/auth')

api.add_resource(TimelineAdmin, '/timeline/admin')
api.add_resource(TimelineUpdate, '/timeline')
api.add_resource(Timeline, '/timeline/<int:option>')
api.add_resource(FavTimeline, '/timeline/fav')
api.add_resource(UnFavTimeline, '/timeline/un-fav')
api.add_resource(Advertise, '/timeline/advertise')

api.add_resource(Board, '/board')
api.add_resource(Comment, '/board/comment')
api.add_resource(FavBoard, '/board/fav')
api.add_resource(UnFavBoard, '/board/un-fav')

api.add_resource(WordSearch, '/search')

if __name__ == '__main__':
    application.run(debug=True, host='0.0.0.0')
