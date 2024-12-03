from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case, and_, or_, nullslast
from sqlalchemy.sql.expression import nulls_last
from fastapi import Request
from inspect import currentframe as frames
import math

from app.deps import auth
from app.core import util
from app.core.database import format_sql
from app.core import exceptions as ex
from app.service.log_service import *
from app.models.board import *
from app.models.display import *
from app.schemas.schema import *
from app.schemas.admin.board import *

# 게시판_상세
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
        )
        .filter(T_BOARD.uid == uid, T_BOARD.delete_at == None)
    )

    return sql.first()

# 게시물 리스트
def posts_list(request: Request, postsListInput: PostsListInput):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    filters.append(getattr(T_BOARD_POSTS, "board_uid") == postsListInput.board_uid)
    filters.append(getattr(T_BOARD_POSTS, "is_display") == 'T')
    filters.append(getattr(T_BOARD_POSTS, "delete_at") == None)

    if postsListInput.cate_uid > 0 :
        filters.append(getattr(T_BOARD_POSTS, "cate_uid") == postsListInput.cate_uid)

    # [ S ] search filter start
    if postsListInput.filters :
        if postsListInput.filters["skeyword"] :
            if postsListInput.filters["skeyword_type"] != "" :
                filters.append(getattr(T_BOARD_POSTS, postsListInput.filters["skeyword_type"]).like("%"+postsListInput.filters["skeyword"]+"%"))
            else : 
                filters.append(
                    T_BOARD_POSTS.title.like("%"+postsListInput.filters["skeyword"]+"%") 
                    | T_BOARD_POSTS.contents.like("%"+postsListInput.filters["skeyword"]+"%")
                )
    # [ E ] search filter end

    sql = (
        db.query(
             func.row_number().over(order_by=T_BOARD_POSTS.uid.desc()).label("no")
            ,T_BOARD_POSTS.uid
            ,T_BOARD_POSTS.board_uid
            ,T_BOARD_POSTS.cate_uid
            ,T_BOARD_POSTS.thumb
            ,T_BOARD_POSTS.title
            ,T_BOARD_POSTS.tags
            ,T_BOARD_POSTS.create_name
            ,T_BOARD_POSTS.state
            ,func.date_format(T_BOARD_POSTS.create_at, '%Y.%m.%d %T').label('create_at')
        )
        .filter(*filters)
        .order_by(T_BOARD_POSTS.uid.desc())
        .offset((postsListInput.page-1)*postsListInput.page_view_size)
        .limit(postsListInput.page_view_size)
    )

    # format_sql(sql)

    rows = []
    for c in sql.all():
        col = dict(zip(c.keys(), c))

        if col["create_name"] is not None :
            col["create_name"] = util.fn_masking_user_name(col["create_name"] if "create_name" in col else "")

        if col["state"] == "100" :
            col["state"] = "미답변"
        elif col["state"] == "200" :
            col["state"] = "답변완료"
        elif col["state"] == "300" :
            col["state"] = "공지"
            
        rows.append(col)

    # [ S ] 페이징 처리
    postsListInput.page_total = (
        db.query(T_BOARD_POSTS)
        .filter(*filters)
        .count()
    )
    postsListInput.page_last = math.ceil(postsListInput.page_total / postsListInput.page_view_size)
    postsListInput.page_size = len(rows) # 현재 페이지에 검색된 수
    # [ E ] 페이징 처리

    jsondata = {}
    jsondata.update({"params": postsListInput})
    jsondata.update({"list": rows})

    return jsondata

# 게시물_상세
def posts_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    sql = db.query(T_BOARD_POSTS).filter(T_BOARD_POSTS.uid == uid, T_BOARD_POSTS.is_display == "T", T_BOARD_POSTS.delete_at == None)
    res = sql.first()
    res.hits = util.checkNumeric(res.hits) + 1
    return res

# 게시물의 이전글, 다음글
def read_prev_next_posts(request: Request, posts_uid: int, board_uid: int):
    request.state.inspect = frame()
    db = request.state.db

    sql = """
        SELECT 
            uid
            ,title 
            ,DATE_FORMAT(create_at, '%Y-%m-%d %T') as create_at
        FROM T_BOARD_POSTS 
        where uid = (
            SELECT MAX(uid)
            FROM T_BOARD_POSTS
            WHERE uid < {posts_uid}
            and board_uid = {board_uid}
            and is_display = 'T'
            and delete_at is null
        )
    """.format(board_uid=board_uid, posts_uid=posts_uid)
    prev_posts = db.execute(text(sql)).first()

    sql = """
        SELECT 
            uid
            ,title 
            ,DATE_FORMAT(create_at, '%Y-%m-%d %T') as create_at
        FROM T_BOARD_POSTS 
        where uid = (
            SELECT MIN(uid)
            FROM T_BOARD_POSTS
            WHERE uid > {posts_uid} 
            and board_uid = {board_uid}
            and is_display = 'T'
            and delete_at is null
        )
    """.format(board_uid=board_uid, posts_uid=posts_uid)
    next_posts = db.execute(text(sql)).first()

    if prev_posts is None:
        prev_posts = {"uid":0, "title": "이전 게시물이 없습니다.", "create_at": ""}
    else :
        prev_posts = dict(zip(prev_posts.keys(), prev_posts))

    if next_posts is None:
        next_posts = {"uid":0, "title": "다음 게시물이 없습니다.", "create_at": ""}
    else :
        next_posts = dict(zip(next_posts.keys(), next_posts))

    jsondata = {}
    jsondata.update({"prev_posts": prev_posts})
    jsondata.update({"next_posts": next_posts})
    return jsondata

