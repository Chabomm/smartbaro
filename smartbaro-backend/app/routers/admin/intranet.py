import os
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from fastapi.responses import FileResponse
from inspect import currentframe as frame

from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin
from app.models.board import *
from app.schemas.admin.board import *
from app.schemas.admin.auth import *

from app.service.admin import posts_service
from app.deps.auth import get_current_active_admin

router = APIRouter(
    prefix=PROXY_PREFIX,
    tags=["/admin/intranet"],
)

# /be/admin/intranet/posts/init
@router.post("/admin/intranet/posts/init", dependencies=[Depends(api_same_origin)])
async def 관리자_인트라넷_게시물_inti (
     request : Request
    ,pRead: PRead
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):  
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)
    
    result = {}

    # [ S ] 게시판 정보
    board = posts_service.board_read(request, pRead.uid) 
    request.state.inspect = frame()

    board = dict(zip(board.keys(), board))

    board["poss_insert"] = False
    if user.role == "admin" :
        board["poss_insert"] = True 
    else :
        for p in board["permission_write"] :
            if p in user.roles :
                board["poss_insert"] = True 
    # posts wirte permission check

    result.update({"board": board})
    
    # [ S ] 초기 파라메터
    params = {
         "page" : 1
        ,"page_view_size": 30
        ,"page_size": 0
        ,"page_total": 0
        ,"page_last": 0
        ,"filters": {
            "board_uid" : pRead.uid
        }
    }
    result.update({"params": params})
    # [ S ] 초기 파라메터

    filter = {}
    filter.update({"skeyword_type": [
        {"key": 'title', "value": '제목'},
        {"key": 'contents', "value": '본문내용'},
        {"key": 'create_name', "value": '작성자'}
    ]})
    filter.update({"state": [
        {"key": '100', "value": '미답변'},
        {"key": '200', "value": '답변완료'},
        {"key": '300', "value": '공지'},
    ]})
    result.update({"filter": filter})

    return result











