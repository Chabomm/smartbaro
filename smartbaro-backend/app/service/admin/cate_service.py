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
from app.schemas.main import *

# 카테고리_리스트
def cate_list(request: Request, cateInputAdmin: CateInputAdmin) :
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
        )
        .filter(
             T_CATEGORY.table_name == cateInputAdmin.table_name
            ,T_CATEGORY.table_uid == cateInputAdmin.table_uid
        )
        .order_by(T_CATEGORY.cate_sort.asc())
    )

    format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    jsondata = {}
    jsondata.update({"list": rows})
    return jsondata

# 카테고리_편집 - 등록
def cate_create(request: Request, mainCate: MainCate) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    db_item = T_CATEGORY (
         cate_name = mainCate.cate_name
        ,cate_icon = mainCate.cate_icon
        ,cate_sort = mainCate.cate_sort
        ,table_name = mainCate.table_name
        ,table_uid = mainCate.table_uid
        ,is_reserve = mainCate.is_reserve
    )
    db.add(db_item)
    db.flush()

    create_log(request, mainCate.cuid, "T_CATEGORY", "INSERT", "메인 카테고리 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 카테고리_편집 - 수정
def cate_update(request: Request, mainCate: MainCate) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    # 기존 등록된 item select 
    res = db.query(T_CATEGORY).filter(T_CATEGORY.uid == mainCate.cuid).first()

    if res is None :
        raise ex.NotFoundUser

    if mainCate.cate_name is not None and res.cate_name != mainCate.cate_name : 
        create_log(request, mainCate.cuid, "T_CATEGORY", "cate_name", "카테고리 이름", res.cate_name, mainCate.cate_name, user.user_id)
        request.state.inspect = frame()
        res.cate_name = mainCate.cate_name

    if mainCate.cate_icon is not None and res.cate_icon != mainCate.cate_icon : 
        create_log(request, mainCate.cuid, "T_CATEGORY", "cate_icon", "카테고리 이미지", res.cate_icon, mainCate.cate_icon, user.user_id)
        request.state.inspect = frame()
        res.cate_icon = mainCate.cate_icon

    if mainCate.cate_sort is not None and res.cate_sort != mainCate.cate_sort : 
        create_log(request, mainCate.cuid, "T_CATEGORY", "cate_sort", "카테고리 순서", res.cate_sort, mainCate.cate_sort, user.user_id)
        request.state.inspect = frame()
        res.cate_sort = mainCate.cate_sort

    if mainCate.is_reserve is not None and res.is_reserve != mainCate.is_reserve : 
        create_log(request, mainCate.cuid, "T_CATEGORY", "is_reserve", "예약가능 여부", res.is_reserve, mainCate.is_reserve, user.user_id)
        request.state.inspect = frame()
        res.is_reserve = mainCate.is_reserve
        
    return res

# 카테고리_편집 - 삭제
def cate_delete(request: Request, mainCate: MainCate) :
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user
    
    count = db.query(T_MAIN_BANNER).filter(T_MAIN_BANNER.cate_uid == mainCate.cuid, T_MAIN_BANNER.delete_at == None).count()

    if count :
        return None
    else :
        db_item = db.query(T_CATEGORY).filter(T_CATEGORY.uid == mainCate.cuid).delete()

    create_log(request, mainCate.cuid, "T_CATEGORY", "DELETE", "카테고리 삭제", 0, 0, user.user_id)
    request.state.inspect = frame()

    return db_item

# 카테고리_상세정보
def cate_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    
    sql = (
        db.query(
             T_CATEGORY.uid.label("cuid")
            ,T_CATEGORY.cate_name
            ,T_CATEGORY.cate_icon
            ,T_CATEGORY.cate_sort
            ,T_CATEGORY.table_name
            ,T_CATEGORY.table_uid
            ,T_CATEGORY.is_reserve
        )
        .filter(T_CATEGORY.uid == uid)
    )

    format_sql(sql)

    return sql.first()


# 카테고리_편집 - 순서정렬
def cate_sort(request: Request, mainCate: MainCate) :
    request.state.inspect = frame()
    db = request.state.db

    res = (
        db.query(
            T_CATEGORY
        )
        .filter(T_CATEGORY.table_uid == mainCate.table_uid, T_CATEGORY.table_name == mainCate.table_name)
        .all()
    )
    
    for c in res :
        for i in mainCate.sort_array :
            if c.uid == i :
                c.cate_sort = mainCate.sort_array.index(i)+1

    return
