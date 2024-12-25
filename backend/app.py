import requests
from flask import Flask, request, jsonify
import flask_cors


import hashlib


app = Flask(__name__)
flask_cors.CORS(app)


def request_api(query_char):
    print(query_char)
    url = "https://api.pwnedpasswords.com/range/" + query_char
    res = requests.get(url)
    if res.status_code != 200:
        raise RuntimeError(f"Error fetching: {res.status_code}")
    else:
        return res

def read_res(hashes, hash_checker):
    hash_list = (line.split(":") for line in hashes.text.splitlines())
    for h, count in hash_list:
        if h == hash_checker:
            return count 
    return 0


def password_check(password):
    sha1password = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
    first5_char, other = sha1password[:5], sha1password[5:]
    response = request_api(first5_char)
    if response.status_code != 200:
        raise RuntimeError(f"Error fetching: {response.status_code}")
    else:
        return read_res(response, other)


# @app.route('/check-password', methods=['POST'])
# def check_password():
#     data = request.get_json()
#     password = data.get('password')
#     if password:
#         count = password_check(password)
#         if count:
#             return jsonify({"message": f"Password was found {count} times, you should change it"})
#         else:
#             return jsonify({"message": "Password was not found, you are good to go"})
#     else:
#         return jsonify({"error": "No password provided"}), 400


@app.route('/check-password', methods=['POST'])
def check_password():
    data = request.get_json()
    password = data.get('password')
    if password:
        count = password_check(password)
        if count:
            return jsonify({"message": f"Password was found {count} times, you should change it"})
        else:
            return jsonify({"message": "Password was not found, you are good to go"})
    else:
        return jsonify({"error": "No password provided"}), 400


if __name__ == '__main__':
    app.run(debug=True)