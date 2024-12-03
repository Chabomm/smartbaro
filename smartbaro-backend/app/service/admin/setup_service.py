from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case, and_
from fastapi import Request
from inspect import currentframe as frame
from fastapi.encoders import jsonable_encoder
import math

from app.core import exceptions as ex
from app.core import util
from app.core.database import format_sql
from app.service.log_service import *
from app.deps import auth

# from app.models.member import *
# from app.models.board import *
# from app.models.display import *
# from app.schemas.auth import *
# from app.schemas.member import *
# from app.schemas.board import *

from app.models.admin import *
from app.models.menu import *
from app.models.session import *
from app.schemas.admin.admin import *


# 내 정보 보기
def info_read(request: Request):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user

    sql = (
        db.query(
             T_ADMIN.uid
            ,T_ADMIN.user_id
            ,T_ADMIN.user_name
            ,T_ADMIN.tel
            ,T_ADMIN.mobile
            ,T_ADMIN.email
            ,T_ADMIN.depart
            ,T_ADMIN.position1
            ,T_ADMIN.position2
            ,T_ADMIN.state
        )
        .filter(T_ADMIN.user_id == user.user_id)
    )
    format_sql(sql)
    res = sql.first()
    if res is not None:
        res = dict(zip(res.keys(), res))
    return res


# 내 정보 보기 - 수정
def info_update(request: Request, myInfoInput: MyInfoInput) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    res = db.query(T_ADMIN).filter(T_ADMIN.user_id == user.user_id).first()

    if res is None :
        raise ex.NotFoundUser

    if myInfoInput.user_pw is not None and res.user_pw != auth.get_password_hash(myInfoInput.user_pw):
        create_log(request, res.uid, "T_ADMIN", "user_pw", "비밀번호 변경", res.user_pw, auth.get_password_hash(myInfoInput.user_pw), user.user_id)
        request.state.inspect = frame()
        res.user_pw = auth.get_password_hash(myInfoInput.user_pw)


    if myInfoInput.tel is not None and res.tel != myInfoInput.tel : 
        create_log(request, res.uid, "T_ADMIN", "tel", "내선번호", res.tel, myInfoInput.tel, user.user_id)
        request.state.inspect = frame()
        res.tel = myInfoInput.tel

    if myInfoInput.mobile is not None and res.mobile != myInfoInput.mobile : 
        create_log(request, res.uid, "T_ADMIN", "mobile", "핸드폰번호", res.mobile, myInfoInput.mobile, user.user_id)
        request.state.inspect = frame()
        res.mobile = myInfoInput.mobile
        
    if myInfoInput.user_name is not None and res.user_name != myInfoInput.user_name : 
        create_log(request, res.uid, "T_ADMIN", "user_name", "이름", res.user_name, myInfoInput.user_name, user.user_id)
        request.state.inspect = frame()
        res.user_name = myInfoInput.user_name

    if myInfoInput.email is not None and res.email != myInfoInput.email : 
        create_log(request, res.uid, "T_ADMIN", "email", "이메일", res.email, myInfoInput.email, user.user_id)
        request.state.inspect = frame()
        res.email = myInfoInput.email

    if myInfoInput.depart is not None and res.depart != myInfoInput.depart : 
        create_log(request, res.uid, "T_ADMIN", "depart", "부서", res.depart, myInfoInput.depart, user.user_id)
        request.state.inspect = frame()
        res.depart = myInfoInput.depart

    res.update_at = util.getNow()

    return res




