from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case
from fastapi import Request
from inspect import currentframe as frame
from fastapi.encoders import jsonable_encoder

from app.core import util
from app.core.database import format_sql
from app.models.display import *
from app.schemas.display import *

# 배너 카테고리 select
def readlist_cate(request: Request, mainBannerInput: MainBannerListInput): 
    request.state.inspect = frame()
    db = request.state.db

    subquery = (
        db.query (
            T_MAIN_BANNER.cate_uid
        )
        .filter(
            T_MAIN_BANNER.area == mainBannerInput.area
        )
        .subquery()
    )

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
        .filter(T_CATEGORY.uid.in_(subquery))
        .order_by(T_CATEGORY.cate_sort.asc())
    )

    format_sql(sql)

    rows = []
    for c in sql.all():
        rows.append(dict(zip(c.keys(), c)))

    if mainBannerInput.cate_uid > 0 :
        for obj in rows:
            if obj["uid"] == mainBannerInput.cate_uid :
                obj["active"] = "active"
            else :
                obj["active"] = ""
    else :
        rows[0]["active"] = "active" 

    jsondata = {}
    jsondata.update({"list": rows})

    return jsondata

# 배너 리스트 select
def readlist(request: Request, mainBannerInput: MainBannerListInput):
    request.state.inspect = frame()
    db = request.state.db
    
    filters = []
    filters.append(getattr(T_MAIN_BANNER, "delete_at") == None)
    filters.append(getattr(T_MAIN_BANNER, "is_display") == "T")

    # 카테고리가 없으면
    if mainBannerInput.cate_uid == 0 :
        filters.append(getattr(T_MAIN_BANNER, "area") == mainBannerInput.area)
    # 카테고리가 있으면
    else :
        filters.append(getattr(T_CATEGORY, "uid") == mainBannerInput.cate_uid)
        filters.append(getattr(T_MAIN_BANNER, "area") == mainBannerInput.area)
    
    sql = (
        db.query(
             T_CATEGORY.uid
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
            ,func.date_format(T_MAIN_BANNER.create_at, '%Y.%m.%d').label('create_at')
            ,func.date_format(T_MAIN_BANNER.update_at, '%Y.%m.%d').label('update_at')
            ,func.date_format(T_MAIN_BANNER.delete_at, '%Y-%m-%d %T').label('delete_at')
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
        .filter(*filters)
        .order_by(T_MAIN_BANNER.sort)
    )

    format_sql(sql)

    rows = []
    for c in sql.all():

        col = dict(zip(c.keys(), c))

        if mainBannerInput.area == "INQUIRY_DREAM" :
            col["banner_name"] = util.fn_masking_user_name(col["banner_name"] if "banner_name" in col else "")

        rows.append(col)

    jsondata = {}
    jsondata.update({"list": rows})

    return jsondata
