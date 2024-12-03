import os
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case, and_
from fastapi import Request
from inspect import currentframe as frame
import math

from app.core import util
from app.core.database import format_sql
from app.core import exceptions as ex
from app.service.log_service import *
from app.models.main import *
from app.models.display import *
from app.models.board import *
from app.models.session import *
from app.models.reserve import *
from app.schemas.main import *

# 메인영역_리스트
def main_list(request: Request, mainListInput: MainListInput):
    request.state.inspect = frame()
    db = request.state.db

    sql = (
        db.query(
             T_MAIN.uid
            ,T_MAIN.site_id
            ,T_MAIN.area
            ,T_MAIN.area_class
            ,T_MAIN.area_name
            ,T_MAIN.area_sort
            ,T_MAIN.area_thumb
            ,T_MAIN.is_display
            ,T_MAIN.per_write
            ,T_MAIN.per_read
            ,T_MAIN.display_type
            ,T_MAIN.cont_uid
            ,T_MAIN.cont_type
            ,func.date_format(T_MAIN.create_at, '%Y-%m-%d %T').label('create_at')
            ,func.date_format(T_MAIN.update_at, '%Y-%m-%d %T').label('update_at')
            ,func.date_format(T_MAIN.delete_at, '%Y-%m-%d %T').label('delete_at')
        )
        .filter(
            T_MAIN.delete_at == None
            ,T_MAIN.display_type == mainListInput.display_type
        )
        .order_by(T_MAIN.area_sort.asc())
    )

    format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    jsondata = {}
    jsondata.update(mainListInput)
    jsondata.update({"list": rows})

    return jsondata

# 메인영역_상세
def main_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    sql = ( 
        db.query(
             T_MAIN.uid
            ,T_MAIN.site_id
            ,T_MAIN.area
            ,T_MAIN.area_class
            ,T_MAIN.area_name
            ,T_MAIN.area_sort
            ,T_MAIN.area_thumb
            ,T_MAIN.is_display
            ,T_MAIN.per_write
            ,T_MAIN.per_read
            ,T_MAIN.display_type
            ,T_MAIN.cont_uid
            ,T_MAIN.cont_type
            ,func.date_format(T_MAIN.create_at, '%Y-%m-%d %T').label('create_at')
            ,func.date_format(T_MAIN.update_at, '%Y-%m-%d %T').label('update_at')
            ,func.date_format(T_MAIN.delete_at, '%Y-%m-%d %T').label('delete_at')
        )
        .filter(T_MAIN.uid == uid)
    )
    format_sql(sql)
    return sql.first()

