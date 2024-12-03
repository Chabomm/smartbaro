from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case, and_, or_
from fastapi import Request
from inspect import currentframe as frame
import math

from app.core import util
from app.core.database import format_sql
from app.core import exceptions as ex
from app.service.log_service import *
from app.models.board import *
from app.models.display import *
from app.schemas.schema import *
from app.schemas.admin.board import *

# 관리자 게시판 리스트
def board_list(request: Request, page_param: PPage_param):
    request.state.inspect = frame()
    db = request.state.db

    where = " WHERE delete_at is Null "

    if page_param.filters :
        if page_param.filters["skeyword"] :
            if page_param.filters["skeyword_type"] != "" :
                where = where + "AND skeyword_type like '%"+page_param.filters["skeyword"]+"%'"
            else : 
                where = where + "AND ("
                where = where + "   uid = "+page_param.filters["skeyword"]+" "
                where = where + "   or board_name like '%"+page_param.filters["skeyword"]+"%'"
                where = where + ") "

        if page_param.filters["create_at"]["startDate"] and page_param.filters["create_at"]["endDate"] :
            where = where + "AND create_at >= '" +page_param.filters["create_at"]["startDate"]+ "' " 
            where = where + "AND create_at <= '" +page_param.filters["create_at"]["endDate"]+ "' " 

        if page_param.filters["board_type"] :
            where = where + "AND board_type = '" +page_param.filters["board_type"]+ "' " 
    
    sql = """
        SELECT 
             uid
            ,board_type
            ,board_name
            ,permission
            ,per_write
            ,per_read
            ,is_comment
            ,is_display
            ,front_url
            ,DATE_FORMAT(create_at, '%Y-%m-%d %T') as create_at
            ,( 
                select count(BP.uid) 
                From T_BOARD_POSTS as BP 
                where BP.board_uid = B.uid
            ) as posts_count
            ,( 
                select GROUP_CONCAT(name SEPARATOR ', ') AS result  
                From T_ADMIN_ROLE 
                where uid MEMBER OF(B.permission_read->>'$')
            ) as permission_read_txt
            ,( 
                select GROUP_CONCAT(name SEPARATOR ', ') AS result  
                From T_ADMIN_ROLE 
                where uid MEMBER OF(B.permission_write->>'$')
            ) as permission_write_txt
            ,site_id
        FROM T_BOARD as B
        {where}
        ORDER BY uid DESC
        LIMIT {start}, {end}
    """.format(where=where, start=(page_param.page-1)*page_param.page_view_size, end=page_param.page_view_size)

    # print(sql)

    res = db.execute(text(sql)).fetchall()

    rows = []
    for c in res :
        rows.append(dict(zip(c.keys(), c)))

    # [ S ] 페이징 처리
    page_param.page_total = db.execute(text("select count(uid) as cnt from T_BOARD " + where)).scalar()
    page_param.page_last = math.ceil(page_param.page_total / page_param.page_view_size)
    page_param.page_size = len(rows) # 현재 페이지에 검색된 수
    # [ E ] 페이징 처리

    jsondata = {}
    jsondata.update(page_param)
    jsondata.update({"list": rows})

    return jsondata

# 관리자 게시판 상세
def board_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db

    sql = ( 
        db.query(
             T_BOARD.uid
            ,T_BOARD.site_id
            ,T_BOARD.board_type
            ,T_BOARD.board_name
            ,T_BOARD.permission
            ,T_BOARD.per_write
            ,T_BOARD.per_read
            ,T_BOARD.is_comment
            ,T_BOARD.is_display
            ,T_BOARD.front_url
            ,T_BOARD.permission_read
            ,T_BOARD.permission_write
            ,func.date_format(T_BOARD.create_at, '%Y-%m-%d %T').label('create_at')
            ,func.date_format(T_BOARD.update_at, '%Y-%m-%d %T').label('update_at')
            ,func.date_format(T_BOARD.delete_at, '%Y-%m-%d %T').label('delete_at')
        )
        .filter(T_BOARD.uid == uid)
    )
    format_sql(sql)
    return sql.first()

# 관리자 게시판 등록
def board_create(request: Request, board: Board):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    db_item = T_BOARD (
         site_id = board.site_id
        ,board_type = board.board_type
        ,board_name = board.board_name
        ,permission_read = board.permission_read
        ,permission_write = board.permission_write
        ,is_comment = board.is_comment
        ,front_url = board.front_url
    )
    db.add(db_item)
    db.flush()

    create_log(request, db_item.uid, "T_BOARD", "INSERT", "게시판 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 관리자 게시판 수정
def board_update(request: Request, board: Board):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    res = db.query(T_BOARD).filter(T_BOARD.uid == board.uid).first()

    if res is None :
        raise ex.NotFoundUser

    if board.site_id is not None and res.site_id != board.site_id : 
        create_log(request, board.uid, "T_BOARD", "site_id", "프로젝트", res.site_id, board.site_id, user.user_id)
        request.state.inspect = frame()
        res.site_id = board.site_id

    if board.board_type is not None and res.board_type != board.board_type : 
        create_log(request, board.uid, "T_BOARD", "board_type", "게시판유형", res.board_type, board.board_type, user.user_id)
        request.state.inspect = frame()
        res.board_type = board.board_type 

    if board.permission_read is not None and res.permission_read != board.permission_read:
        create_log(request, board.uid, "T_BOARD", "permission_read", "게시판 읽기권한", res.permission_read, board.permission_read, user.user_id)
        request.state.inspect = frame()
        res.permission_read = board.permission_read

    if board.permission_write is not None and res.permission_write != board.permission_write:
        create_log(request, board.uid, "T_BOARD", "permission_write", "게시판 쓰기권한", res.permission_write, board.permission_write, user.user_id)
        request.state.inspect = frame()
        res.permission_write = board.permission_write

    if board.per_write is not None and res.per_write != board.per_write : 
        create_log(request, board.uid, "T_BOARD", "per_write", "게시판 쓰기권한", res.per_write, board.per_write, user.user_id)
        request.state.inspect = frame()
        res.per_write = board.per_write 

    if board.per_read is not None and res.per_read != board.per_read : 
        create_log(request, board.uid, "T_BOARD", "per_read", "게시판 읽기권한", res.per_read, board.per_read, user.user_id)
        request.state.inspect = frame()
        res.per_read = board.per_read 

    if board.is_comment is not None and res.is_comment != board.is_comment : 
        create_log(request, board.uid, "T_BOARD", "is_comment", "게시판 댓글여부", res.is_comment, board.is_comment, user.user_id)
        request.state.inspect = frame()
        res.is_comment = board.is_comment 

    if board.is_display is not None and res.is_display != board.is_display : 
        create_log(request, board.uid, "T_BOARD", "is_display", "게시판 표시여부", res.is_display, board.is_display, user.user_id)
        request.state.inspect = frame()
        res.is_display = board.is_display    

    if board.front_url is not None and res.front_url != board.front_url : 
        create_log(request, board.uid, "T_BOARD", "front_url", "게시판 프론트 URL", res.front_url, board.front_url, user.user_id)
        request.state.inspect = frame()
        res.front_url = board.front_url   
    
    
    res.update_at = util.getNow()
    return res

# 관리자 게시판 삭제
def board_delete(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user
    
    db_item = db.query(T_BOARD).filter(T_BOARD.uid == uid).first()

    create_log(request, uid, "T_BOARD", "DELETE", "게시판 삭제",
                    db_item.is_display, 'F', user.user_id)
    request.state.inspect = frame()
    
    db_item.is_display = 'F'
    db_item.delete_at = util.getNow()

    return db_item
