# 비밀번호 확인
def pass_vaild(request: Request, postsInput: PostsInput):
    request.state.inspect = frame()
    db = request.state.db 

    sql = """
        select 
             password
            ,OLD_PASSWORD('{password}') as old_password
        from T_BOARD_POSTS_PERSON
        where uid = {posts_uid}
    """.format(password=postsInput.password, posts_uid=postsInput.posts_uid)
    person_password = db.execute(text(sql)).first()

    if not person_password:
        return None
    
    if len(person_password.password) == 16 :
        if person_password.password != person_password.old_password :
            return None
    else :
        if not auth.verify_password(postsInput.password, person_password.password):
            return None
    
    return person_password

# 프론트 게시글 등록
def posts_create(request: Request, posts: Posts) :
    request.state.inspect = frame()
    db = request.state.db 
    
    db_item_posts = T_BOARD_POSTS (
        board_uid = posts.board_uid
        ,title = posts.title
        ,contents = posts.contents
        ,state = "100"
        ,create_name = posts.name
        ,user_ip = request.state.user_ip
    )
    db.add(db_item_posts)
    db.flush()

    db_item_person = T_BOARD_POSTS_PERSON (
        uid = db_item_posts.uid
        ,board_uid = posts.board_uid
        ,password = posts.password
        ,name = posts.name
        ,email = posts.email
        ,mobile = posts.mobile
    )
    db.add(db_item_person)
    db.flush()
    
    create_log(request, db_item_person.uid, "T_BOARD_POSTS_PERSON", "INSERT", "게시글 개인정보 등록", 0, db_item_person.uid, request.state.user_ip)
    request.state.inspect = frame()

    create_log(request, db_item_posts.uid, "T_BOARD_POSTS", "INSERT", "게시글 등록", 0, db_item_posts.uid, request.state.user_ip)
    request.state.inspect = frame()

    return db_item_posts

# 게시물 등록자의 개인정보
def posts_person_read(request: Request, posts_uid: int) :
    request.state.inspect = frame()
    db = request.state.db

    sql = ( 
        db.query(
             T_BOARD_POSTS_PERSON.name
            ,T_BOARD_POSTS_PERSON.email
            ,T_BOARD_POSTS_PERSON.mobile
            ,T_BOARD_POSTS_PERSON.create_user
        )
        .filter(
            T_BOARD_POSTS_PERSON.uid == posts_uid
        )
    )
    # format_sql(sql)
    return sql.first()

# 게시물 첨부파일 리스트
def posts_files_list(request: Request, posts_uid: int):
    request.state.inspect = frame()
    user = request.state.user
    db = request.state.db

    sql = (
        db.query(
             T_BOARD_FILES.uid
            ,T_BOARD_FILES.board_uid
            ,T_BOARD_FILES.posts_uid
            ,T_BOARD_FILES.fake_name
            ,T_BOARD_FILES.file_url
            ,T_BOARD_FILES.sort
        )
        .filter(
            T_BOARD_FILES.posts_uid == posts_uid
        )
        .order_by(T_BOARD_FILES.sort.asc())
    )
    # format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    # jsondata = {}
    # jsondata.update(mainListInput)
    # jsondata.update({"list": rows})

    return rows

# 게시물의 댓글(답변)리스트
def posts_reply_list(request: Request, posts_uid: int) :
    request.state.inspect = frame()
    db = request.state.db

    sql = (
        db.query(
             T_BOARD_POSTS_REPLY.uid
            ,T_BOARD_POSTS_REPLY.reply
            ,T_BOARD_POSTS_REPLY.user_id
            ,T_BOARD_POSTS_REPLY.user_name
            ,func.date_format(T_BOARD_POSTS_REPLY.create_at, '%Y-%m-%d %T').label('create_at')
        )
        .filter(
            T_BOARD_POSTS_REPLY.delete_at == None,
            T_BOARD_POSTS_REPLY.posts_uid == posts_uid
        )
        .order_by(T_BOARD_POSTS_REPLY.uid.desc())
    )

    # format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    jsondata = {}
    jsondata.update({"list": rows})

    return jsondata



# 뉴스 리스트
def posts_news_list(request: Request, mainPostsListInput: MainPostsListInput):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    filters.append(getattr(T_BOARD_POSTS, "board_uid") == mainPostsListInput.board_uid)
    filters.append(getattr(T_BOARD_POSTS, "is_display") == 'T')
    filters.append(getattr(T_BOARD_POSTS, "delete_at") == None)

    if mainPostsListInput.cate_uid > 0 :
        filters.append(getattr(T_BOARD_POSTS, "cate_uid") == mainPostsListInput.cate_uid)

    sql = (
        db.query(
             func.row_number().over(order_by=T_BOARD_POSTS.uid.desc()).label("no")
            ,T_BOARD_POSTS.uid
            ,T_BOARD_POSTS.board_uid
            ,T_BOARD_POSTS.cate_uid
            ,T_BOARD_POSTS.thumb
            ,T_BOARD_POSTS.title
            ,T_BOARD_POSTS.tags
            ,T_BOARD_POSTS.create_name
            ,T_BOARD_POSTS.state
            ,func.date_format(T_BOARD_POSTS.create_at, '%Y.%m.%d %T').label('create_at')
        )
        .filter(*filters)
        .order_by((T_BOARD_POSTS.pin == None).asc(), T_BOARD_POSTS.uid.desc())
        .limit(mainPostsListInput.limit)
    )

    # format_sql(sql)

    rows = []
    for c in sql.all():
        col = dict(zip(c.keys(), c)) 
        rows.append(col)

    jsondata = {}
    jsondata.update({"list": rows})

    return jsondata