# 메인영역_편집 - 등록
def main_create(request: Request, main: Main) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    db_item = T_MAIN (
         site_id = main.site_id
        ,area = main.area
        ,area_class = main.area_class
        ,area_name = main.area_name
        ,area_sort = main.area_sort
        ,area_thumb = main.area_thumb
        ,is_display = main.is_display
        ,per_write = main.per_write
        ,per_read = main.per_read
        ,display_type = main.display_type
        ,cont_uid = main.cont_uid
        ,cont_type = main.cont_type
    )
    db.add(db_item)
    db.flush()

    create_log(request, db_item.uid, "T_MAIN", "INSERT", "메인영역등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 메인영역_편집 - 수정
def main_update(request: Request, main: Main) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    # 기존 등록된 item select 
    res = db.query(T_MAIN).filter(T_MAIN.uid == main.uid).first()

    if res is None :
        raise ex.NotFoundUser
    
    if main.site_id is not None and res.site_id != main.site_id : 
        create_log(request, main.uid, "T_MAIN", "site_id", "프로젝트", res.site_id, main.site_id, user.user_id)
        request.state.inspect = frame()
        res.site_id = main.site_id

    if main.area is not None and res.area != main.area : 
        create_log(request, main.uid, "T_MAIN", "area", "영역", res.area, main.area, user.user_id)
        request.state.inspect = frame()
        res.area = main.area

    if main.area_class is not None and res.area_class != main.area_class : 
        create_log(request, main.uid, "T_MAIN", "area_class", "영역플랫폼", res.area_class, main.area_class, user.user_id)
        request.state.inspect = frame()
        res.area_class = main.area_class

    if main.area_name is not None and res.area_name != main.area_name : 
        create_log(request, main.uid, "T_MAIN", "area_name", "영역명", res.area_name, main.area_name, user.user_id)
        request.state.inspect = frame()
        res.area_name = main.area_name

    if main.area_sort is not None and res.area_sort != main.area_sort : 
        create_log(request, main.uid, "T_MAIN", "area_sort", "영역순서", res.area_sort, main.area_sort, user.user_id)
        request.state.inspect = frame()
        res.area_sort = main.area_sort

    if main.area_thumb is not None and res.area_thumb != main.area_thumb : 
        create_log(request, main.uid, "T_MAIN", "area_thumb", "영역썸네일", res.area_thumb, main.area_thumb, user.user_id)
        request.state.inspect = frame()
        res.area_thumb = main.area_thumb

    if main.is_display is not None and res.is_display != main.is_display : 
        create_log(request, main.uid, "T_MAIN", "is_display", "노출여부", res.is_display, main.is_display, user.user_id)
        request.state.inspect = frame()
        res.is_display = main.is_display

    if main.per_write is not None and res.per_write != main.per_write : 
        create_log(request, main.uid, "T_MAIN", "per_write", "쓰기권한", res.per_write, main.per_write, user.user_id)
        request.state.inspect = frame()
        res.per_write = main.per_write

    if main.per_read is not None and res.per_read != main.per_read : 
        create_log(request, main.uid, "T_MAIN", "per_read", "읽기권한", res.per_read, main.per_read, user.user_id)
        request.state.inspect = frame()
        res.per_read = main.per_read

    if main.display_type is not None and res.display_type != main.display_type : 
        create_log(request, main.uid, "T_MAIN", "display_type", "노출타입", res.display_type, main.display_type, user.user_id)
        request.state.inspect = frame()
        res.display_type = main.display_type

    if main.cont_uid is not None and res.cont_uid != main.cont_uid : 
        create_log(request, main.uid, "T_MAIN", "cont_uid", "테이블의 uid", res.cont_uid, main.cont_uid, user.user_id)
        request.state.inspect = frame()
        res.cont_uid = main.cont_uid

    if main.cont_type is not None and res.cont_type != main.cont_type : 
        create_log(request, main.uid, "T_MAIN", "cont_type", "컨텐츠타입", res.cont_type, main.cont_type, user.user_id)
        request.state.inspect = frame()
        res.cont_type = main.cont_type
    
    res.update_at = util.getNow()

    return res

# 메인영역_편집 - 삭제
def main_delete(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user
    
    db_item = db.query(T_MAIN).filter(T_MAIN.uid == uid).first()

    db_item.is_display = 'F'
    db_item.delete_at = util.getNow()

    create_log(request, uid, "T_MAIN", "DELETE", "메인영역삭제", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 배너_리스트
def banner_list(request: Request, pRead: PRead):
    request.state.inspect = frame()
    db = request.state.db

    main_cate_stmt = (
        db.query(
            T_CATEGORY.cate_name.label("cate_name")
            , T_CATEGORY.uid.label("cate_uid")
        )
        .filter(T_CATEGORY.table_uid == pRead.uid)
        .subquery()
    )

    filters = []
    filters.append(getattr(T_MAIN_BANNER, "delete_at") == None)
    filters.append(getattr(T_MAIN_BANNER, "main_uid") == pRead.uid)

    sql = (
        db.query(
             T_MAIN_BANNER.uid
            ,T_MAIN_BANNER.main_uid
            ,T_MAIN_BANNER.site_id
            ,T_MAIN_BANNER.area
            ,T_MAIN_BANNER.area_class
            ,T_MAIN_BANNER.cate_uid
            ,T_MAIN_BANNER.banner_name
            ,T_MAIN_BANNER.banner_src
            ,T_MAIN_BANNER.link_type
            ,T_MAIN_BANNER.link
            ,T_MAIN_BANNER.sort
            ,T_MAIN_BANNER.is_display
            ,T_MAIN_BANNER.create_at
            ,T_MAIN_BANNER.delete_at
            ,T_MAIN_BANNER.update_at
            ,main_cate_stmt.c.cate_name
        ) 
        .filter(*filters)
        .join(
            main_cate_stmt, 
            T_MAIN_BANNER.cate_uid == main_cate_stmt.c.cate_uid,
            isouter = True 
        )
        .order_by(T_MAIN_BANNER.sort.asc())
    )

    format_sql(sql)
    rows = []
    for c in sql.all():

        rows.append(dict(zip(c.keys(), c)))

    jsondata = {}
    jsondata.update({"list": rows})

    return jsondata

# 배너_상세정보
def banner_read(request: Request, uid: int):
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
            ,T_MAIN_BANNER.uid
            ,T_MAIN_BANNER.main_uid
            ,T_MAIN_BANNER.site_id
            ,T_MAIN_BANNER.area
            ,T_MAIN_BANNER.area_class
            ,T_MAIN_BANNER.cate_uid
            ,T_MAIN_BANNER.banner_name
            ,T_MAIN_BANNER.banner_src
            ,T_MAIN_BANNER.link_type
            ,T_MAIN_BANNER.link
            ,T_MAIN_BANNER.sort
            ,T_MAIN_BANNER.is_display
            ,T_MAIN_BANNER.create_at
            ,T_MAIN_BANNER.delete_at
            ,T_MAIN_BANNER.update_at
            ,T_MAIN_BANNER_TXT.banner_uid
            ,T_MAIN_BANNER_TXT.txt1
            ,T_MAIN_BANNER_TXT.txt2
            ,T_MAIN_BANNER_TXT.txt3
            ,T_MAIN_BANNER_TXT.txt4
            ,T_MAIN_BANNER_TXT.txt5
        ) 
        .join(
            T_CATEGORY,
            T_CATEGORY.uid == T_MAIN_BANNER.cate_uid,
            isouter = True
        ) 
        .join(
            T_MAIN_BANNER_TXT,
            T_MAIN_BANNER_TXT.banner_uid == T_MAIN_BANNER.uid,
            isouter = True 
        ) 
        .filter(T_MAIN_BANNER.uid == uid)
    )

    format_sql(sql)

    return sql.first()

# 배너_편집 - 등록
def banner_create(request: Request, mainBanner: MainBanner) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    db_item = T_MAIN_BANNER (
         main_uid = mainBanner.main_uid
        ,site_id = mainBanner.site_id
        ,area = mainBanner.area
        ,area_class = mainBanner.area_class
        ,cate_uid = mainBanner.cate_uid
        ,banner_name = mainBanner.banner_name
        ,banner_src = mainBanner.banner_src
        ,link_type = mainBanner.link_type
        ,link = mainBanner.link
        ,sort = mainBanner.sort
    )
    db.add(db_item)
    db.flush()

    create_log(request, mainBanner.uid, "T_MAIN_BANNER", "INSERT", "배너 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    # if mainBanner.txt1 != "" or mainBanner.txt2 != "" or mainBanner.txt3 != "" or mainBanner.txt4 != "" or mainBanner.txt5 != "" :
    if mainBanner.txt1 != "" or mainBanner.txt2 != "" or mainBanner.txt3 != "" or mainBanner.txt4 != "" or mainBanner.txt5 != "" :
        db_item_2 = T_MAIN_BANNER_TXT (
            banner_uid = db_item.uid
            ,txt1 = mainBanner.txt1 
            ,txt2 = mainBanner.txt2 
            ,txt3 = mainBanner.txt3 
            ,txt4 = mainBanner.txt4 
            ,txt5 = mainBanner.txt5 
        )
        db.add(db_item_2)
        db.flush()

    create_log(request, mainBanner.uid, "T_MAIN_BANNER_TXT", "INSERT", "배너 텍스트 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 배너_편집 - 수정
def banner_update(request: Request, mainBanner: MainBanner) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    # 기존 등록된 item select 
    res = db.query(T_MAIN_BANNER).filter(T_MAIN_BANNER.uid == mainBanner.uid).first()
    res2 = db.query(T_MAIN_BANNER_TXT).filter(T_MAIN_BANNER_TXT.banner_uid == mainBanner.uid).first()

    if res is None :
        raise ex.NotFoundUser
    
    # return
    if mainBanner.main_uid is not None and res.main_uid != mainBanner.main_uid : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "main_uid", "T_MAIN의 uid", res.main_uid, mainBanner.main_uid, user.user_id)
        request.state.inspect = frame()
        res.main_uid = mainBanner.main_uid

    if mainBanner.site_id is not None and res.site_id != mainBanner.site_id : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "site_id", "프로젝트", res.site_id, mainBanner.site_id, user.user_id)
        request.state.inspect = frame()
        res.site_id = mainBanner.site_id

    if mainBanner.area is not None and res.area != mainBanner.area : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "area", "영역", res.area, mainBanner.area, user.user_id)
        request.state.inspect = frame()
        res.area = mainBanner.area

    if mainBanner.area_class is not None and res.area_class != mainBanner.area_class : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "area_class", "플랫폼", res.area_class, mainBanner.area_class, user.user_id)
        request.state.inspect = frame()
        res.area_class = mainBanner.area_class

    if mainBanner.cate_uid is not None and res.cate_uid != mainBanner.cate_uid : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "cate_uid", "카테고리", res.cate_uid, mainBanner.cate_uid, user.user_id)
        request.state.inspect = frame()
        res.cate_uid = mainBanner.cate_uid

    if mainBanner.banner_name is not None and res.banner_name != mainBanner.banner_name : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "banner_name", "배너명", res.banner_name, mainBanner.banner_name, user.user_id)
        request.state.inspect = frame()
        res.banner_name = mainBanner.banner_name

    if mainBanner.banner_src is not None and res.banner_src != mainBanner.banner_src : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "banner_src", "배너 이미지", res.banner_src, mainBanner.banner_src, user.user_id)
        request.state.inspect = frame()
        res.banner_src = mainBanner.banner_src

    if mainBanner.link_type is not None and res.link_type != mainBanner.link_type : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "link_type", "링크타입", res.link_type, mainBanner.link_type, user.user_id)
        request.state.inspect = frame()
        res.link_type = mainBanner.link_type

    if mainBanner.link is not None and res.link != mainBanner.link : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "link", "링크", res.link, mainBanner.link, user.user_id)
        request.state.inspect = frame()
        res.link = mainBanner.link

    if mainBanner.sort is not None and res.sort != mainBanner.sort : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "sort", "순서", res.sort, mainBanner.sort, user.user_id)
        request.state.inspect = frame()
        res.sort = mainBanner.sort

    if mainBanner.is_display is not None and res.is_display != mainBanner.is_display : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER", "is_display", "노출여부", res.is_display, mainBanner.is_display, user.user_id)
        request.state.inspect = frame()
        res.is_display = mainBanner.is_display
        
    if mainBanner.txt1 is not None and res2.txt1 != mainBanner.txt1 : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER_TXT", "txt1", "텍스트1", res2.txt1, mainBanner.txt1, user.user_id)
        request.state.inspect = frame()
        res2.txt1 = mainBanner.txt1

    if mainBanner.txt2 is not None and res2.txt2 != mainBanner.txt2 : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER_TXT", "txt2", "텍스트2", res2.txt2, mainBanner.txt2, user.user_id)
        request.state.inspect = frame()
        res2.txt2 = mainBanner.txt2

    if mainBanner.txt3 is not None and res2.txt3 != mainBanner.txt3 : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER_TXT", "txt3", "텍스트3", res2.txt3, mainBanner.txt3, user.user_id)
        request.state.inspect = frame()
        res2.txt3 = mainBanner.txt3

    if mainBanner.txt4 is not None and res2.txt4 != mainBanner.txt4 : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER_TXT", "txt4", "텍스트4", res2.txt4, mainBanner.txt4, user.user_id)
        request.state.inspect = frame()
        res2.txt4 = mainBanner.txt4

    if mainBanner.txt5 is not None and res2.txt5 != mainBanner.txt5 : 
        create_log(request, mainBanner.uid, "T_MAIN_BANNER_TXT", "txt5", "텍스트5", res2.txt5, mainBanner.txt5, user.user_id)
        request.state.inspect = frame()
        res2.txt5 = mainBanner.txt5

    res.update_at = util.getNow()

    return res

