from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case, and_
from fastapi import Request
from inspect import currentframe as frame
import math

from app.deps import auth
from app.core import util
from app.core import exceptions as ex
from app.core.database import format_sql
from app.service.log_service import *
from app.models.reserve import *
from app.schemas.reserve import *

# 진료예약 - 등록
def doctor_create(request: Request, reserve: Reserve):
    request.state.inspect = frame()
    db = request.state.db 

    db_item = T_RESERVE (
        doctor_uid = reserve.doctor_uid
        ,cate_uid = reserve.cate_uid
        ,rev_date = reserve.rev_date
        ,rev_time = reserve.rev_time
        ,user_name = reserve.user_name
        ,mobile = reserve.mobile
        ,birth = reserve.birth
        ,is_first = reserve.is_first
        ,gender = reserve.gender
        ,post = reserve.post
        ,addr = reserve.addr
        ,addr_detail = reserve.addr_detail
        ,user_ip = request.state.user_ip
    )
    db.add(db_item)
    db.flush()

    create_log(request, db_item.uid, "T_RESERVE", "INSERT", "진료예약 등록", 0, db_item.uid, request.state.user_ip)
    request.state.inspect = frame()

    return db_item

# 인터넷서류발급 요청 - 상세
def docs_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db 
    
    sql = ( 
        db.query(
             T_DOCS.uid
            ,T_DOCS.name
            ,T_DOCS.post
            ,T_DOCS.addr1
            ,T_DOCS.tel
            ,T_DOCS.mobile
            ,T_DOCS.proposer
            ,T_DOCS.proposer_post
            ,T_DOCS.proposer_addr1
            ,T_DOCS.proposer_tel
            ,T_DOCS.proposer_mobile
            ,T_DOCS.password
            ,T_DOCS.relation_type
            ,T_DOCS.purpose_type
            ,func.date_format(T_DOCS.hope_at, '%Y-%m-%d').label('hope_at')
            ,func.date_format(T_DOCS.issue_at, '%Y-%m-%d').label('issue_at')
            ,T_DOCS.state
            ,func.date_format(T_DOCS.create_at, '%Y-%m-%d').label('create_at')
        )
        .filter(T_DOCS.uid == uid, T_DOCS.delete_at == None)
    )
    # format_sql(sql)
    return sql.first()

def docs_request_list(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db 
    sql = (
        db.query(
             T_DOCS_REQUEST.uid
            ,T_DOCS_REQUEST.docs_uid
            ,T_DOCS_REQUEST.docs_name
            ,T_DOCS_REQUEST.docs_ea
        )
        .filter(
            T_DOCS_REQUEST.docs_uid == uid
        )
    )
    
    return sql.all()

# 인터넷서류발급 요청 - 리스트
def docs_list(request: Request, page_param: PPage_param):
    request.state.inspect = frame()
    db = request.state.db 

    filters = []
    filters.append(getattr(T_DOCS, "delete_at") == None)

    sql = (
        db.query(
             T_DOCS.uid
            ,T_DOCS.name
            ,T_DOCS.proposer
            ,T_DOCS.proposer_tel
            ,T_DOCS.proposer_mobile
            ,func.date_format(T_DOCS.hope_at, '%Y-%m-%d').label('hope_at')
            ,T_DOCS.state
        )
        .filter(*filters)
        .order_by(T_DOCS.uid.desc())
        .offset((page_param.page-1)*page_param.page_view_size)
        .limit(page_param.page_view_size)
    )

    format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))


    rows = []
    for c in sql.all():
        col = dict(zip(c.keys(), c))

        if col["name"] is not None :
            col["name"] = util.fn_masking_user_name(col["name"] if "name" in col else "")

        if col["proposer"] is not None :
            col["proposer"] = util.fn_masking_user_name(col["proposer"] if "proposer" in col else "")

        if col["proposer_tel"] is not None :
            col["proposer_tel"] = util.fn_masking_user_mobile(col["proposer_tel"] if "proposer_tel" in col else "")

        if col["proposer_mobile"] is not None :
            col["proposer_mobile"] = util.fn_masking_user_mobile(col["proposer_mobile"] if "proposer_mobile" in col else "")
            
        rows.append(col)

    # [ S ] 페이징 처리
    page_param.page_total = (
        db.query(T_DOCS)
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

# 인터넷서류발급 요청 - 등록
def docs_create(request: Request, docsInput: DocsInput):
    request.state.inspect = frame()
    db = request.state.db 

    db_item = T_DOCS (
         name = docsInput.name
        ,post = docsInput.post
        ,addr1 = docsInput.addr1
        ,addr2 = docsInput.addr2
        ,addr3 = docsInput.addr3
        ,tel = docsInput.tel
        ,mobile = docsInput.mobile
        ,proposer = docsInput.proposer
        ,proposer_post = docsInput.proposer_post
        ,proposer_addr1 = docsInput.proposer_addr1
        ,proposer_addr2 = docsInput.proposer_addr2
        ,proposer_addr3 = docsInput.proposer_addr3
        ,proposer_tel = docsInput.proposer_tel
        ,proposer_mobile = docsInput.proposer_mobile
        ,password = docsInput.password
        ,relation_type = docsInput.relation_type
        ,purpose_type = docsInput.purpose_type
        ,hope_at = docsInput.hope_at
        ,issue_at = docsInput.hope_at
    )
    db.add(db_item)
    db.flush()

    for c in docsInput.request :
        if (c["checked"] == True) :

            # return
            docs_request_create(request, c, db_item.uid)

    create_log(request, db_item.uid, "T_DOCS", "INSERT", "인터넷서류발급요청 등록", 0, db_item.uid, request.state.user_ip)
    request.state.inspect = frame()


    return db_item

# 필요신청서류 등록
def docs_request_create(request: Request, docsrequest: dict, uid: int):
    request.state.inspect = frame()
    db = request.state.db

    db_item = T_DOCS_REQUEST (
         docs_uid = uid
        ,docs_name = docsrequest["docs_name"]
        ,docs_ea = docsrequest["docs_ea"]
    )
    db.add(db_item)
    db.flush()
    
    return db_item


# 비밀번호 확인
def pass_vaild(request: Request, docsReadInput: DocsReadInput):
    request.state.inspect = frame()
    db = request.state.db 

    sql = """
        select 
             password
            ,OLD_PASSWORD('{password}') as old_password
        from T_DOCS
        where uid = {uid}
    """.format(password=docsReadInput.password, uid=docsReadInput.uid)
    person_password = db.execute(text(sql)).first()

    if not person_password:
        return None
    
    if len(person_password.password) == 16 :
        if person_password.password != person_password.old_password :
            return None
    else :
        if not auth.verify_password(docsReadInput.password, person_password.password):
            return None
    
    return person_password


