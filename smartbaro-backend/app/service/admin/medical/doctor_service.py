from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case, and_
from fastapi import Request
from inspect import currentframe as frame
from fastapi.encoders import jsonable_encoder
import math

from app.core import util
from app.core.database import format_sql
from app.core import exceptions as ex
from app.service.log_service import *
from app.models.display import *
from app.models.doctor import *
from app.schemas.schema import *
from app.schemas.doctor import *

# 관리자 의료진 - 리스트
def medical_doctor_list(request: Request, nonPage_param: NonPage_param):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    filters.append(getattr(T_DOCTOR, "delete_at") == None)
    # filters.append(getattr(T_CATEGORY, "table_name") == 'T_DOCTOR')

    # if uid > 0 :
    #     filters.append(getattr(T_CATEGORY, "uid") == uid)

    # [ S ] search filter start
    if nonPage_param.filters :
        if nonPage_param.filters["skeyword"] :
            if nonPage_param.filters["skeyword_type"] != "" :
                filters.append(getattr(T_DOCTOR, nonPage_param.filters["skeyword_type"]).like("%"+nonPage_param.filters["skeyword"]+"%"))
            else : 
                filters.append(
                    T_DOCTOR.name.like("%"+nonPage_param.filters["skeyword"]+"%") 
                    | T_DOCTOR.field_keyword.like("%"+nonPage_param.filters["skeyword"]+"%")
                    | T_DOCTOR.position.like("%"+nonPage_param.filters["skeyword"]+"%")
                )

        if nonPage_param.filters["create_at"]["startDate"] and nonPage_param.filters["create_at"]["endDate"] :
            filters.append(
                and_(
                    T_DOCTOR.create_at >= nonPage_param.filters["create_at"]["startDate"]
                    ,T_DOCTOR.create_at <= nonPage_param.filters["create_at"]["endDate"] + " 23:59:59"
                )
            )

        # if len(nonPage_param.filters["cate_uid"]) > 0 :
        #     filters.append(
        #         func.json_contains(T_DOCTOR.cate_uid, str(nonPage_param.filters["cate_uid"]))
        #     )


        # if nonPage_param.filters["board_type"] :
        #     filters.append(T_DOCTOR.board_type == nonPage_param.filters["board_type"])

        # if nonPage_param.filters["state"] :
        #     filters.append(T_DREAM_COUNSEL.state.in_(nonPage_param.filters["state"]))

        # if nonPage_param.filters["cate_uid"] :
        #     filters.append(T_DOCTOR.cate_uid.in_(nonPage_param.filters["state"]))

        # print (
        #     db.query(T_DOCTOR)
        #     .filter(func.json_contains(T_DOCTOR.cate_uid, f'[4,2]'))
        #     .count()
        # )
    # [ E ] search filter end

    # [ S ] category_list
    sql = ( 
        db.query(
            T_CATEGORY.uid,
            T_CATEGORY.cate_name,
            T_CATEGORY.cate_icon,
            T_CATEGORY.is_reserve
        )
        .filter(T_CATEGORY.table_name == 'T_DOCTOR')
        .order_by(T_CATEGORY.cate_sort.asc())
    )

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))
    
    jsondata = {}
    jsondata.update({"category_list": rows})
    # [ E ] category_list

    sql2 = (
        db.query(
             T_DOCTOR.uid
            ,T_DOCTOR.cate_uid
            ,T_DOCTOR.name
            ,T_DOCTOR.position
            ,T_DOCTOR.thumb
            ,T_DOCTOR.profile
            ,T_DOCTOR.field_keyword
            ,T_DOCTOR.sort
            ,func.date_format(T_DOCTOR.create_at, '%Y-%m-%d %T').label('create_at')
            ,func.date_format(T_DOCTOR.update_at, '%Y-%m-%d %T').label('update_at')
        )
        .filter(*filters)
        .order_by(T_DOCTOR.sort.asc())
    )

    format_sql(sql2)

    doctor_list = []
    for c in sql2.all():
        doctor_list.append(dict(zip(c.keys(), c)))
    
    jsondata.update({"doctor_list": doctor_list})

    return jsondata