# 관리자 리스트
def admin_user_list(request: Request, page_param: PPage_param):
    request.state.inspect = frame()
    db = request.state.db

    seqlt = db.query(T_ADMIN).filter(func.json_contains(T_ADMIN.roles, f'[4,2]'))
    format_sql(seqlt)


    where = ""
    where = where + "WHERE delete_at is NULL "

    # [ S ] search filter start
    if not util.isEmptyObject(page_param.filters, "state") :
        where = where + "AND state = '" + page_param.filters["state"] + "' "

    if not util.isEmptyObject(page_param.filters, "roles") and len(page_param.filters["roles"]) > 0 :
        # _in = "(" + ','.join([str(x) for x in page_param.filters["roles"]]) + ")"
        where = where + "AND json_contains(roles, '"+ str(page_param.filters["roles"]) +"') "


    if not util.isEmptyObject(page_param.filters, "skeyword") :
        if not util.isEmptyObject(page_param.filters, "skeyword_type") :
            where = where + "AND "+page_param.filters["skeyword_type"]+" like '%"+page_param.filters["skeyword"]+"%'"
        else : 
            where = where + "AND ("
            where = where + "   user_id like '%"+page_param.filters["skeyword"]+"%'"
            where = where + "   or user_name like '%"+page_param.filters["skeyword"]+"%'"
            where = where + "   or depart like '%"+page_param.filters["skeyword"]+"%'"
            where = where + ") "
    # [ E ] search filter end
            
    sql = """
        SELECT 
             uid
            ,user_id
            ,user_name
            ,mobile
            ,email
            ,role
            ,depart
            ,DATE_FORMAT(create_at, '%Y-%m-%d %T') as create_at
            ,state
            ,roles
            ,( 
                select GROUP_CONCAT(name SEPARATOR ', ') AS result  
                From T_ADMIN_ROLE 
                where uid MEMBER OF(roles->>'$')
            ) as roles_txt
        FROM T_ADMIN
        {where}
        ORDER BY uid DESC
        LIMIT {start}, {end}
    """.format(where=where, start=(page_param.page-1)*page_param.page_view_size, end=page_param.page_view_size)

    res = db.execute(text(sql)).fetchall()

    rows = []
    for c in res :
        rows.append(dict(zip(c.keys(), c)))

    # [ S ] 페이징 처리
    # page_param.page_total = (
    #     db.query(T_ADMIN)
    #     .filter(*filters)
    #     .count()
    # )

    page_param.page_total = db.execute(text("select count(uid) as cnt from T_ADMIN where delete_at is NULL")).scalar()

    page_param.page_last = math.ceil(page_param.page_total / page_param.page_view_size)
    page_param.page_size = len(rows)  # 현재 페이지에 검색된 수
    # [ E ] 페이징 처리

    jsondata = {}
    jsondata.update({"params" : page_param})
    jsondata.update({"list": rows})

    return jsondata

# 관리자 상세
def admin_user_read(request: Request, uid: int = 0, user_id: str = ""):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    filters.append(getattr(T_ADMIN, "delete_at") == None)

    if uid > 0:
        filters.append(getattr(T_ADMIN, "uid") == uid)
    elif user_id != "":
        filters.append(getattr(T_ADMIN, "user_id") == user_id)
    else:
        return None

    sql = (
        db.query(
             T_ADMIN.uid
            ,T_ADMIN.user_id
            ,T_ADMIN.user_name
            ,T_ADMIN.mobile
            ,T_ADMIN.email
            ,T_ADMIN.role
            ,T_ADMIN.depart
            ,T_ADMIN.state
            ,T_ADMIN.roles
            ,func.date_format(T_ADMIN.create_at, '%Y-%m-%d %T').label('create_at')
        )
        .filter(*filters)
    )
    return sql.first()

