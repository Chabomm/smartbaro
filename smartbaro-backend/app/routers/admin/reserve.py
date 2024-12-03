from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from fastapi.responses import RedirectResponse, JSONResponse
from inspect import currentframe as frame

from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin
from app.models.display import *
from app.schemas.admin.auth import *
from app.schemas.schema import *
from app.schemas.reserve import *

from app.service.admin import reserve_service
from app.deps.auth import get_current_active_admin

router = APIRouter(
    prefix=PROXY_PREFIX,
    tags=["/admin/reserve"],
)

# /be/admin/reserve/list
@router.post("/admin/reserve/list", dependencies=[Depends(api_same_origin)])
async def 관리자_진료예약내역_리스트(
     request: Request
    ,page_param: PPage_param
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if not page_param.page or int(page_param.page) == 0:
        page_param.page = 1

    if not page_param.page_view_size or int(page_param.page_view_size) == 0:
        page_param.page_view_size = 30

    res = reserve_service.reserve_list(request, page_param) 
    request.state.inspect = frame()

    return res

# /admin/reserve/edit
@router.post("/admin/reserve/edit", dependencies=[Depends(api_same_origin)])
async def 관리자_진료예약내역_상태편집(
    request: Request
    ,reserveInput: ReserveInput = Body(
        ...,
        examples={
            "example01": {
                "summary": "진료예약 상태변경 예시1",
                "description": "",
                "value": {
                    "uid": 9500,
                    "state": "완료",
                },
            },
            "example02": {
                "summary": "진료예약 상태변경 예시2",
                "description": "",
                "value": {
                    "uid": 9499,
                    "state": "취소",
                },
            },
        }
    ), user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    res = reserve_service.reserve_update_state(request, reserveInput)
    request.state.inspect = frame()
    # return 
    return ex.ReturnOK(200, "상태변경이 완료되었습니다.", request)


# /be/admin/reserve/filter
@router.post("/admin/reserve/filter", dependencies=[Depends(api_same_origin)])
async def 관리자_진료예약내역_리스트_필터조건 (
    request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    result = {}
    result.update({"skeyword_type": [
        {"key": 'user_name', "value": '환자이름'},
        {"key": 'mobile', "value": '연락처'},
    ]})

    # reserve state list (진료예약 상태)
    result.update({"state": [
        {"key": '접수', "value": '접수'},
        {"key": '예약', "value": '예약'},
        {"key": '완료', "value": '완료'},
        {"key": '취소', "value": '취소'},
    ]})

    return result


# --------------------------------- 제증명서류발급 ---------------------------------

docs_list = [
    {
        "docs_name": '진단(소견서)',
        "docs_ea": '',
        "price": '20,000원',
        "note": '1부 추가당 1,000원',
        "checked": False,
    },
    {
        "docs_name": '진료의뢰서',
        "docs_ea": '',
        "price": '-',
        "note": '진료시 비용없음 ',
        "checked": False,
    },
    {
        "docs_name": '초진챠트',
        "docs_ea": '',
        "price": '1,000원',
        "note": '',
        "checked": False,
    },
    {
        "docs_name": '입원확인서',
        "docs_ea": '',
        "price": '3,000원',
        "note": '1부 추가당 1,000원',
        "checked": False,
    },
    {
        "docs_name": '통원확인서',
        "docs_ea": '',
        "price": '3,000원',
        "note": '',
        "checked": False,
    },
    {
        "docs_name": '수술기록지',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": '간호정보조사지',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": 'X-Ray 판독결과지',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": 'CT 판독결과지',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": 'MRI 판독결과지',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": 'SONO 판독결과지',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": '혈액검사결과지',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": '내시경검사 결과지',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": '영상 CD',
        "docs_ea": '',
        "price": '10,000원',
        "note": '5장이후 100원/장당',
        "checked": False,
    },
    {
        "docs_name": '전체챠트',
        "docs_ea": '',
        "price": '1,000원/장당',
        "note": '5장이후 100원/장당',
        "checked": False,
    }
]

# /be/admin/reserve/list
@router.post("/admin/reserve/docs/list", dependencies=[Depends(api_same_origin)])
async def 관리자_제증명서류발급_리스트(
     request: Request
    ,page_param: PPage_param
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if not page_param.page or int(page_param.page) == 0:
        page_param.page = 1

    if not page_param.page_view_size or int(page_param.page_view_size) == 0:
        page_param.page_view_size = 30

    res = reserve_service.docs_list(request, page_param) 
    request.state.inspect = frame()

    return res

# /be/admin/reserve/docs/read
@router.post("/admin/reserve/docs/read", dependencies=[Depends(api_same_origin)])
async def 관리자_제증명서류발급_상세(
    request: Request
    ,pRead : PRead
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if pRead.uid == 0 :
        return Docs(request=docs_list)

    res = reserve_service.docs_read(request, pRead.uid)
    request.state.inspect = frame()
    if res is None :
        return ex.ReturnOK(404, "신청 데이터가 없습니다.", request)
    
    request_list = reserve_service.docs_request_list(request, pRead.uid)
    request.state.inspect = frame()

    # return_request_docs = []
    # for docs in docs_list:
    #     for req in request_list:
    #         if(docs["docs_name"] == req.docs_name) :
    #             docs["checked"] = True
    #             docs["docs_ea"] = req.docs_ea
    #     return_request_docs.append(docs)
        
    jsondata = {}
    jsondata.update(res)
    jsondata.update(request=request_list)

    return ex.ReturnOK(200, "", request, jsondata, False)

# /be/admin/reserve/docs/filter
@router.post("/admin/reserve/docs/filter", dependencies=[Depends(api_same_origin)])
async def 관리자_제증명서류발급_리스트_필터조건 (
    request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    result = {}
    result.update({"skeyword_type": [
        {"key": 'name', "value": '환자이름'},
        {"key": 'proposer', "value": '신청인명'},
        {"key": 'mobile', "value": '휴대전화번호'},
        {"key": 'proposer_mobile', "value": '신청인 휴대전화번호'},
    ]})

    # docs state list (발급신청내역 상태)
    result.update({"state": [
        {"key": '접수완료', "value": '접수완료'},
        {"key": '발급중', "value": '발급중'},
        {"key": '발급완료', "value": '발급완료'},
        {"key": '취소', "value": '취소'},
    ]})

    return result

# /admin/reserve/docs_state/edit
@router.post("/admin/reserve/docs_state/edit", dependencies=[Depends(api_same_origin)])
async def 관리자_제증명서류발급_상태편집(
    request: Request
    ,reserveInput: ReserveInput = Body(
        ...,
        examples={
            "example01": {
                "summary": "진료예약 상태변경 예시1",
                "description": "",
                "value": {
                    "uid": 9500,
                    "state": "완료",
                },
            },
            "example02": {
                "summary": "진료예약 상태변경 예시2",
                "description": "",
                "value": {
                    "uid": 9499,
                    "state": "취소",
                },
            },
        }
    ), user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    reserve_service.docs_state_update(request, reserveInput)
    request.state.inspect = frame()
    return ex.ReturnOK(200, "상태변경이 완료되었습니다.", request)

# /admin/reserve/docs/edit
@router.post("/admin/reserve/docs/edit", dependencies=[Depends(api_same_origin)])
async def 관리자_제증명서류발급_편집(
    request: Request
    ,docsAdminInput: DocsAdminInput
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    reserve_service.docs_update(request, docsAdminInput)
    request.state.inspect = frame()
    return ex.ReturnOK(200, "변경이 완료되었습니다.", request)