# 배너_편집 - 삭제
def banner_delete(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user
    
    db_item = db.query(T_MAIN_BANNER).filter(T_MAIN_BANNER.uid == uid).first()

    db_item.is_display = 'F'
    db_item.delete_at = util.getNow()

    create_log(request, uid, "T_MAIN_BANNER", "DELETE", "배너삭제", db_item.uid, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 배너_편집 - 순서정렬
def banner_sort(request: Request, mainBanner : MainBanner) :
    request.state.inspect = frame()
    db = request.state.db

    res = (
        db.query(
            T_MAIN_BANNER
        )
        .filter(T_MAIN_BANNER.main_uid == mainBanner.main_uid, T_MAIN_BANNER.delete_at == None)
        .all()
    )
    
    for c in res :
        for i in mainBanner.sort_array :
            if c.uid == i :
                c.sort = mainBanner.sort_array.index(i)+1

    return

# 어드민 콘솔 메인화면
def dashboard_posts(request: Request, board_uid: int) :
    request.state.inspect = frame()
    db = request.state.db

    sql = (
        db.query(
             T_BOARD_POSTS.uid
            ,T_BOARD_POSTS.title
            ,T_BOARD_POSTS.thumb
            ,T_BOARD_POSTS.create_name
            ,func.date_format(T_BOARD_POSTS.create_at, '%Y-%m-%d %T').label('create_at')
        )
        .filter(
             T_BOARD_POSTS.board_uid == board_uid
            ,T_BOARD_POSTS.delete_at == None
            ,T_BOARD_POSTS.is_display == "T"
        )
        .order_by(T_BOARD_POSTS.uid.desc())
        .limit(7)
    )

    # format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    return rows

def dashboard_intranet_board (request: Request, board_uid: int, site_id: str):
    request.state.inspect = frame()
    db = request.state.db

    sql = ( 
        db.query(
             T_BOARD.uid
            ,T_BOARD.board_type
            ,T_BOARD.board_name
            ,T_BOARD.permission
            ,T_BOARD.per_write
            ,T_BOARD.per_read
            ,T_BOARD.is_comment
            ,T_BOARD.front_url
            ,T_BOARD.site_id
        )
        .filter(
             T_BOARD.uid == board_uid
            ,T_BOARD.delete_at == None
            ,T_BOARD.is_display == "T"
            ,T_BOARD.site_id == site_id
        )
    )
    format_sql(sql)
    return sql.first()

def dashboard_session_hisyory(request: Request) :
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user

    sql = (
        db.query(
             T_SESSION_HISTORY.ip
            ,func.date_format(T_SESSION_HISTORY.create_date, '%Y-%m-%d %T').label('create_at')
            ,T_SESSION_HISTORY.is_fail
        )
        .filter(
             T_SESSION_HISTORY.profile == os.environ.get('PROFILE')
            ,T_SESSION_HISTORY.user_uid == user.user_uid
        )
        .order_by(T_SESSION_HISTORY.uid.desc())
        .limit(7)
    )

    # format_sql(sql)

    rows = []
    for c in sql.all():
        row = dict(zip(c.keys(), c))
        row["ip"] = util.fn_masking_user_ip(row["ip"])
        if row["is_fail"] == 1 :
            row["is_fail"] = "실패"
        elif row["is_fail"] == 0 :
            row["is_fail"] = "성공"
        rows.append(row)
    return rows

def dashboard_reserve(request: Request) :
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user

    sql = (
        db.query(
             T_RESERVE.uid
	        ,T_RESERVE.state
	        ,T_RESERVE.user_name 
	        ,func.date_format(T_RESERVE.create_at, '%Y-%m-%d %T').label('create_at') 
	        ,func.date_format(T_RESERVE.rev_date, '%Y-%m-%d').label('rev_date') 
        )
        .filter(
             T_RESERVE.delete_at == None
        )
        .order_by(T_RESERVE.uid.desc())
        .limit(7)
    )

    # format_sql(sql)

    rows = []
    for c in sql.all():
        row = dict(zip(c.keys(), c))
        rows.append(row)
    return rows









