import os
import json
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body, Header
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from inspect import currentframe as frame
from fastapi.responses import RedirectResponse, JSONResponse

from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX
from app.deps.auth import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_MINUTES
from app.deps.auth import create_access_token
from app.service.admin import auth_service
from app.schemas.admin.auth import *

router = APIRouter (
    prefix = PROXY_PREFIX, 
    tags=["/auth"],
)

# /be/auth/token
@router.post("/auth/token")
def login_for_access_token_user (
     request: Request
    ,form_data: OAuth2PasswordRequestForm = Depends()
):
    request.state.inspect = frame()

    """ 
    # docs에서 authorizations로 토큰 발급하는 경우
    # oauth2_scheme 스키마로 로그인 return access_token
    """ 
    # print( util.toJson(form_data.__dict__) )

    # {
    #     "grant_type": "password",
    #     "username": "dev@indend.co.kr",
    #     "password": "sssssss",
    #     "scopes": [],
    #     "client_id": null,
    #     "client_secret": null
    # }

    user = auth_service.read_by_userid(request, form_data.username)
    
    request.state.inspect = frame()

    if user is None :
        raise ex.NotFoundUser

    token_data = TokenDataAdmin (
        token_name = "SMARTBARO-ADMIN"
        ,user_uid = user.uid
        ,user_id = user.user_id
        ,user_name = user.user_name
        ,user_depart = user.depart
        ,role = user.role
        ,roles = user.roles
    )


    # 관리자 꺼는 만료일 : REFRESH_TOKEN_EXPIRE_MINUTES
    access_token = create_access_token (data=util.toJson(token_data), expires_delta=timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES))
    return {"access_token": access_token, "token_type": "bearer"}
        
