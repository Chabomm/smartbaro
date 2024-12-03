from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from fastapi.responses import RedirectResponse, JSONResponse
from inspect import currentframe as frame

from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin
from app.schemas.admin.auth import *
from app.schemas.schema import *
from app.schemas.doctor import *

from app.service.admin.medical import doctor_service
from app.service.admin import filter_service
from app.deps.auth import get_current_active_admin

router = APIRouter(
    prefix=PROXY_PREFIX,
    tags=["/admin/medical/doctor"],
)

# /be/admin/medical/doctor/list
@router.post("/admin/medical/doctor/list", dependencies=[Depends(api_same_origin)])
async def 관리자_의료진관리_리스트(
     request: Request
    ,nonPage_param: NonPage_param
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    res = doctor_service.medical_doctor_list(request, nonPage_param) 
    request.state.inspect = frame()

    return res

# /be/admin/medical/doctor/read
@router.post("/admin/medical/doctor/read", dependencies=[Depends(api_same_origin)])
async def 관리자_의료진_상세(
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
    copy_deps_user = user # router Depends 때문에 따로 복사해둠
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    jsondata = {}
    if pRead.uid == 0 :
        res = DoctorDetail()
        doctor_infos = []
    else :
        res = doctor_service.medical_doctor_read(request, pRead.uid)
        request.state.inspect = frame()

        doctor_infos = doctor_service.doctor_info_list(request, pRead.uid)
        request.state.inspect = frame()

        if res is None :
            return ex.ReturnOK(400, "의료진 정보가 존재하지 않습니다", request)

    jsondata.update({"values": res})
    jsondata.update({"filter": await 관리자_의료진관리_필터조건(request, copy_deps_user)})
    jsondata.update({"doctor_infos": doctor_infos})
        
    return jsondata

# /be/admin/medical/doctor/edit
@router.post("/admin/medical/doctor/edit", dependencies=[Depends(api_same_origin)])
async def 관리자_의료진_편집(
     request:Request
    ,doctorDetail: DoctorDetail = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "의료진 등록 예시",
                "description": "",
                "value": {
                     "cate_uid" : [2,4,6]
                    ,"name" : "테스트 의사1"
                    ,"position" : "대표원장"
                    ,"field_keyword" : "고관절질환 척추협착증, 척추측만증"
                    ,"field_spec" : "목/허리디스크, 퇴행성 척추질환, 노인 척추질환대퇴골두무혈성괴사 고관절질환, 고관절 인공관절소아성장 변형, 청소년 척추측만증"
                    ,"career" : "<div class="">척추외과 정형외과 전문의</div>"
                    ,"sort" : 5
                    ,"subject" : "국제 학회활동"
                    ,"contents" : "· 프랑스, 척추(경추, 요추) 수술 및 학회 참관 · 네덜란드, 퇴행성 요추 치료/수술 학회 참관"
                    ,"info_sort" : 1
                    ,"am_week_1" : "진료"
                    ,"am_week_2" : "진료"
                    ,"am_week_3" : "진료"
                    ,"am_week_4" : "진료"
                    ,"am_week_5" : "진료"
                    ,"pm_week_1" : "수술"
                    ,"pm_week_2" : "수술"
                    ,"pm_week_3" : "수술"
                    ,"pm_week_4" : "수술"
                    ,"pm_week_5" : "수술"
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
            "example03" : {
                "summary": "등록실패했던",
                "description": "",
                "value": {
                    "uid": 0,
                    "cate_uid": [
                        3
                    ],
                    "name": "김병관",
                    "position": "원장",
                    "thumb": "",
                    "profile": "/resr/medical/doctor/fdac842d-a6c0-47d9-9da5-a154fbc0af9d.jpg",
                    "field_keyword": "목/허리디스크, 두통, 어지럼증, 손저림, 뇌졸증",
                    "field_spec": "목/허리디스크, 퇴행성척추질환, 척추협착증, 두통, 손저림, 어지럼증, 안면신경마비, 머리떨림, 뇌졸증",
                    "career": "신경외과 전문의\n계명대학교 의과대학졸업\n계명대의과대학대구동산병원 레지던트\n연세대학교 의과대학 세브란스 신경외과 전임의\n연세대학교 세브란스병원 신경외과 임상강사\n대전우리병원 척추센터 과장",
                    "subject": "",
                    "contents": "",
                    "info_sort": 1,
                    "am_week_1": "수술",
                    "am_week_2": "수술",
                    "am_week_3": "수술",
                    "am_week_4": "수술",
                    "am_week_5": "수술",
                    "pm_week_1": "수술",
                    "pm_week_2": "수술",
                    "pm_week_3": "진료",
                    "pm_week_4": "진료",
                    "pm_week_5": "진료",
                    "doctor_schedule_reset": False,
                    "sort_array": [],
                    "mode": "REG",
                    "profile_fakename": "김병관.jpg"
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
    if doctorDetail.mode == "REG" :
        res = doctor_service.medical_doctor_create(request, doctorDetail)
        request.state.inspect = frame()

        doctorDetail.uid = res.uid 
        if not doctorDetail.doctor_schedule_reset : # 리셋
            doctor_service.doctor_schedule_create(request, doctorDetail)
            request.state.inspect = frame()

        return ex.ReturnOK(200, "등록 완료", request, {"uid": res.uid})
    
    # 수정
    if doctorDetail.mode == "MOD":
        res = doctor_service.medical_doctor_update(request, doctorDetail)
        request.state.inspect = frame()
        
        doctor_service.doctor_schedule_update(request, doctorDetail)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "수정 완료", request, {"uid": res.uid})
    
    # 삭제
    if doctorDetail.mode == "DEL":
        res = doctor_service.medical_doctor_delete(request, doctorDetail.uid)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "삭제 완료", request, {"uid": res.uid})

    # 순서
    if doctorDetail.mode == "SORT":
        doctor_service.medical_doctor_sort(request, doctorDetail)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "순서 수정 완료", request)
    

# /be/admin/medical/doctor_info/edit
@router.post("/admin/medical/doctor_info/edit", dependencies=[Depends(api_same_origin)])
async def 관리자_의료진상세_편집(
     request:Request
    ,doctorInfo: DoctorInfo = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "의료진상세 등록 예시",
                "description": "",
                "value": {
                     "doctor_uid" : 10
                    ,"subject" : "의료진 상세 테스트입니다1"
                    ,"contents" : "의료진 상세 내용 테스트입니다1"
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
    if doctorInfo.mode == "REG" :
        res = doctor_service.doctor_info_create(request, doctorInfo)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "등록 완료", request, res)
    
    # 삭제
    if doctorInfo.mode == "DEL":
        res = doctor_service.doctor_info_delete(request, doctorInfo.uid)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "삭제 완료", request, res)

    # 순서
    if doctorInfo.mode == "SORT":
        doctor_service.doctor_info_sort(request, doctorInfo)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "순서 수정 완료", request)
    

# /be/admin/medical/doctor_schedule/delete
# @router.post("/admin/medical/doctor_schedule/delete", dependencies=[Depends(api_same_origin)])
# async def 관리자_의료진스케줄_삭제(
#      request:Request
#     ,pRead : PRead = Body(
#         ...,
#         examples = {
#             "example01" : {
#                 "summary": "T_DOCTOR_SCHEDULE의 uid",
#                 "description": "",
#                 "value": {
#                     "uid" : 1
#                 }
#             },
#         }
#     )
#     ,user: TokenDataAdmin = Depends(get_current_active_admin)
# ):
#     request.state.inspect = frame()
#     request.state.body = await util.getRequestParams(request)
#     user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

#     res = doctor_service.doctor_schedule_delete(request, pRead.uid)
#     request.state.inspect = frame()
#     return ex.ReturnOK(200, "삭제 완료", {"uid": res.uid})

# /be/admin/medical/doctor/filter
@router.post("/admin/medical/doctor/filter", dependencies=[Depends(api_same_origin)])
async def 관리자_의료진관리_필터조건 (
    request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    result = {}
    result.update({"skeyword_type": [
        {"key": 'name', "value": '의료진명'},
        {"key": 'field_keyword', "value": '대표 키워드'},
        {"key": 'position', "value": '직책'}
    ]})

    # category list (카테고리)
    cate_list = filter_service.doctor_cate(request, "T_DOCTOR")
    request.state.inspect = frame()
    result.update({"cate_uid": cate_list["list"]})

    return result