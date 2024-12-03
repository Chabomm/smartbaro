
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import date, datetime, time, timedelta

from app.schemas.schema import *

class Admin(AppModel):
    uid : Optional[int] = Field(0)
    user_id : Optional[str] = Field("")
    user_name : Optional[str] = Field("")
    user_pw : Optional[str] = Field(None)
    tel : Optional[str] = Field("")
    mobile : Optional[str] = Field("")
    email : Optional[str] = Field("")
    depart : Optional[str] = Field("")
    position1 : Optional[str] = Field("")
    position2 : Optional[str] = Field("")
    role : Optional[str] = Field("")
    roles : Optional[List[int]] = Field([], title="권한")
    state : Optional[str] = Field("200")
    create_at : Optional[datetime] = Field(None, title="등록일")
    update_at : Optional[datetime] = Field(None, title="수정일")
    delete_at : Optional[datetime] = Field(None, title="삭제일")
    last_at : Optional[datetime] = Field(None, title="마지막 접속일")
    mode: Optional[str] = Field(None, title="REG/MOD/DEL")

class AdminMenuInput(AppModel):
    uid: Optional[int] = Field(0, title="T_ADMIN_MENU의 고유번호")
    name: Optional[str] = Field(None, title="메뉴명")
    icon: Optional[str] = Field(None, title="아이콘")
    to: Optional[str] = Field(None, title="링크")
    depth: Optional[int] = Field(None, title="단계")
    parent: Optional[int] = Field(None, title="부모 uid")
    sort_array: Optional[List[int]] = Field([], title="변경할 메뉴 순서")
    mode: Optional[str] = Field(None, title="REG/MOD/DEL")

class AdminMenuListInput(AppModel):
    parent: Optional[int] = Field(0, title="부모 uid")

class AdminMenu(AppModel):
    uid: Optional[int] = Field(0, title="T_ADMIN_MENU의 고유번호")
    name: Optional[str] = Field("", title="메뉴명")
    icon: Optional[str] = Field("", title="아이콘")
    to: Optional[str] = Field("", title="링크")
    sort: Optional[int] = Field("", title="순서")
    depth: Optional[int] = Field(1, title="단계")
    parent: Optional[int] = Field(0, title="부모uid")
    class Config:
        orm_mode = True

class AdminRoles(AppModel):
    uid: Optional[int] = Field(0, title="T_ADMIN_MENU의 고유번호")
    name: Optional[str] = Field("", title="역할명")
    menus: Optional[List[int]] = Field([], title="배정된메뉴 uids")
    class Config:
        orm_mode = True

class AdminRolesInput(AppModel):
    uid: Optional[int] = Field(0, title="T_ADMIN_ROLES의 고유번호")
    name: Optional[str] = Field(None, title="메뉴명")
    menus: Optional[List[int]] = Field([], title="배정된메뉴 uids")
    mode: Optional[str] = Field(None, title="REG/MOD/DEL")

class MyInfoInput(AppModel):
    user_pw: Optional[str] = Field(None, title="기존 비밀번호")
    user_pw2: Optional[str] = Field(None, title="새 비밀번호")
    tel: Optional[str] = Field(None, title="내선번호")
    mobile: Optional[str] = Field(None, title="핸드폰번호")
    user_name: Optional[str] = Field(None, title="이름")
    email: Optional[str] = Field(None, title="이메일")
    depart: Optional[str] = Field(None, title="부서")
