from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case
from fastapi import Request
from inspect import currentframe as frame
from fastapi.encoders import jsonable_encoder
import math

from app.core import util
from app.core.database import format_sql

from app.models.board import *
from app.models.display import *
from app.models.menu import *

# 카테고리 리스트
def cate (request: Request, table_name: str) :
    request.state.inspect = frame()
    db = request.state.db

    if table_name == "T_BOARD_POSTS" :
        stmt = db.query(T_BOARD_POSTS.cate_uid.label("cate_uid")).filter(T_BOARD_POSTS.cate_uid != None).filter(T_BOARD_POSTS.delete_at == None).group_by(T_BOARD_POSTS.cate_uid).subquery()

    if not 'stmt' in vars() :
        jsondata = {"list": []}
        return jsondata
    
    sql = (
        db.query(T_CATEGORY.uid.label("key"), T_CATEGORY.cate_name.label("value"))
        .filter(T_CATEGORY.uid.in_(stmt))
        .order_by(T_CATEGORY.cate_sort.asc())
    )

    rows = []
    # rows.append({"key" : "", "value" : "전체"})
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    jsondata = {}
    jsondata.update({"list": rows})
    
    return jsondata

# 게시판
def board(request: Request) :
    request.state.inspect = frame()
    db = request.state.db

    sql = (
        db.query(T_BOARD.uid.label("key"), T_BOARD.board_name.label("value"))
        .filter(T_BOARD.delete_at == None, T_BOARD.is_display == "T")
        .order_by(T_BOARD.uid.asc())
    )

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    jsondata = {}
    jsondata.update({"list": rows})
    
    return jsondata

# 의료진 카테고리 리스트
def doctor_cate (request: Request, table_name: str) :
    request.state.inspect = frame()
    db = request.state.db

    sql = (
            db.query(T_CATEGORY.uid.label("key"), T_CATEGORY.cate_name.label("value"))
            .filter(T_CATEGORY.table_name == table_name)
            .order_by(T_CATEGORY.cate_sort.asc())
    )
        
    rows = []
    for c in sql.all():

        column_json = dict(zip(c.keys(), c))
        column_json["checked"] = True

        rows.append(column_json)

    jsondata = {}
    jsondata.update({"list": rows})
    
    return jsondata

# 관리자 역할
def rolse(request: Request) :
    request.state.inspect = frame()
    db = request.state.db

    sql = (
        db.query(T_ADMIN_ROLE.uid.label("key"), T_ADMIN_ROLE.name.label("value"))
        .order_by(T_ADMIN_ROLE.uid.asc())
    )

    rows = []
    for c in sql.all():
        colobj = dict(zip(c.keys(), c))
        colobj["checked"] = True
        rows.append(colobj)

    jsondata = {}
    jsondata.update({"list": rows})
    
    return jsondata