# 관리자 편집 - 등록
def admin_user_create(request: Request, adminInput: Admin):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user

    user_data = admin_user_read(request, 0, adminInput.user_id)
    request.state.inspect = frame()

    if user_data is not None:
        return ex.ReturnOK(300, "이미 등록된 아이디 입니다.", request)

    db_item = T_ADMIN(
         user_id = adminInput.user_id
        ,user_name = adminInput.user_name
        ,user_pw = auth.get_password_hash(adminInput.user_pw)
        ,tel = adminInput.tel
        ,mobile = adminInput.mobile
        ,email = adminInput.email
        ,role = adminInput.role
        ,depart = adminInput.depart
        ,roles = adminInput.roles
    )
    db.add(db_item)
    db.flush()
    
    create_log(request, db_item.uid, "T_ADMIN", "INSERT", "관리자 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 관리자 편집 - 수정
def admin_user_edit(request: Request, adminInput: Admin):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user
    # 기존 등록된 관리자 select
    res = db.query(T_ADMIN).filter(T_ADMIN.uid == adminInput.uid).first()

    if res is None:
        return ex.ReturnOK(300, "수정할 데이터를 찾지 못했습니다.", request)

    if adminInput.state is not None and res.state != adminInput.state:
        create_log(request, adminInput.uid, "T_ADMIN", "state", "상태 수정", res.state, adminInput.state, user.user_id)
        request.state.inspect = frame()
        res.state = adminInput.state

    if adminInput.user_name is not None and res.user_name != adminInput.user_name:
        create_log(request, adminInput.uid, "T_ADMIN", "user_name", "이름 수정", res.user_name, adminInput.user_name, user.user_id)
        request.state.inspect = frame()
        res.user_name = adminInput.user_name

    if adminInput.tel is not None and res.tel != adminInput.tel:
        create_log(request, adminInput.uid, "T_ADMIN", "tel", "일반전화번호 수정", res.tel, adminInput.tel, user.user_id)
        request.state.inspect = frame()
        res.tel = adminInput.tel

    if adminInput.mobile is not None and res.mobile != adminInput.mobile:
        create_log(request, adminInput.uid, "T_ADMIN", "mobile", "휴대전화번호 수정", res.mobile, adminInput.mobile, user.user_id)
        request.state.inspect = frame()
        res.mobile = adminInput.mobile

    if adminInput.email is not None and res.email != adminInput.email:
        create_log(request, adminInput.uid, "T_ADMIN", "email", "이메일 수정", res.email, adminInput.email, user.user_id)
        request.state.inspect = frame()
        res.email = adminInput.email

    if adminInput.depart is not None and res.depart != adminInput.depart:
        create_log(request, adminInput.uid, "T_ADMIN", "depart", "부서 수정", res.depart, adminInput.depart, user.user_id)
        request.state.inspect = frame()
        res.depart = adminInput.depart

    # 국제바로병원은 관리자 권한 디비에서 직접 수정할수 있도록
    # if adminInput.role is not None and res.role != adminInput.role:
    #     create_log(request, adminInput.uid, "T_ADMIN", "role", "관리자 권한 수정", res.role, adminInput.role, user.user_id)
    #     request.state.inspect = frame()
    #     res.role = adminInput.role

    if adminInput.roles is not None and res.roles != adminInput.roles:
        create_log(request, adminInput.uid, "T_ADMIN", "roles", "역할 수정", res.roles, adminInput.roles, user.user_id)
        request.state.inspect = frame()
        res.roles = adminInput.roles

    if adminInput.user_pw is not None and res.user_pw != auth.get_password_hash(adminInput.user_pw):
        create_log(request, adminInput.uid, "T_ADMIN", "user_pw", "비밀번호 변경", "", "", user.user_id)
        request.state.inspect = frame()
        res.user_pw = auth.get_password_hash(adminInput.user_pw)

    res.update_at = util.getNow()
    return res


# 관리자 편집 - 삭제
def admin_user_delete(request: Request, adminInput: Admin):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user

    # 기존 등록된 관리자 select
    res = db.query(T_ADMIN).filter(T_ADMIN.uid == adminInput.uid).first()

    if res is None:
        return ex.ReturnOK(300, "데이터를 찾지 못했습니다.", request)

    res.delete_at = util.getNow()
    res.update_at = util.getNow()
    return res

# 역할관리_리스트
def admin_rols_list(request: Request):
    request.state.inspect = frame()
    db = request.state.db

    filters = []

    sql = (
        db.query(
             T_ADMIN_ROLE.uid
            ,T_ADMIN_ROLE.name
            ,T_ADMIN_ROLE.menus
        )
        .filter(*filters)
    )

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    jsondata = {}
    jsondata.update({"list": rows})
    return jsondata

# 역할관리_상세
def admin_roles_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    
    sql = (
        db.query(
             T_ADMIN_ROLE.uid
            ,T_ADMIN_ROLE.name
            ,T_ADMIN_ROLE.menus
        )
        .filter(T_ADMIN_ROLE.uid == uid)
    )
    format_sql(sql)
    res = sql.first()
    if res is not None:
        res = dict(zip(res.keys(), res))
    return res

# 역할관리_상세_메뉴리스트
def menu_list_for_filter(request: Request):
    request.state.inspect = frame()
    db = request.state.db

    jsondata = {}

    sql1 = (
        db.query(
             T_ADMIN_MENU.uid
            ,T_ADMIN_MENU.name
            ,T_ADMIN_MENU.depth
            ,T_ADMIN_MENU.parent
        )
        .filter(T_ADMIN_MENU.depth == 1)
        .order_by(T_ADMIN_MENU.sort.asc())
    )
    depth1 = []
    for c in sql1.all() :
        depth1.append(dict(zip(c.keys(), c)))
    jsondata.update({"depth1": depth1})

    sql2 = (
        db.query(
             T_ADMIN_MENU.uid
            ,T_ADMIN_MENU.name
            ,T_ADMIN_MENU.depth
            ,T_ADMIN_MENU.parent
        )
        .filter(T_ADMIN_MENU.depth == 2)
        .order_by(T_ADMIN_MENU.sort.asc())
    )
    depth2 = []
    for c in sql2.all() :
        depth2.append(dict(zip(c.keys(), c)))
    jsondata.update({"depth2": depth2})
    
    return jsondata

# 역할관리_편집 - 등록
def admin_roles_create(request: Request, adminRolesInput: AdminRolesInput) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    db_item = T_ADMIN_ROLE (
         name = adminRolesInput.name
        ,menus = adminRolesInput.menus
    )
    db.add(db_item)
    db.flush()

    create_log(request, db_item.uid, "T_ADMIN_ROLE", "INSERT", "역할 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 역할관리_편집 - 수정
def admin_roles_update(request: Request, adminRolesInput: AdminRolesInput) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    res = db.query(T_ADMIN_ROLE).filter(T_ADMIN_ROLE.uid == adminRolesInput.uid).first()

    if res is None :
        raise ex.NotFoundUser

    if adminRolesInput.name is not None and res.name != adminRolesInput.name : 
        create_log(request, adminRolesInput.uid, "T_ADMIN_ROLE", "name", "역할명", res.name, adminRolesInput.name, user.user_id)
        request.state.inspect = frame()
        res.name = adminRolesInput.name

    if adminRolesInput.menus is not None and res.menus != adminRolesInput.menus : 
        create_log(request, adminRolesInput.uid, "T_ADMIN_ROLE", "menus", "역할에 배정된 메뉴", res.menus, adminRolesInput.menus, user.user_id)
        request.state.inspect = frame()
        res.menus = adminRolesInput.menus

    return res

# 역할관리_편집 - 삭제
def admin_roles_delete(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user

    db.query(T_ADMIN_ROLE).filter(T_ADMIN_ROLE.uid == uid).delete()

    create_log(request, uid, "T_ADMIN_ROLE", "DELETE", "관리자 역할관리 삭제", 0, uid, user.user_id)
    request.state.inspect = frame()

    return

# 관리자 로그인이력 리스트
def admin_login_list(request: Request, page_param: PPage_param):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    # [ S ] search filter start
    
    if page_param.filters :
        if page_param.filters["skeyword"] :
            if page_param.filters["skeyword_type"] != "" :
                filters.append(getattr(T_SESSION_HISTORY, page_param.filters["skeyword_type"]).like("%"+page_param.filters["skeyword"]+"%"))
            else : 
                filters.append(
                    T_SESSION_HISTORY.user_id.like("%"+page_param.filters["skeyword"]+"%") 
                    | T_SESSION_HISTORY.ip.like("%"+page_param.filters["skeyword"]+"%")
                    | T_SESSION_HISTORY.profile.like("%"+page_param.filters["skeyword"]+"%")
                )

        if page_param.filters["create_date"]["startDate"] and page_param.filters["create_date"]["endDate"] :
            filters.append(
                and_(
                    T_SESSION_HISTORY.create_date >= page_param.filters["create_date"]["startDate"]
                    ,T_SESSION_HISTORY.create_date <= page_param.filters["create_date"]["endDate"] + " 23:59:59"
                )
            )

    # [ E ] search filter end
    
    sql = (
        db.query(
             T_SESSION_HISTORY.uid
            ,T_SESSION_HISTORY.user_uid
            ,T_SESSION_HISTORY.user_id
            ,T_SESSION_HISTORY.ip
            ,func.date_format(T_SESSION_HISTORY.create_date, '%Y-%m-%d %T').label('create_date')
            ,T_SESSION_HISTORY.profile
        )
        .filter(*filters)
        .order_by(T_SESSION_HISTORY.uid.desc())
        .offset((page_param.page-1)*page_param.page_view_size)
        .limit(page_param.page_view_size)
    )

    format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    # [ S ] 페이징 처리
    page_param.page_total = (
        db.query(T_SESSION_HISTORY)
        .filter(*filters)
        .count()
    )
    page_param.page_last = math.ceil(
        page_param.page_total / page_param.page_view_size)
    page_param.page_size = len(rows)  # 현재 페이지에 검색된 수
    # [ E ] 페이징 처리

    jsondata = {}
    jsondata.update(page_param)
    jsondata.update({"list": rows})

    return jsondata