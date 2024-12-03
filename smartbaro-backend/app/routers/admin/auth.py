import os
import json
import requests
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from inspect import currentframe as frame
from fastapi.responses import RedirectResponse, JSONResponse
import string
import random
from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin
from app.core.database import get_session
from app.deps.auth import create_access_token, get_current_active_admin
from app.deps.auth import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_MINUTES
from app.deps.auth import get_password_hash
from fastapi.encoders import jsonable_encoder

from app.schemas.schema import *
from app.service import session_service
from app.service.admin import auth_service
from app.service.admin import menu_service
from app.models.session import *
from app.schemas.admin.auth import *

router = APIRouter (
    prefix = PROXY_PREFIX, 
    tags=["/admin/auth"],
)

# /be/admin/signin
@router.post("/admin/signin")
def 관리자_로그인(
    request: Request,
    response: Response,
    signin_request: SignInRequest = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "bcha@indend.co.kr",
                "description": "",
                "value": {
                    "user_id" : "bcha@indend.co.kr",
                    "user_pw" : "1234"
                }
            },
        }
    )
):
    request.state.inspect = frame()

    user = auth_service.signin_admin(request, signin_request)
    request.state.inspect = frame()

    if user is None :
        return ex.ReturnOK(404, "정보를 찾을 수 없습니다. 아이디와 비밀번호를 다시 확인해 주세요", request)
    # if 'app.models' in str(type(obj)) :
    elif 'dict' in str(type(user)) :
        return user

    is_temp = False
    try :
        # print(signin_request.user_pw, user.user_id + user.mobile[9:13])
        if signin_request.user_pw == user.user_id + user.mobile[9:13] :
            is_temp = True
    except Exception as e:
        print(str(e))
    
    token_data = TokenDataAdmin (
        token_name = "SMARTBARO-ADMIN"
        ,user_uid = user.uid
        ,user_id = user.user_id
        ,user_name = user.user_name
        ,user_depart = user.depart
        ,role = user.role
        ,roles = user.roles
        ,is_temp = is_temp
    )

    access_token = create_access_token(data=util.toJson(token_data), expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    refresh_token = create_access_token(data=util.toJson(token_data), expires_delta=timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES))

    session_param = T_SESSION (
         site_id = "SMARTBARO-ADMIN"
        ,user_uid = token_data.user_uid
        ,user_id = token_data.user_id
        ,access_token = access_token
        ,refresh_token = refresh_token
        ,ip = request.state.user_ip
        ,profile = os.environ.get('PROFILE')
    )

    token_data.access_token = access_token
    request.state.user = token_data

    session_service.create_session(request, session_param)
    request.state.inspect = frame()

    # 관리자 메뉴 가져오기
    res = menu_service.get_admin_menus(request)
    request.state.inspect = frame()

    response = JSONResponse(
        ex.ReturnOK(200, "", request, {
            "access_token": access_token
            ,"token_type": "bearer"
            ,"admin_menus": res["admin_menus"]
        }, False)
    )

    response.set_cookie( key=token_data.token_name, value=access_token )

    return response

# 로그아웃
@router.post(path="/admin/logout")
async def logout (
     request: Request
    ,response: Response
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)
    
    session_service.delete_session(request, user.user_uid) # 세션 제거
    response.delete_cookie(request.state.user.token_name) # 쿠키 제거

    response = JSONResponse(
        ex.ReturnOK(200, "", request, {})
    )

    return response

# /be/admin/member/resetpw
@router.post("/admin/member/resetpw")
async def 임시패스워드_세팅 (
     request: Request
    ,reset_pw: ResetPw
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    """ 
    # user_id 를 보내면 해당 아이디를 가진 유저의 비밀번호를 초기화
    # user_id 를 공백으로 보내면 user_pw가 null인 유저 리스트를 전부 초기화
    """ 

    if reset_pw.user_id != "" :
        # 해당 아이디를 가진 어드민 정보 가져오기
        temp_admin = auth_service.get_temp_admin(request, reset_pw) 
        if temp_admin == None :
            return ex.ReturnOK(400, "회원정보가 존재하지 않습니다.", request)
        temp_admin.user_pw = get_password_hash(temp_admin.user_id+temp_admin.mobile[9:13])

        rows = []
        rows.append({
            "user_id": temp_admin.user_id
            ,"user_pw": temp_admin.user_id+temp_admin.mobile[9:13]
        })

        return ex.ReturnOK(200, "", request, {"result_list":rows})
    else :
        # 비밀번호가 없는 임시회원 리스트 가져오기
        temp_admins = auth_service.get_temp_admin(request, reset_pw) 

        if len(temp_admins) == 0 :
            return ex.ReturnOK(401, "패스워드가 null인 회원이 없습니다.", request)

        for c in temp_admins:
            c.user_pw = get_password_hash(c.user_id+c.mobile[9:13])

        rows = []
        for c in temp_admins:
            obj = jsonable_encoder(c)
            rows.append({
                "user_id": obj["user_id"]
                ,"user_pw": obj["user_id"]+obj["mobile"][9:13]
            })

        return ex.ReturnOK(200, "", request, {"result_list":rows})
