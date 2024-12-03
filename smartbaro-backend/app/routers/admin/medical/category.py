from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from fastapi.responses import RedirectResponse, JSONResponse
from inspect import currentframe as frame

from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin
from app.models.display import *
from app.schemas.admin.auth import *
from app.schemas.schema import *
from app.schemas.display import *

from app.service.admin import cate_service
from app.service.admin.medical import category_service
from app.deps.auth import get_current_active_admin

router = APIRouter(
    prefix=PROXY_PREFIX,
    tags=["/admin/medical"],
)

# /be/admin/medical/list
@router.post("/admin/medical/list", dependencies=[Depends(api_same_origin)])
async def 관리자_진료과_리스트(
     request: Request
    ,cateTableInput: CateTableInput = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "관리자 진료과 리스트 예시1",
                "description": "",
                "value": {
                    "table_name" : 'T_DOCTOR'
                }
            }
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    res = category_service.medical_cate_list(request, cateTableInput) 
    request.state.inspect = frame()

    return res

# /be/admin/medical/read
@router.post("/admin/medical/read", dependencies=[Depends(api_same_origin)])
async def 관리자_진료과_상세(
    request: Request
    ,pRead : PRead = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "T_CATEGORY의 uid",
                "description": "",
                "value": {
                    "uid" : 1
                }
            },
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if pRead.uid == 0 :
        return MainCate()
    
    res = category_service.medical_cate_read(request, pRead.uid)

    if res is None :
        return ex.ReturnOK(404, "데이터가 없습니다.", request)
        
    return res

# /be/admin/medical/edit
@router.post("/admin/medical/edit", dependencies=[Depends(api_same_origin)])
async def 관리자_진료과_편집(
     request:Request
    ,mainCate: MainCate = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "진료과 등록 예시",
                "description": "",
                "value": {
                     "cate_name" : "진료과1"
                    ,"table_name" : "T_DOCTOR"
                    ,"is_reserve" : "T"
                    ,"mode" : "REG"
                }
            },
            "example02" : {
                "summary": "진료과 수정 예시",
                "description": "",
                "value": {
                     "cuid" : 33
                    ,"cate_name" : "진료과목 수정 test"
                    ,"cate_sort" : 1
                    ,"is_reserve" : "F"
                    ,"mode" : "MOD"
                }
            },
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # 등록
    if mainCate.mode == "REG" :
        res = cate_service.cate_create(request, mainCate)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "등록 완료", request, {"uid": res.uid})
    
    # 수정
    if mainCate.mode == "MOD":
        res = cate_service.cate_update(request, mainCate)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "수정 완료", request, {"uid": res.uid})

    # 순서
    if mainCate.mode == "SORT":
        category_service.cate_sort(request, mainCate)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "순서 수정 완료", request)