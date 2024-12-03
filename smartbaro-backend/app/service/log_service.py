from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, select, column, table, case
from fastapi import Request
from inspect import currentframe as frame

from app.core import util
from app.core.database import format_sql
from app.models.log import *

# update 로그 쌓기
def create_log( 
     request: Request
    ,table_uid: int
    ,table_name: str
    ,column_key: str
    ,column_name: str
    ,cl_before: str
    ,cl_after: str
    ,create_user: str
):  
    request.state.inspect = frame()
    db = request.state.db 
    db_item = T_CHANGE_LOG (
         table_uid = table_uid
        ,table_name = table_name      
        ,column_key = column_key      
        ,column_name = column_name   
        ,cl_before = str(cl_before)
        ,cl_after = str(cl_after)
        ,create_user = create_user
    )
    db.add(db_item)
    db.flush()
    return db_item


# 비밀번호 틀린 기록
def create_fail_password( 
     request: Request
    ,table_name: str
    ,table_uid: int
    ,input_value: str
):  
    request.state.inspect = frame()
    db = request.state.db 
    db_item = T_FAIL_PASSWORD (
         table_name = table_name
        ,table_uid = table_uid
        ,input_value = input_value
        ,user_ip = request.state.user_ip
    )
    db.add(db_item)
    db.flush()

    return (
        db.query(T_FAIL_PASSWORD)
        .filter(
            T_FAIL_PASSWORD.table_name == table_name
            ,T_FAIL_PASSWORD.table_uid == table_uid
            ,T_FAIL_PASSWORD.user_ip == request.state.user_ip
        ).count()
    )

# 비밀번호 5회 틀려서 블록되었는지 검사
def check_block_fail_password (
     request: Request
    ,table_name: str
    ,table_uid: int
) :
    request.state.inspect = frame()
    db = request.state.db
    
    sql = """
        select 
             count(table_uid) as fail_count
            ,max(create_at) as last_fail_at
            ,TIMESTAMPDIFF(MINUTE, now(), DATE_ADD(max(create_at), INTERVAL 10 MINUTE)) as ten_min
        From T_FAIL_PASSWORD
        where table_name = '{table_name}'
        and table_uid = {table_uid}
        and user_ip = '{user_ip}'
        group by table_name, table_uid
    """.format(table_name=table_name, table_uid=table_uid, user_ip=request.state.user_ip)
    
    return db.execute(text(sql)).first()
    
# 비밀번호 성공 또는 10분 지나서 초기화 할때
def reset_block_fail_password (
     request: Request
    ,table_name: str
    ,table_uid: int
) :
    request.state.inspect = frame()
    db = request.state.db
    
    db.query(T_FAIL_PASSWORD).filter(
        T_FAIL_PASSWORD.table_name == table_name
        ,T_FAIL_PASSWORD.table_uid == table_uid
        ,T_FAIL_PASSWORD.user_ip == request.state.user_ip
    ).delete()

# 비밀번호 틀린 기록 로그 쌓기
def fail_password_history( 
     request: Request
    ,table_name: str
    ,table_uid: int
    ,input_value: str
):  
    request.state.inspect = frame()
    db = request.state.db 
    db_item = T_FAIL_PASSWORD_HISTORY (
         table_name = table_name
        ,table_uid = table_uid
        ,input_value = input_value
        ,user_ip = request.state.user_ip
    )
    db.add(db_item)
    db.flush()

    return (
        db.query(T_FAIL_PASSWORD_HISTORY)
        .filter(
            T_FAIL_PASSWORD_HISTORY.table_name == table_name
            ,T_FAIL_PASSWORD_HISTORY.table_uid == table_uid
            ,T_FAIL_PASSWORD_HISTORY.user_ip == request.state.user_ip
        ).count()
    )