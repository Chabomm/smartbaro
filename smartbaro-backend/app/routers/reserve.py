from fastapi import APIRouter, Depends, Request, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from inspect import currentframe as frame
from fastapi.responses import RedirectResponse, JSONResponse
from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin

from app.service.log_service import *
from app.schemas.schema import *
from app.schemas.reserve import *
from app.service import reserve_service
from app.deps.auth import get_password_hash

router = APIRouter (
    prefix = PROXY_PREFIX, 
    tags=["/reserve"],
)

# /be/reserve/edit
@router.post("/reserve/edit", dependencies=[Depends(api_same_origin)])
async def 진료예약_등록(
    request: Request
    ,reserve: Reserve = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "게시물 등록 예시",
                "description": "",
                "value": {
                     "doctor_uid" : 3
                    ,"cate_uid" : 1
                    ,"rev_date" : "2023-08-15"
                    ,"rev_time" : "09:30"
                    ,"user_name" : "환자1"
                    ,"mobile" : "010-1234-5678"
                    ,"birth" : "1987-08-13"
                    ,"is_first" : "초진"
                    ,"gender" : "남"
                    ,"post" : "46031"
                    ,"addr" : "부산 기장군 장안읍 판곡길 2"
                    ,"addr_detail" : "1층"
                }
            }
        }
    )
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    # 등록
    res = reserve_service.doctor_create(request, reserve)
    request.state.inspect = frame()
    return ex.ReturnOK(200, "접수가 완료되었습니다.\n온라인 예약은 실시간 예약이 아니며, 전문상담원과 상담 후 예약 확정됩니다.", request, {"uid" : res.uid})



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
        "docs_name": '간호기록지',
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

# /be/reserve/docs/read
@router.post("/reserve/docs/read", dependencies=[Depends(api_same_origin)])
async def 제증명서류발급_상세(
    request: Request
    ,docsReadInput : DocsReadInput = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "T_DOCS의 uid",
                "description": "",
                "value": {
                    "uid" : 1,
                    "password" : "1234"
                }
            },
        }
    )
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    if docsReadInput.password is not None and docsReadInput.password != "" :
        cbfp = check_block_fail_password(request, "T_DOCS", docsReadInput.uid)
        request.state.inspect = frame()
        if cbfp is not None and cbfp.fail_count >= 5 :
            if cbfp.ten_min >= 0 : # 10분 아직 안지남
                return ex.ReturnOK(300, "비밀번호를 5회연속 틀렸습니다.\n10분간 사용이 제한됩니다.", request)
            else : # 10분 지남
                reset_block_fail_password(request, "T_DOCS", docsReadInput.uid)
                request.state.inspect = frame()

    if docsReadInput.uid == 0 :
        return Docs(request=docs_list)

    pw_vaild_res = reserve_service.pass_vaild(request, docsReadInput)
    request.state.inspect = frame()

    if pw_vaild_res is None : # 비밀번호 틀림
        fail_count = create_fail_password(request, "T_DOCS", docsReadInput.uid, docsReadInput.password)
        request.state.inspect = frame()

        fail_password_history(request, "T_DOCS", docsReadInput.uid, docsReadInput.password)
        request.state.inspect = frame()
        
        # log insert를 해야되서 200 code 리턴.
        return ex.ReturnOK(200, "비밀번호가 일치하지 않습니다.("+str(fail_count)+"/5)\n5회 연속 다른 경우, 서비스 사용이 제한됩니다.", request)
    else :
        reset_block_fail_password(request, "T_DOCS", docsReadInput.uid)
        request.state.inspect = frame()
    
    res = reserve_service.docs_read(request, docsReadInput.uid)
    request.state.inspect = frame()
    if res is None :
        return ex.ReturnOK(404, "신청 데이터가 없습니다.", request)

    res = dict(zip(res.keys(), res))
    res["name"] = util.fn_masking_user_name(res["name"] if "name" in res else "") 
    res["proposer"] = util.fn_masking_user_name(res["proposer"] if "proposer" in res else "") 
    res["tel"] = util.fn_masking_user_mobile(res["tel"] if "tel" in res else "")
    res["mobile"] = util.fn_masking_user_mobile(res["mobile"] if "mobile" in res else "")
    res["proposer_tel"] = util.fn_masking_user_mobile(res["proposer_tel"] if "proposer_tel" in res else "")
    res["proposer_mobile"] = util.fn_masking_user_mobile(res["proposer_mobile"] if "proposer_mobile" in res else "")
    
    request_list = reserve_service.docs_request_list(request, docsReadInput.uid)
    request.state.inspect = frame()

    return_request_docs = []
    for docs in docs_list:
        for req in request_list:
            if(docs["docs_name"] == req.docs_name) :
                docs["checked"] = True
                docs["docs_ea"] = req.docs_ea
        return_request_docs.append(docs)
        
    jsondata = {}
    jsondata.update(res)
    jsondata.update(request=return_request_docs)

    return ex.ReturnOK(200, "", request, jsondata, False)

# /be/reserve/docs/list
@router.post("/reserve/docs/list", dependencies=[Depends(api_same_origin)])
async def 제증명서류발급_리스트(
    request: Request
    ,page_param: PPage_param
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    if not page_param.page or int(page_param.page) == 0:
        page_param.page = 1
    
    if not page_param.page_view_size or int(page_param.page_view_size) == 0 :
        page_param.page_view_size = 30
    
    res = reserve_service.docs_list(request, page_param) 
    request.state.inspect = frame()
    return res

# /be/reserve/docs/edit
@router.post("/reserve/docs/edit", dependencies=[Depends(api_same_origin)])
async def 제증명서류발급_등록(
    request: Request
    ,docsInput: DocsInput = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "제증명서류발급 등록 예시",
                "description": "",
                "value": {
                     "name" : "환자1"
                    ,"post" : "11111"
                    ,"addr1" : "인천 연수구"
                    ,"addr2" : "가나다대로"
                    ,"tel" : "02-555-6544"
                    ,"mobile" : "010-8888-9999"
                    ,"proposer" : "신청자1"
                    ,"proposer_tel" : "02-998-8888"
                    ,"proposer_mobile" : "010-7777-5555"
                    ,"password" : "1234"
                    ,"relation_type" : "지정대리인"
                    ,"purpose_type" : "병무청"
                    ,"hope_at" : "2023-11-01"
                    ,"request": [{
                         "docs_uid" : 2
                        ,"docs_name" : "간호기록지"
                        ,"docs_ea" : 1
                    },
                    {
                         "docs_uid" : 2
                        ,"docs_name" : "수술기록지"
                        ,"docs_ea" : 3
                    },
                    {
                         "docs_uid" : 2
                        ,"docs_name" : "통원확인서"
                        ,"docs_ea" : 1
                    }]
                }
            }
        }
    )
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    if docsInput.password is not None : 
        password_hash = get_password_hash(docsInput.password)
        request.state.inspect = frame()
        docsInput.password = password_hash

        # 제증명서류발급 등록
        res = reserve_service.docs_create(request, docsInput)
        request.state.inspect = frame()
        # return
        return ex.ReturnOK(200, "신청이 완료되었습니다.", request, {"uid" : res.uid})

