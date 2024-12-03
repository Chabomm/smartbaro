from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case, and_
from fastapi import Request
from inspect import currentframe as frame
import math

from app.core import util
from app.core.database import format_sql
from app.core import exceptions as ex
from app.service.log_service import *
from app.models.display import *
from app.schemas.schema import *
from app.schemas.display import *

# 관리자 진료과 - 리스트
def medical_cate_list(request: Request, cateTableInput: CateTableInput):
    request.state.inspect = frame()
    db = request.state.db

    sql = (
        db.query(
            T_CATEGORY.uid
            ,T_CATEGORY.cate_name
            ,T_CATEGORY.cate_icon
            ,T_CATEGORY.cate_sort
            ,T_CATEGORY.table_name
            ,T_CATEGORY.table_uid
            ,T_CATEGORY.is_reserve
        )
        .filter(T_CATEGORY.table_name == cateTableInput.table_name)
        .order_by(T_CATEGORY.cate_sort.asc())
    )

    format_sql(sql)
    
    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    jsondata = {}
    jsondata.update({"list": rows})

    return jsondata

# 관리자 진료과 - 상세
def medical_cate_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    sql = ( 
        db.query(
              T_CATEGORY.uid
            ,T_CATEGORY.cate_name
            ,T_CATEGORY.cate_icon
            ,T_CATEGORY.cate_sort
            ,T_CATEGORY.table_name
            ,T_CATEGORY.table_uid
            ,T_CATEGORY.is_reserve
        )
        .filter(
            T_CATEGORY.uid == uid
        )
    )
    format_sql(sql)
    return sql.first()

# 관리자 진료과 - 순서정렬
def cate_sort(request: Request, mainCate: MainCate) :
    request.state.inspect = frame()
    db = request.state.db

    res = (
        db.query(
            T_CATEGORY
        )
        .filter(T_CATEGORY.table_name == mainCate.table_name)
        .all()
    )
    
    for c in res :
        for i in mainCate.sort_array :
            if c.uid == i :
                c.cate_sort = mainCate.sort_array.index(i)+1
    
    return
