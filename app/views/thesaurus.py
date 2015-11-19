# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from flask import render_template, request

from app import app
from ..config import TITLE


@app.route('/')
def thesaurus():
    return render_template(
        "thesaurus.html",
    )


@app.route('/')
@app.route('/index')
def index():
    return render_template(
        "index.html",
        title=TITLE,
    )

@app.route('/scheme_content')
def cheme_content():
    return render_template('scheme_content.html')

@app.route('/concept_content')
def concept_content():
    return render_template('concept_content.html')

@app.route('/search')
def search():
    return render_template('search.html')


@app.route('/ajax/thesaurus/name/<string:name>/parent/<string:parent>/del')
def thesaurus_parent_del(name, parent):
    return 'ok'
