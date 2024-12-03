from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case
from fastapi import Request
from inspect import currentframe as frame

from app.core import util
from app.core.database import format_sql
from app.models.doctor import *
from app.models.display import *
from app.schemas.display import *

def test(request: Request) :
    request.state.inspect = frame()
    db = request.state.db

    # mysql json type where절 검색 (in절)
    # sql = db.query(T_DOCTOR).filter(func.json_contains(T_DOCTOR.cate_uid, f'[4,2]'))
    # format_sql(sql)

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
        ) as a
    FROM T_ADMIN
    WHERE delete_at is NULL
    ORDER BY uid DESC
    LIMIT 0, 30
    """
    result = db.execute(text(sql)).fetchall()

    print(result)
        


# 의료진_리스트
def doctor_list(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    # filters.append(getattr(T_DOCTOR, "delete_at") == None)
    filters.append(getattr(T_CATEGORY, "table_name") == 'T_DOCTOR')

    if uid > 0 :
        filters.append(getattr(T_CATEGORY, "uid") == uid)
    # if len(cateInput.cate_uid) > 0 :
    #     filters.append(getattr(T_CATEGORY, "uid").in_(cateInput.cate_uid))


    # filter2 = []
    # if uid > 0 :
    #     filter2.append(getattr(T_DOCTOR, "cate_uid").in_([uid]))


    # [ S ] category_list
    sql = ( 
        db.query(
            T_CATEGORY.uid,
            T_CATEGORY.cate_name,
            T_CATEGORY.cate_icon,
            T_CATEGORY.is_reserve
        )
        .filter(*filters)
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
            ,func.date_format(T_DOCTOR.create_at, '%Y-%m-%d %T').label('create_at')
            ,func.date_format(T_DOCTOR.update_at, '%Y-%m-%d %T').label('update_at')
        )
        .filter(T_DOCTOR.delete_at == None)
        .order_by(T_DOCTOR.sort.asc())
    )


    doctor_list = []
    for c in sql2.all():
        col = dict(zip(c.keys(), c))
        col["field_keyword"] = col["field_keyword"].replace("<br>", "")
        doctor_list.append(col)
    
    jsondata.update({"doctor_list": doctor_list})

    # for c in sql2.all():
    #     if "list_"+str(c.cate_uid) not in jsondata :
    #         jsondata.update({"list_"+str(c.cate_uid) : []})
    #     jsondata["list_"+str(c.cate_uid)].append(dict(zip(c.keys(), c)))
    # [ E ] doctor_list

    return jsondata

# 의료진_상세
def doctor_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db

    filters = []
    filters.append(getattr(T_DOCTOR, "delete_at") == None)
    filters.append(getattr(T_DOCTOR, "uid") == uid)
    
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
            ,func.REPLACE('<div class="must_w">'+T_DOCTOR.career, '\n', '</div><div class="must_w">').label('career')
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


    # [ S ] 의료진 카테고리 (2개이상일수 있기때문에)
    sql_cate = (
        db.query(
             T_CATEGORY.cate_name
        )
        .filter(T_CATEGORY.uid.in_(res['cate_uid']))
        .order_by(T_CATEGORY.cate_sort.asc())
    )
    cate_names = ""
    for c in sql_cate.all():
        cate_names = cate_names + '[' + c.cate_name + '] '
    res['cate_name'] = cate_names
    # [ E ] 의료진 카테고리 (2개이상일수 있기때문에)

    
    sql2 = (
        db.query(
             T_DOCTOR_INFO.uid
            ,T_DOCTOR_INFO.subject
            # ,T_DOCTOR_INFO.contents
            ,func.REPLACE('<div>'+T_DOCTOR_INFO.contents, '\n', '</div><div>').label('contents')
            
        )
        .filter(
            T_DOCTOR_INFO.doctor_uid == uid
        )
        .order_by(T_DOCTOR_INFO.sort.asc())
    ).all()
    
    jsondata = {}
    jsondata.update(res)
    jsondata.update({"info_list" : sql2})

    return jsondata

# 의료진_스케줄_상세
def doctor_schedule_read(request: Request, uid: int):
    request.state.inspect = frame()
    db = request.state.db

    sql = ( 
        db.query(
             T_DOCTOR_SCHEDULE.uid
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
        .filter(T_DOCTOR_SCHEDULE.uid == uid)
    )
    format_sql(sql)

    
    res = sql.first()
    if res is not None:
        res = dict(zip(res.keys(), res))

    return res

def doctor_schedule_list(request: Request):
    request.state.inspect = frame()
    db = request.state.db

    
    filters = []
    # filters.append(getattr(T_DOCTOR, "delete_at") == None)
    filters.append(getattr(T_CATEGORY, "table_name") == 'T_DOCTOR')

    # [ S ] category_list
    sql = ( 
        db.query(
            T_CATEGORY.uid,
            T_CATEGORY.cate_name,
            T_CATEGORY.cate_icon,
            T_CATEGORY.is_reserve
        )
        .filter(*filters)
        .order_by(T_CATEGORY.cate_sort.asc())
    )
    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))
    
    jsondata = {}
    jsondata.update({"category_list": rows})
    # [ E ] category_list


    # [ S ] doctor_list
    sql = ( 
        db.query(
             T_DOCTOR.uid
            ,T_DOCTOR.cate_uid
            ,T_DOCTOR.name
            ,T_DOCTOR.position
            ,T_DOCTOR.profile
            ,T_DOCTOR_SCHEDULE.uid
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
            T_DOCTOR,
            T_DOCTOR.uid == T_DOCTOR_SCHEDULE.uid,
        )
        .filter(T_DOCTOR.delete_at == None)
        .order_by(T_DOCTOR.sort.asc())
    )

    doctor_list = []
    for c in sql.all():
        doctor_list.append(dict(zip(c.keys(), c)))
    
    jsondata.update({"doctor_list": doctor_list})

    # [ E ] doctor_list

    
    # jsondata = {}
    # jsondata.update({"category_list": rows})
    return jsondata