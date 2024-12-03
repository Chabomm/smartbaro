from fastapi import APIRouter, Depends, Request, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from inspect import currentframe as frame
from fastapi.responses import RedirectResponse, JSONResponse
from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin

from app.schemas.schema import *
from app.schemas.reserve import *
from app.schemas.display import *
from app.service import doctor_service
from app.service import reserve_service

router = APIRouter (
    prefix = PROXY_PREFIX, 
    tags=["/doctor"],
)

# api/doctor/list
@router.post("/doctor/list", dependencies=[Depends(api_same_origin)])
async def 의료진_리스트(
    request: Request
    ,pRead: PRead = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "T_CATEGORY의 uid",
                "description": "",
                # "value": {
                #     "cate_uid": [1]
                # }
                "value": {
                    "uid" : 1
                }
            },
        }
    )
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    
    res = doctor_service.doctor_list(request, pRead.uid)
    request.state.inspect = frame()

    # res2 = doctor_service.test(request)
    # request.state.inspect = frame()

    res.update({"values": Reserve()})
    res.update({"schedule": {}})

    return res

# api/doctor/read
@router.post("/doctor/read", dependencies=[Depends(api_same_origin)])
async def 의료진_상세(
    request: Request
    ,pRead: PRead = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "T_DOCTOR의 uid",
                "description": "",
                "value": {
                    "uid" : 1
                }
            },
        }
    )
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    res = doctor_service.doctor_read(request, pRead.uid)
    request.state.inspect = frame()

    if res is None:
        return ex.ReturnOK(404, "데이터가 없습니다.", request)

    return res

# api/doctor/schedule/read
@router.post("/doctor/schedule/read", dependencies=[Depends(api_same_origin)])
async def 의료진_시간표_상세(
    request: Request
    ,pRead: PRead = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "T_DOCTOR_SCHEDULE의 uid",
                "description": "",
                "value": {
                    "uid" : 1
                }
            },
        }
    )
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    
    res = doctor_service.doctor_schedule_read(request, pRead.uid)
    request.state.inspect = frame()

    times_am = [
        '09:00'
        ,'09:30'
        ,'10:00'
        ,'10:30'
        ,'11:00'
        ,'11:30'
        ,'12:00'
    ]

    times_pm = [
         '14:00'
        ,'14:30'
        ,'15:00'
        ,'15:30'
        ,'16:00'
        ,'16:30'
        ,'17:00'
    ]

    res.update({'times_am': times_am})
    res.update({'times_pm': times_pm})

    if res is None:
        return ex.ReturnOK(404, "데이터가 없습니다.", request)

    return res

# api/doctor/schedule/list
@router.post("/doctor/schedule/list", dependencies=[Depends(api_same_origin)])
async def 의료진_시간표_리스트(
    request: Request
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    
    res = doctor_service.doctor_schedule_list(request)
    request.state.inspect = frame()

    return res