# 관리자 의료진_ - 상세
def medical_doctor_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    filters.append(getattr(T_DOCTOR, "delete_at") == None)
    filters.append(getattr(T_DOCTOR, "uid") == uid)
    # filters.append(getattr(T_DOCTOR_SCHEDULE, "delete_at") == None)
    
    sql = (
        db.query(
             T_DOCTOR.uid
            ,T_DOCTOR.cate_uid
            ,T_DOCTOR.name
            ,T_DOCTOR.position
            ,T_DOCTOR.thumb
            ,T_DOCTOR.profile
            ,T_DOCTOR.field_keyword
            ,T_DOCTOR.field_spec
            ,T_DOCTOR.career
            ,T_CATEGORY.cate_name
            ,T_CATEGORY.is_reserve
            ,T_DOCTOR_SCHEDULE.am_week_1
            ,T_DOCTOR_SCHEDULE.am_week_2
            ,T_DOCTOR_SCHEDULE.am_week_3
            ,T_DOCTOR_SCHEDULE.am_week_4
            ,T_DOCTOR_SCHEDULE.am_week_5
            ,T_DOCTOR_SCHEDULE.pm_week_1
            ,T_DOCTOR_SCHEDULE.pm_week_2
            ,T_DOCTOR_SCHEDULE.pm_week_3
            ,T_DOCTOR_SCHEDULE.pm_week_4
            ,T_DOCTOR_SCHEDULE.pm_week_5
        )
        .join(
            T_CATEGORY,
            T_CATEGORY.uid == T_DOCTOR.cate_uid,
            isouter = True 
        )
        .join(
            T_DOCTOR_SCHEDULE,
            T_DOCTOR_SCHEDULE.uid == T_DOCTOR.uid,
            isouter = True 
        )
        .filter(*filters)
        .order_by(T_DOCTOR.sort.desc())
    )
    format_sql(sql)

    res = sql.first()
    if res is not None:
        res = dict(zip(res.keys(), res))
    
    # sql2 = (
    #     db.query(
    #          T_DOCTOR_INFO.uid
    #         ,T_DOCTOR_INFO.subject
    #         ,T_DOCTOR_INFO.sort
    #         ,func.REPLACE('<div>'+T_DOCTOR_INFO.contents, '\n', '</div><div>').label('contents')
            
    #     )
    #     .filter(
    #         T_DOCTOR_INFO.doctor_uid == uid
    #     )
    #     .order_by(T_DOCTOR_INFO.sort.asc())
    # ).all()
    
    jsondata = {}
    jsondata.update(res)
    # jsondata.update({"info_list" : sql2})

    return jsondata

