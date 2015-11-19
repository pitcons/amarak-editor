# -*- coding: utf-8 -*-
from app import app
from app import babel
from ..config import LANGUAGES

@babel.localeselector
def get_locale():
    return request.accept_languages.best_match(LANGUAGES.keys())


from thesaurus import *
