from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from fastapi.responses import RedirectResponse, JSONResponse
from inspect import currentframe as frame
import json

from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin
from app.schemas.main import *
from app.schemas.display import *
from app.schemas.admin.auth import *

from app.service.admin import cate_service
from app.routers.display import *
from app.deps.auth import get_current_active_admin

router = APIRouter(
    prefix=PROXY_PREFIX,
    tags=["/admin/cate"],
)

@router.post("/admin/cate/list", dependencies=[Depends(api_same_origin)])
async def 카테고리_리스트_어드민(
    request: Request, cateInputAdmin: CateInputAdmin = Body(
        ...,
        examples={
            "example01": {
                "summary": "카테고리 리스트 예시1",
                "description": "",
                "value": {
                    "table_name": "T_MAIN", "table_uid": 10
                }
            },
            "example02": {
                "summary": "카테고리 리스트 예시2",
                "description": "",
                "value": {
                    "table_name": "T_BOARD", "table_uid": 1
                }
            },
        }
    ), user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    res = cate_service.cate_list(request, cateInputAdmin)
    request.state.inspect = frame()
    return res

# /be/admin/cate/edit
@router.post("/admin/cate/edit", dependencies=[Depends(api_same_origin)])
async def 카테고리_편집(
    request: Request, mainCate: MainCate = Body(
        ...,
        examples={
            "example01": {
                "summary": "카테고리 등록예시 01",
                "description": "",
                "value": {
                    "mode": "REG", "cate_name": "카테고리 test", "cate_sort": 1, "table_name": "T_MAIN", "table_uid": 8
                }
            },
            "example02": {
                "summary": "카테고리 등록예시 02",
                "description": "",
                "value": {
                    "mode": "REG", "cate_name": "카테고리 test222", "cate_sort": 1, "table_name": "T_BOARD", "table_uid": 1
                }
            },
            "example03": {
                "summary": "카테고리 수정예시 01",
                "description": "",
                "value": {
                    "mode": "MOD", "cuid": 26, "cate_name": "카테고리 수정 테스트", "cate_sort": 1
                }
            },
            "example04": {
                "summary": "카테고리 수정예시 02",
                "description": "",
                "value": {
                    "mode": "MOD", "cuid": 26, "cate_name": "카테고리 수정 테스트222"
                }
            },
            "example05": {
                "summary": "카테고리 삭제예시 01",
                "description": "",
                "value": {
                    "mode": "DEL", "cuid": 26
                }
            },
        }
    ), user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if mainCate.mode == "REG":
        res = cate_service.cate_create(request, mainCate)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "카테고리 등록 완료", request, {"uid": res.uid})

    if mainCate.mode == "MOD":
        res = cate_service.cate_update(request, mainCate)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "카테고리 수정 완료", request, {"uid": res.uid})

    if mainCate.mode == "DEL":
        res = cate_service.cate_delete(request, mainCate)
        request.state.inspect = frame()
        if res is None:
            return ex.ReturnOK(200, "카테고리 삭제에 실패하였습니다. 카테고리에 배정된 컨텐츠를 제거해주세요", request)
        else:
            return ex.ReturnOK(200, "카테고리 삭제 완료", request)

    if mainCate.mode == "SORT":
        cate_service.cate_sort(request, mainCate)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "순서 수정 완료", request)

# /be/admin/cate/read
@router.post("/admin/cate/read", response_model=CateReadOutput, dependencies=[Depends(api_same_origin)])
async def 카테고리_상세정보(
    request: Request, cateInputAdmin: CateInputAdmin = Body(
        ...,
        examples={
            "example01": {
                "summary": "카테고리 상세정보",
                "description": "",
                "value": {
                    "table_name": "T_MAIN",
                    "cuid": 0,
                    "table_uid": 25
                }
            },
        }
    ), user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if cateInputAdmin.cuid == 0:
        return CateReadOutput(
            cuid=0,
            cate_name="",
            cate_icon="",
            cate_sort=0,
            table_name=cateInputAdmin.table_name,
            table_uid=cateInputAdmin.table_uid
        )
    res = cate_service.cate_read(request, cateInputAdmin.cuid)
    request.state.inspect = frame()

    print(util.toJson(res))

    if res is None:
        return ex.ReturnOK(404, "데이터가 없습니다.", request)

    return res