# 관리자 의료진 - 등록
def medical_doctor_create(request: Request, doctorDetail: DoctorDetail):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    db_item = T_DOCTOR (
         cate_uid = doctorDetail.cate_uid
        ,name = doctorDetail.name
        ,position = doctorDetail.position
        ,thumb = doctorDetail.thumb
        ,profile = doctorDetail.profile
        ,field_keyword = doctorDetail.field_keyword
        ,field_spec = doctorDetail.field_spec
        ,career = doctorDetail.career
    )
    db.add(db_item)
    db.flush()

    create_log(request, db_item.uid, "T_DOCTOR", "INSERT", "의료진 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 관리자 의료진 - 수정
def medical_doctor_update(request: Request, doctorDetail: DoctorDetail):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    # 기존 등록된 item select 
    res = db.query(T_DOCTOR).filter(T_DOCTOR.uid == doctorDetail.uid).first()

    if res is None :
        raise ex.NotFoundUser

    if doctorDetail.cate_uid is not None and res.cate_uid != doctorDetail.cate_uid : 
        create_log(request, res.uid, "T_DOCTOR", "cate_uid", "카테고리 uid", res.cate_uid, doctorDetail.cate_uid, user.user_id)

        request.state.inspect = frame()
        res.cate_uid = doctorDetail.cate_uid

    if doctorDetail.name is not None and res.name != doctorDetail.name : 
        create_log(request, res.uid, "T_DOCTOR", "name", "의료진명", res.name, doctorDetail.name, user.user_id)
        request.state.inspect = frame()
        res.name = doctorDetail.name

    if doctorDetail.position is not None and res.position != doctorDetail.position : 
        create_log(request, res.uid, "T_DOCTOR", "position", "직책", res.position, doctorDetail.position, user.user_id)
        request.state.inspect = frame()
        res.position = doctorDetail.position

    if doctorDetail.thumb is not None and res.thumb != doctorDetail.thumb : 
        create_log(request, res.uid, "T_DOCTOR", "thumb", "사진", res.thumb, doctorDetail.thumb, user.user_id)
        request.state.inspect = frame()
        res.thumb = doctorDetail.thumb

    if doctorDetail.profile is not None and res.profile != doctorDetail.profile : 
        create_log(request, res.uid, "T_DOCTOR", "profile", "프로필 이미지", res.profile, doctorDetail.profile, user.user_id)
        request.state.inspect = frame()
        res.profile = doctorDetail.profile

    if doctorDetail.field_keyword is not None and res.field_keyword != doctorDetail.field_keyword : 
        create_log(request, res.uid, "T_DOCTOR", "field_keyword", "전문분야 키워드", res.field_keyword, doctorDetail.field_keyword, user.user_id)
        request.state.inspect = frame()
        res.field_keyword = doctorDetail.field_keyword

    if doctorDetail.field_spec is not None and res.field_spec != doctorDetail.field_spec : 
        create_log(request, res.uid, "T_DOCTOR", "field_spec", "전문분야 전체", res.field_spec, doctorDetail.field_spec, user.user_id)
        request.state.inspect = frame()
        res.field_spec = doctorDetail.field_spec

    if doctorDetail.career is not None and res.career != doctorDetail.career : 
        create_log(request, res.uid, "T_DOCTOR", "career", "경력", res.career, doctorDetail.career, user.user_id)
        request.state.inspect = frame()
        res.career = doctorDetail.career
        
    return res

# 관리자 의료진 상세 - 삭제
def medical_doctor_delete(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user
    
    db_item = db.query(T_DOCTOR).filter(T_DOCTOR.uid == uid).first()

    db_item.delete_at = util.getNow()

    create_log(request, uid, "T_DOCTOR", "DELETE", "의료진 삭제", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 관리자 의료진 - 순서정렬
def medical_doctor_sort(request: Request, doctorDetail: DoctorDetail):
    request.state.inspect = frame()
    db = request.state.db

    res = (
        db.query(
            T_DOCTOR
        )
        .filter(T_DOCTOR.delete_at == None)
        .all()
    )
    
    for c in res :
        for i in doctorDetail.sort_array :
            if c.uid == i :
                c.sort = doctorDetail.sort_array.index(i)+1
    
    return




# ------------[ S ] 의료진 스케줄 -------------

# 관리자 의료진 스케줄 - 등록
def doctor_schedule_create(request: Request, doctorDetail: DoctorDetail):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    db_item = T_DOCTOR_SCHEDULE (
         uid = doctorDetail.uid
        ,am_week_1 = doctorDetail.am_week_1
        ,am_week_2 = doctorDetail.am_week_2
        ,am_week_3 = doctorDetail.am_week_3
        ,am_week_4 = doctorDetail.am_week_4
        ,am_week_5 = doctorDetail.am_week_5
        ,pm_week_1 = doctorDetail.pm_week_1
        ,pm_week_2 = doctorDetail.pm_week_2
        ,pm_week_3 = doctorDetail.pm_week_3
        ,pm_week_4 = doctorDetail.pm_week_4
        ,pm_week_5 = doctorDetail.pm_week_5
    )
    db.add(db_item)
    db.flush()

    create_log(request, db_item.uid, "T_DOCTOR_SCHEDULE", "INSERT", "의료진 시간표 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return db_item

# 관리자 의료진 스케줄 - 수정
def doctor_schedule_update(request: Request, doctorDetail: DoctorDetail):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    # 기존 등록된 item select 
    res2 = db.query(T_DOCTOR_SCHEDULE).filter(T_DOCTOR_SCHEDULE.uid == doctorDetail.uid).first()

    if doctorDetail.doctor_schedule_reset : # 리셋
        if res2 is not None : # 데이터가 있으면
            return db.query(T_DOCTOR_SCHEDULE).filter(T_DOCTOR_SCHEDULE.uid == doctorDetail.uid).delete()
    
    else : # 신규등록 또는 수정
        if res2 is None : # 데이터가 없으면
            doctor_schedule_create(request, doctorDetail) # INSERT

        else : 
            if doctorDetail.am_week_1 is not None and res2.am_week_1 != doctorDetail.am_week_1 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "am_week_1", "월요일 오전 시간표 변경", res2.am_week_1, doctorDetail.am_week_1, user.user_id)
                request.state.inspect = frame()
                res2.am_week_1 = doctorDetail.am_week_1

            if doctorDetail.am_week_2 is not None and res2.am_week_2 != doctorDetail.am_week_2 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "am_week_2", "화요일 오전 시간표 변경", res2.am_week_2, doctorDetail.am_week_2, user.user_id)
                request.state.inspect = frame()
                res2.am_week_2 = doctorDetail.am_week_2

            if doctorDetail.am_week_3 is not None and res2.am_week_3 != doctorDetail.am_week_3 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "am_week_3", "수요일 오전 시간표 변경", res2.am_week_3, doctorDetail.am_week_3, user.user_id)
                request.state.inspect = frame()
                res2.am_week_3 = doctorDetail.am_week_3

            if doctorDetail.am_week_4 is not None and res2.am_week_4 != doctorDetail.am_week_4 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "am_week_4", "목요일 오전 시간표 변경", res2.am_week_4, doctorDetail.am_week_4, user.user_id)
                request.state.inspect = frame()
                res2.am_week_4 = doctorDetail.am_week_4

            if doctorDetail.am_week_5 is not None and res2.am_week_5 != doctorDetail.am_week_5 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "am_week_5", "금요일 오전 시간표 변경", res2.am_week_5, doctorDetail.am_week_5, user.user_id)
                request.state.inspect = frame()
                res2.am_week_5 = doctorDetail.am_week_5

            if doctorDetail.pm_week_1 is not None and res2.pm_week_1 != doctorDetail.pm_week_1 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "pm_week_1", "월요일 오후 시간표 변경", res2.pm_week_1, doctorDetail.pm_week_1, user.user_id)
                request.state.inspect = frame()
                res2.pm_week_1 = doctorDetail.pm_week_1

            if doctorDetail.pm_week_2 is not None and res2.pm_week_2 != doctorDetail.pm_week_2 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "pm_week_2", "화요일 오후 시간표 변경", res2.pm_week_2, doctorDetail.pm_week_2, user.user_id)
                request.state.inspect = frame()
                res2.pm_week_2 = doctorDetail.pm_week_2

            if doctorDetail.pm_week_3 is not None and res2.pm_week_3 != doctorDetail.pm_week_3 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "pm_week_3", "수요일 오후 시간표 변경", res2.pm_week_3, doctorDetail.pm_week_3, user.user_id)
                request.state.inspect = frame()
                res2.pm_week_3 = doctorDetail.pm_week_3

            if doctorDetail.pm_week_4 is not None and res2.pm_week_4 != doctorDetail.pm_week_4 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "pm_week_4", "목요일 오후 시간표 변경", res2.pm_week_4, doctorDetail.pm_week_4, user.user_id)
                request.state.inspect = frame()
                res2.pm_week_4 = doctorDetail.pm_week_4

            if doctorDetail.pm_week_5 is not None and res2.pm_week_5 != doctorDetail.pm_week_5 : 
                create_log(request, res2.uid, "T_DOCTOR_SCHEDULE", "pm_week_5", "금요일 오후 시간표 변경", res2.pm_week_5, doctorDetail.pm_week_5, user.user_id)
                request.state.inspect = frame()
                res2.pm_week_5 = doctorDetail.pm_week_5

            return res2
        
    return True

