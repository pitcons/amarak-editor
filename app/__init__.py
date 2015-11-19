# -*- coding: utf-8 -*-
from flask import Flask
from flask.ext.babel import Babel

app = Flask(__name__)
babel = Babel(app)

# from amarak.client import AmarakClient
# amarak = AmarakClient('http://localhost:8000/')

from app import views
