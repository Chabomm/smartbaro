from fastapi import Request
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from typing import Optional
from inspect import currentframe as frame
from sqlalchemy.dialects import mysql as mysql_dialetct
from pymysql.converters import conversions, escape_item, encoders
from sqlalchemy import func, select, update, delete, Table, MetaData
import math
from app.schemas.schema import *
from app.deps.auth import get_password_hash

from app.core import util
from app.core.database import format_sql
from app.deps import auth
from app.models.session import *
from app.models.admin import *
from app.models.menu import *
from app.schemas.admin.auth import *
from app.service.log_service import *
from app.service.session_service import *
from app.core import exceptions as ex

# 어드민 id & pw로 로그인
def signin_admin(request: Request, signin_request :SignInRequest):
    request.state.inspect = frame()
    db = request.state.db 

    sql = db.query(T_ADMIN).filter(T_ADMIN.user_id == signin_request.user_id, T_ADMIN.delete_at == None)
    user = sql.first()

    if not user:
        return None
    
    cbfp = check_block_fail_password(request, "T_ADMIN", user.uid)
    request.state.inspect = frame()
    if cbfp is not None and cbfp.fail_count >= 5 :
        if cbfp.ten_min >= 0 : # 10분 아직 안지남
            return ex.ReturnOK(300, "비밀번호를 5회연속 틀렸습니다.\n10분간 사용이 제한됩니다.", request)
        else : # 10분 지남
            reset_block_fail_password(request, "T_ADMIN", user.uid)
            request.state.inspect = frame()
    
    if not auth.verify_password(signin_request.user_pw, user.user_pw):
        fail_count = create_fail_password(request, "T_ADMIN", user.uid, signin_request.user_pw)
        request.state.inspect = frame()
        
        session_param = T_SESSION_HISTORY(
             site_id = "SMARTBARO-ADMIN"
            ,user_uid = user.uid
            ,user_id = user.user_id
            ,ip = request.state.user_ip
            ,profile = os.environ.get('PROFILE')
        )

        fail_session_history(request, session_param)
        request.state.inspect = frame()

        # log insert를 해야되서 200 code 리턴.
        return ex.ReturnOK(200, "비밀번호가 일치하지 않습니다. ("+str(fail_count)+"/5)\n5회 연속 다른 경우, 서비스 사용이 제한됩니다.", request)
    else :
        reset_block_fail_password(request, "T_ADMIN", user.uid)
        request.state.inspect = frame()
    
    return user

# 어디민 정보 by user_id
def read_by_userid(request: Request, user_id:str):
    request.state.inspect = frame()
    db = request.state.db 
    sql = db.query(T_ADMIN).filter(T_ADMIN.user_id == user_id)
    return sql.first()


def get_temp_admin(request: Request, reset_pw: ResetPw):
    request.state.inspect = frame()
    db = request.state.db 

    if reset_pw.user_id != "" :
        sql = db.query(T_ADMIN).filter(T_ADMIN.user_id == reset_pw.user_id)
        return sql.first()
    
    else :
        sql = db.query(T_ADMIN).filter(T_ADMIN.user_pw == None)
        return sql.all()