from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case, and_
from fastapi import Request
from inspect import currentframe as frame
import math

from app.core import util
from app.core.database import format_sql
from app.core import exceptions as ex
from app.service.log_service import *
from app.models.reserve import *
from app.models.doctor import *
from app.models.display import *
from app.schemas.schema import *
from app.schemas.reserve import *


# 진료예약 리스트
def reserve_list(request: Request, page_param: PPage_param):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    filters.append(getattr(T_RESERVE, "delete_at") == None)

    # [ S ] search filter start
    if page_param.filters :
        if page_param.filters["skeyword"] :
            if page_param.filters["skeyword_type"] != "" :
            
                if page_param.filters["skeyword_type"] == "name" :
                    filters.append(getattr(T_RESERVE, page_param.filters["skeyword_type"]).like("%"+page_param.filters["skeyword"]+"%"))
                else :
                    filters.append(getattr(T_RESERVE, page_param.filters["skeyword_type"]).like("%"+page_param.filters["skeyword"]+"%"))
        
            else : 
                filters.append(
                    T_RESERVE.user_name.like("%"+page_param.filters["skeyword"]+"%") 
                    | T_RESERVE.mobile.like("%"+page_param.filters["skeyword"]+"%")
                )

        if page_param.filters["create_at"]["startDate"] and page_param.filters["create_at"]["endDate"] :
            filters.append(
                and_(
                    T_RESERVE.create_at >= page_param.filters["create_at"]["startDate"]
                    ,T_RESERVE.create_at <= page_param.filters["create_at"]["endDate"] + " 23:59:59"
                )
            )

        if page_param.filters["rev_date"]["startDate"] and page_param.filters["rev_date"]["endDate"] :
            filters.append(
                and_(
                    T_RESERVE.rev_date >= page_param.filters["rev_date"]["startDate"]
                    ,T_RESERVE.rev_date <= page_param.filters["rev_date"]["endDate"] + " 23:59:59"
                )
            )

        if page_param.filters["state"] :
            filters.append(T_RESERVE.state == page_param.filters["state"])
    # [ E ] search filter end
    
    sql = (
        db.query(
             T_RESERVE.uid
            ,T_RESERVE.state
            ,T_RESERVE.r_doctor_id
            ,T_RESERVE.doctor_uid
            ,T_RESERVE.user_id
            ,T_RESERVE.r_hospital
            ,T_RESERVE.cate_uid
            ,T_RESERVE.r_range
            ,T_RESERVE.rev_date
            ,T_RESERVE.rev_time
            ,T_RESERVE.user_name
            ,T_RESERVE.mobile
            ,T_RESERVE.birth
            ,T_RESERVE.is_first
            ,T_RESERVE.gender
            ,T_RESERVE.post
            ,T_RESERVE.addr
            ,T_RESERVE.addr_detail
            ,func.date_format(T_RESERVE.create_at, '%Y-%m-%d %T').label('create_at')
            ,T_DOCTOR.name
            ,T_CATEGORY.cate_name
        )
        .join(
            T_DOCTOR,
            T_DOCTOR.uid == T_RESERVE.doctor_uid,
            isouter = True 
        )
        .join(
            T_CATEGORY,
            T_CATEGORY.uid == T_RESERVE.cate_uid,
            isouter = True 
        )
        .filter(*filters)
        .order_by(T_RESERVE.uid.desc())
        .offset((page_param.page-1)*page_param.page_view_size)
        .limit(page_param.page_view_size)
    )

    format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    # [ S ] 페이징 처리
    page_param.page_total = (
        db.query(T_RESERVE)
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



# 진료예약_상태_편집 - 수정
def reserve_update_state(request: Request, reserveInput: ReserveInput) :
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    for uid in reserveInput.uid :

        # 기존 등록된 item select 
        res = db.query(T_RESERVE).filter(T_RESERVE.uid == uid).first()

        if res is None :
            raise ex.NotFoundUser

        if reserveInput.state is not None and res.state != reserveInput.state : 
            create_log(request, uid, "T_RESERVE", "state", "진료예약 상태", res.state, reserveInput.state, user.user_id)
            request.state.inspect = frame()
            res.state = reserveInput.state
        
        res.update_at = util.getNow()
    return 
    

# 관리자 진료과 - 상세
# def medical_cate_read(request: Request, uid: int):
#     request.state.inspect = frame()
#     db = request.state.db
#     sql = ( 
#         db.query(
#               T_CATEGORY.uid
#             ,T_CATEGORY.cate_name
#             ,T_CATEGORY.cate_icon
#             ,T_CATEGORY.cate_sort
#             ,T_CATEGORY.table_name
#             ,T_CATEGORY.table_uid
#             ,T_CATEGORY.is_reserve
#         )
#         .filter(
#             T_CATEGORY.uid == uid
#         )
#     )
#     format_sql(sql)
#     return sql.first()

# # 관리자 진료과 - 순서정렬
# def cate_sort(request: Request, mainCate: MainCate) :
#     request.state.inspect = frame()
#     db = request.state.db

#     res = (
#         db.query(
#             T_CATEGORY
#         )
#         .filter(T_CATEGORY.table_name == mainCate.table_name)
#         .all()
#     )
    
#     for c in res :
#         for i in mainCate.sort_array :
#             if c.uid == i :
#                 c.cate_sort = mainCate.sort_array.index(i)+1
    
#     return

# 관리자 인터넷서류발급 요청 - 리스트
def docs_list(request: Request, page_param: PPage_param):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    filters.append(getattr(T_DOCS, "delete_at") == None)

    # [ S ] search filter start
    if page_param.filters :
        if page_param.filters["skeyword"] :
            if page_param.filters["skeyword_type"] != "" :
            
                if page_param.filters["skeyword_type"] == "name" :
                    filters.append(getattr(T_DOCS, page_param.filters["skeyword_type"]).like("%"+page_param.filters["skeyword"]+"%"))
                else :
                    filters.append(getattr(T_DOCS, page_param.filters["skeyword_type"]).like("%"+page_param.filters["skeyword"]+"%"))
        
            else : 
                filters.append(
                    T_DOCS.name.like("%"+page_param.filters["skeyword"]+"%") 
                    | T_DOCS.mobile.like("%"+page_param.filters["skeyword"]+"%")
                )

        if page_param.filters["create_at"]["startDate"] and page_param.filters["create_at"]["endDate"] :
            filters.append(
                and_(
                    T_DOCS.create_at >= page_param.filters["create_at"]["startDate"]
                    ,T_DOCS.create_at <= page_param.filters["create_at"]["endDate"] + " 23:59:59"
                )
            )

        if page_param.filters["hope_at"]["startDate"] and page_param.filters["hope_at"]["endDate"] :
            filters.append(
                and_(
                    T_DOCS.hope_at >= page_param.filters["hope_at"]["startDate"]
                    ,T_DOCS.hope_at <= page_param.filters["hope_at"]["endDate"] + " 23:59:59"
                )
            )

        if page_param.filters["state"] :
            filters.append(T_DOCS.state == page_param.filters["state"])
    # [ E ] search filter end

    sql = (
        db.query(
             T_DOCS.uid
            ,T_DOCS.name
            ,T_DOCS.proposer
            ,T_DOCS.proposer_tel
            ,T_DOCS.proposer_mobile
            ,func.date_format(T_DOCS.hope_at, '%Y-%m-%d').label('hope_at')
            ,func.date_format(T_DOCS.create_at, '%Y-%m-%d').label('create_at')
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
            ,T_DOCS.addr2
            ,T_DOCS.addr3
            ,T_DOCS.tel
            ,T_DOCS.mobile
            ,T_DOCS.proposer
            ,T_DOCS.proposer_post
            ,T_DOCS.proposer_addr1
            ,T_DOCS.proposer_addr2
            ,T_DOCS.proposer_addr3
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


# 인터넷서류발급_편집 - 수정
def docs_state_update(request: Request, reserveInput: ReserveInput):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    for uid in reserveInput.uid :

        # 기존 등록된 item select 
        res = db.query(T_DOCS).filter(T_DOCS.uid == uid).first()

        if res is None :
            raise ex.NotFoundUser

        if reserveInput.state is not None and res.state != reserveInput.state : 
            create_log(request, uid, "T_DOCS", "state", "서류처리 상태", res.state, reserveInput.state, user.user_id)
            request.state.inspect = frame()
            res.state = reserveInput.state
        
        res.update_at = util.getNow()
    return 
    
# 인터넷서류발급_편집 - 수정
def docs_update(request: Request, reserveInput: ReserveInput):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    # 기존 등록된 item select 
    res = db.query(T_DOCS).filter(T_DOCS.uid == reserveInput.uid).first()

    if res is None :
        raise ex.NotFoundUser

    if reserveInput.state is not None and res.state != reserveInput.state : 
        create_log(request, reserveInput.uid, "T_DOCS", "state", "서류처리 상태", res.state, reserveInput.state, user.user_id)
        request.state.inspect = frame()
        res.state = reserveInput.state

    if reserveInput.issue_at is not None and res.issue_at != reserveInput.issue_at : 
        create_log(request, reserveInput.uid, "T_DOCS", "issue_at", "발급일", res.issue_at, reserveInput.issue_at, user.user_id)
        request.state.inspect = frame()
        res.issue_at = reserveInput.issue_at 
    
    res.update_at = util.getNow()
    return 