# 관리자 의료진 스케줄 - 삭제
# def doctor_schedule_delete(request: Request, uid: int):
#     request.state.inspect = frame()
#     db = request.state.db
#     user = request.state.user
    
#     db_item = db.query(T_DOCTOR_SCHEDULE).filter(T_DOCTOR_SCHEDULE.uid == uid).first()

#     db_item.delete_at = util.getNow()

#     create_log(request, uid, "T_DOCTOR_SCHEDULE", "DELETE", "의료진 시간표 삭제", 0, db_item.uid, user.user_id)
#     request.state.inspect = frame()

#     return db_item


# ------------[ E ] 의료진 스케줄 -------------






# ------------[ S ] 의료진 상세 -------------

# 관리자 의료진 상세 - 리스트
def doctor_info_list(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    sql = (
        db.query(
             T_DOCTOR_INFO.uid
            ,T_DOCTOR_INFO.subject
            ,T_DOCTOR_INFO.sort
            ,T_DOCTOR_INFO.contents
        )
        .filter(
            T_DOCTOR_INFO.doctor_uid == uid,
            T_DOCTOR_INFO.delete_at == None
        )
        .order_by(T_DOCTOR_INFO.sort.asc())
    )
    
    infos = []
    for c in sql.all():
        infos.append(dict(zip(c.keys(), c)))

    return infos

# 관리자 의료진 상세 - 등록
def doctor_info_create(request: Request, doctorInfo: DoctorInfo):
    request.state.inspect = frame()
    db = request.state.db 
    user = request.state.user

    db_item = T_DOCTOR_INFO (
         doctor_uid = doctorInfo.doctor_uid
        ,subject = doctorInfo.subject
        ,contents = doctorInfo.contents
    )
    db.add(db_item)
    db.flush()

    create_log(request, db_item.uid, "T_DOCTOR_INFO", "INSERT", "의료진 상세 등록", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()
    
    return jsonable_encoder(db_item)

# 관리자 의료진 상세 - 삭제
def doctor_info_delete(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db
    user = request.state.user
    
    db_item = db.query(T_DOCTOR_INFO).filter(T_DOCTOR_INFO.uid == uid).first()

    db_item.delete_at = util.getNow()

    create_log(request, uid, "T_DOCTOR_INFO", "DELETE", "의료진 상세 내용 삭제", 0, db_item.uid, user.user_id)
    request.state.inspect = frame()

    return jsonable_encoder(db_item)
    # return db_item

# 관리자 의료진 상세 - 순서정렬
def doctor_info_sort(request: Request, doctorInfo: DoctorInfo):
    request.state.inspect = frame()
    db = request.state.db

    res = (
        db.query(
            T_DOCTOR_INFO
        )
        .filter(
            T_DOCTOR_INFO.doctor_uid == doctorInfo.doctor_uid,
            T_DOCTOR_INFO.delete_at == None
        )
        .all()
    )
    
    for c in res :
        for i in doctorInfo.sort_array :
            if c.uid == i :
                c.sort = doctorInfo.sort_array.index(i)+1
    
    return



# ------------[ E ] 의료진 상세 -------------
