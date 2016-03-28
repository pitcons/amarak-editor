# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
from tempfile import NamedTemporaryFile
from StringIO import StringIO

from flask import render_template, request, jsonify
from amarak.importers.importer_skos import SkosImporter
from amarak.exporters.rdf import RdfExporter
from werkzeug import secure_filename
from app import app
from ..config import TITLE
from ..config import REST_URL

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


@app.route('/import')
def import_scheme():
    return render_template('import_content.html')


@app.route('/search')
def search():
    return render_template('search.html')


@app.route('/do_import', methods=['POST'])
def do_import():
    tmp = NamedTemporaryFile(delete=False)
    try:
        request.files['file'].save(tmp.name)
        importer = SkosImporter(REST_URL)
        errors = importer.do_import(tmp.name, "turtle")
        print errors
    finally:
        os.unlink(tmp.name)

    return jsonify({'errors': [error.serialize() for error in errors]})

@app.route('/do_export/<string:scheme>/<string:file_format>')
def do_export(scheme, file_format):
    buffer = StringIO()
    RdfExporter(REST_URL).do_export(scheme, buffer)
    return buffer.getvalue()
