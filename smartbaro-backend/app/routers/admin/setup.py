import os

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from fastapi.responses import RedirectResponse, JSONResponse
from inspect import currentframe as frame

from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin
from app.models.admin import *
from app.models.session import *
from app.schemas.admin.admin import *
from app.schemas.admin.auth import *

from fastapi.datastructures import UploadFile
from fastapi.param_functions import File, Body, Form

from app.service.admin import setup_service, filter_service
from app.service import session_service

from app.deps.auth import get_current_active_admin
from app.deps.auth import create_access_token, get_current_active_admin
from app.deps.auth import ACCESS_TOKEN_EXPIRE_MINUTES, REFRESH_TOKEN_EXPIRE_MINUTES
from app.schemas.admin.setup import DeleteFile

router = APIRouter(
    prefix=PROXY_PREFIX,
    tags=["/admin/setup"],
)

## ========== 내 정보수정 start ========
# /be/admin/setup/info/read
@router.post("/admin/setup/info/read", dependencies=[Depends(api_same_origin)])
async def 내정보보기 (
     request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    res = setup_service.info_read(request)
    request.state.inspect = frame()

    if res is None:
        return ex.ReturnOK(404, "데이터를 찾을 수 없습니다.", request)

    res["user_pw"]= ''
    res["user_pw2"]= ''
    return res

@router.post("/admin/setup/info/update", dependencies=[Depends(api_same_origin)])
async def 내정보수정 (
     request: Request
    ,response: Response
    ,myInfoInput: MyInfoInput = Body(
        ...,
        examples={
            "example01": {
                "summary": "내 정보 수정하기 예시1",
                "description": "",
                "value": {
                    "user_pw": "a1234",
                    "tel": "0321231234",
                    "mobile": "01012341234"
                },
            },
        }
    ), user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # 수정
    res = setup_service.info_update(request, myInfoInput)
    request.state.inspect = frame()

    if user is None :
        return ex.ReturnOK(404, "정보를 찾을 수 없습니다. 아이디와 비밀번호를 다시 확인해 주세요", request)
    
    if myInfoInput.mobile != None :
        arry_mobile = myInfoInput.mobile.split('-')
        if myInfoInput.user_pw == res.user_id +  arry_mobile[2] :
            return ex.ReturnOK(300, "비밀번호는 초기비밀번호와 동일하게 설정할 수 없습니다", request)    

    if myInfoInput.user_pw != '' and myInfoInput.user_pw != None :
        if len(myInfoInput.user_pw) < 6 or len(myInfoInput.user_pw) > 20 :
            return ex.ReturnOK(300, "영문, 숫자 조합 6자 이상, 20자 이하여야 합니다.", request)

    # return
    # [ S ] 토큰 및 세션 재생성
    token_data = TokenDataAdmin (
        token_name = "SMARTBARO-ADMIN"
        ,user_uid = user.user_uid
        ,user_id = user.user_id
        ,user_name = res.user_name
        ,user_depart = res.depart
        ,role = user.role
        ,roles = user.roles
        ,is_temp = False
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

    response.set_cookie (
         key="SMARTBARO-ADMIN"
        ,value=access_token
    )

    # [ E ] 토큰 및 세션 재생성

    # import time
    # print("Python, time.sleep(2) -> 2초 기다림") 
    # time.sleep(5)

    return ex.ReturnOK(200, "수정이 완료되었습니다.", request, {"uid" : res.uid})
    
# /be/admin/welcome/read
@router.post("/admin/welcome/read", dependencies=[Depends(api_same_origin)])
async def 초기비밀번호_내정보보기 (
     request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    res = setup_service.info_read(request)
    request.state.inspect = frame()
    res["user_name"] = util.fn_masking_user_name(res["user_name"] if "user_name" in res else "")
    res["email"] = util.fn_masking_user_email(res["email"] if "email" in res else "")
    res["mobile"] = util.fn_masking_user_mobile(res["mobile"] if "mobile" in res else "")

    if res is None:
        return ex.ReturnOK(404, "데이터를 찾을 수 없습니다.", request)

    res["user_pw"]= ''
    res["user_pw2"]= ''

    return res


def 관리자내역_필터리스트 (request: Request) :
    filter = {}

    # 전체 역할 리스트
    roles = filter_service.rolse(request)
    request.state.inspect = frame()
    filter.update({"roles": roles["list"]})

    filter.update({"skeyword_type": [
        {"key": 'user_id', "value": '관리자ID'},
        {"key": 'user_name', "value": '이름'},
        {"key": 'depart', "value": '부서'}
    ]})

    filter.update({"state": [
        {"key": '100', "value": '승인대기'},
        {"key": '200', "value": '정상'},
        {"key": '300', "value": '탈퇴'},
    ]})

    return filter

# /be/admin/setup/manager/list/init
@router.post("/admin/setup/manager/list/init", dependencies=[Depends(api_same_origin)])
async def 관리자내역_init(
    request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    result = {}

    # [ S ] 초기 파라메터
    params = {
         "page" : 1
        ,"page_view_size": 30
        ,"page_size": 0
        ,"page_total": 0
        ,"page_last": 0
        ,"filters": {
             "skeyword": ''
            ,"skeyword_type": ''
            ,"rec_type": []
            ,"state": ''
            ,"roles": []
            ,"create_at": {
                "startDate": None,
                "endDate": None,
            },
        }
    }
    result.update({"params": params})
    # [ S ] 초기 파라메터
    
    result.update({"filter": 관리자내역_필터리스트(request)}) # 초기 필터

    return result
    
# /be/admin/setup/manager/list
@router.post("/admin/setup/manager/list", dependencies=[Depends(api_same_origin)])
async def 관리자_리스트(
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

    res = setup_service.admin_user_list(request, page_param)
    request.state.inspect = frame()

    return res

@router.post("/admin/setup/manager/read", dependencies=[Depends(api_same_origin)])
async def 관리자_상세(
    request: Request
    ,pRead: PRead
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    copy_deps_user = user # router Depends 때문에 따로 복사해둠
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if pRead.uid == 0:
        res = Admin()
    else :
        res = setup_service.admin_user_read(request, pRead.uid, "")
        request.state.inspect = frame()
        if res is None:
            return ex.ReturnOK(404, "데이터를 찾을 수 없습니다.", request)
    
    jsondata = {}

    if res.uid > 0 :
        values = dict(zip(res.keys(), res))
    else :
        values = res

    jsondata.update({"values": values})
    jsondata.update({"filter": 관리자내역_필터리스트(request)})

    # 전체 역할 리스트
    roles = setup_service.admin_rols_list(request)
    request.state.inspect = frame()

    jsondata["filter"]["roles"] = roles["list"]

    return jsondata

@router.post("/admin/setup/manager/edit", dependencies=[Depends(api_same_origin)])
async def 관리자_등록수정(
    request: Request
    ,admin: Admin
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if admin.mode == "DEL" and admin.uid > 0:  # 관리자 삭제
        res = setup_service.admin_user_delete(request, admin)
        message = "삭제 되었습니다."

    elif admin.uid > 0:  # 관리자 수정
        res = setup_service.admin_user_edit(request, admin)
        message = "수정이 완료되었습니다."

    elif admin.uid is None or admin.uid == 0:
        res = setup_service.admin_user_create(request, admin)
        message = "등록이 완료되었습니다."

    request.state.inspect = frame()

    if 'dict' in str(type(res)) and "code" in res:
        if res["code"] == 300:
            return res

    return ex.ReturnOK(200, message, request, {"uid": res.uid})

    # if res is None :
    #     return ex.ReturnOK(404, "데이터가 없습니다.")

    # res = dict(zip(res.keys(), res))
    # res.update({"user_pw": ""})
    # return res












## ========== 어드민 메뉴설정 start ========
@router.post("/admin/setup/menus", dependencies=[Depends(api_same_origin)])
async def 관리자_메뉴설정_리스트(
    request: Request
    ,adminMenuListInput: AdminMenuListInput = Body(
        ...,
        examples={
            "example01": {
                "summary": "T_ADMIN_MENU의 uid(depth)",
                "description": "",
                "value": {
                    "parent": 2
                },
            }
        }
    ), user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    res = setup_service.admin_menu_list(request, adminMenuListInput.parent)
    request.state.inspect = frame()
    return res

# async def 관리자_메뉴설정_상세
@router.post("/admin/setup/menus/read", dependencies=[Depends(api_same_origin)])
async def 관리자_메뉴설정_상세(
    request: Request
    ,pRead : PRead = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "T_ADMIN_MENU의  uid",
                "description": "",
                "value": {
                    "uid" : 23
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
        return AdminMenu()
    
    res = setup_service.admin_menu_read(request, pRead.uid)
    request.state.inspect = frame()

    if res is None :
        return ex.ReturnOK(404, "데이터가 없습니다.", request)
        
    return res

@router.post("/admin/setup/menus/edit", dependencies=[Depends(api_same_origin)])
async def 관리자_메뉴_편집(
    request: Request
    ,adminMenuInput: AdminMenuInput = Body(
        ...,
        examples={
            "example01": {
                "summary": "대메뉴 등록하기 예시1",
                "description": "",
                "value": {
                    "name": "대메뉴 등록test",
                    "icon": "fas fa-vihara",
                    "mode": "REG"
                },
            },
            "example02": {
                "summary": "대메뉴 수정하기 예시1",
                "description": "",
                "value": {
                    "uid": 29,
                    "name": "대메뉴 수정test",
                    "icon": "fas fa-tree",
                    "mode": "MOD"
                },
            },
            "example03": {
                "summary": "소메뉴 수정하기 예시1",
                "description": "",
                "value": {
                    "uid": 22,
                    "name": "",
                    "to": "",
                    "mode": "REG"
                },
            },
        }
    ), user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # if pRead.uid == 0:
    #     return Member()

    # 등록
    if adminMenuInput.mode == "REG" :
        res = setup_service.admin_menu_create(request, adminMenuInput)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "메뉴 등록 완료", request, {"uid" : res.uid})
    
    # 수정
    if adminMenuInput.mode == "MOD" :
        res = setup_service.admin_menu_update(request, adminMenuInput)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "메뉴 수정 완료", request, {"uid" : res.uid})
    
    # 순서
    if adminMenuInput.mode == "SORT" :
        setup_service.admin_menu_sort(request, adminMenuInput)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "순서 수정 완료", request)
    





## ========== 어드민 역할관리 start ========
@router.post("/admin/setup/manager/roles/filter", dependencies=[Depends(api_same_origin)])
async def 역할관리_리스트_필터조건(
    request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    result = {}

    # 전체 메뉴 리스트
    menus = setup_service.menu_list_for_filter(request)
    result.update({"menus": menus})

    return result

@router.post("/admin/setup/manager/roles", dependencies=[Depends(api_same_origin)])
async def 역할관리_리스트(
     request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # 전체 역할 리스트
    roles = setup_service.admin_rols_list(request)
    request.state.inspect = frame()

    return roles

@router.post("/admin/setup/manager/roles/read", dependencies=[Depends(api_same_origin)])
async def 역할관리_상세(
    request: Request
    ,pRead : PRead
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if pRead.uid == 0 :
        roles = AdminRoles()
    else :
        roles = setup_service.admin_roles_read(request, pRead.uid)
        request.state.inspect = frame()
    
    result = {}
    result.update({"values": roles})

    # 전체 메뉴 리스트
    menus = setup_service.menu_list_for_filter(request)
    request.state.inspect = frame()
    result.update({"filter": {}})
    result["filter"].update({"menus": menus})

    return result

@router.post("/admin/setup/manager/roles/edit", dependencies=[Depends(api_same_origin)])
async def 역할관리_편집(
    request: Request
    ,adminRolesInput: AdminRolesInput
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # 등록
    if adminRolesInput.mode == "REG" :
        res = setup_service.admin_roles_create(request, adminRolesInput)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "등록이 완료되었습니다.", request, {"uid" : res.uid})

    # 수정
    if adminRolesInput.mode == "MOD" :
        res = setup_service.admin_roles_update(request, adminRolesInput)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "수정이 완료되었습니다.", request, {"uid" : res.uid})
    
    # 삭제
    if adminRolesInput.mode == "DEL" :
        setup_service.admin_roles_delete(request, adminRolesInput.uid)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "삭제 완료", request, {"uid" : 0})
    




## ========== 이미지파일관리 start ========
# /be/admin/setup/images/folders
@router.post("/admin/setup/images/folders", dependencies=[Depends(api_same_origin)])
async def 폴더_리스트_static_images(
     request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # folers = os.listdir("/usr/src/app/resource/images")

    def print_files_in_dir(root_dir, ll):
        files = os.listdir(root_dir)
        for file in files:
            if str(file) == ".DS_Store" :
                print(".DS_Store passsss")
            else :
                this_path_obj = {}
                path = os.path.join(root_dir, file)
                this_path_obj["name"] = file
                this_path_obj["path"] = path.replace("/usr/src/app/resource/", "/resource/")
                this_path_obj["real"] = path
                if os.path.isdir(path):
                    this_path_obj["type"] = "folder"
                    this_path_obj["dir"] = []
                    print_files_in_dir(path, this_path_obj["dir"])
                else :
                    this_path_obj["type"] = "image"
                ll.append(this_path_obj)

    file_list = []
    print_files_in_dir("/usr/src/app/resource/images", file_list)
    # print(file_list)
    # foler_list = []
    # for f in folers :
    #     foler_list.append(dict(name=f, type="folder"))

    result = {}
    result.update({"list": file_list})
    # result.update({"list": sorted([f"{f}" for f in folers])})
    

    return result

# /be/admin/setup/images/folders/upload
@router.post("/admin/setup/images/folders/upload")
async def 파일_업로드_static_images(
    request:Request
    ,files: Optional[List[UploadFile]] = File(None)
    ,folder: str = Form(...)
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # backend에 파일 업로드
    success_count = 0
    total_count = len(files)
    result = {}
    result.update({"upload_list": []})
    
    for file in files:
        try:
            contents = file.file.read()
            with open(folder + "/" + file.filename, 'wb') as f:
                f.write(contents)
                oData = {}
                oData["name"] = file.filename
                oData["path"] = folder.replace("/usr/src/app/resource/images/", "/resource/images/")+ "/" + file.filename
                oData["real"] = folder + "/" + file.filename
                oData["type"] = "image"
                result["upload_list"].append(oData)
                success_count = success_count + 1
        except Exception as e:
            print("Exception----------", str(e))
            return ex.ReturnOK(500, str(total_count) + "개 중 " + str(success_count) + "개 파일 업로드 완료", request, result)
        finally:
            file.file.close()

    return ex.ReturnOK(200, str(success_count) + "개 파일 업로드가 완료되었습니다.", request, result)

# /be/admin/setup/images/folders/delete
@router.post("/admin/setup/images/folders/delete")
async def 파일_삭제(
    request:Request
    ,deleteFile: DeleteFile
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    try:
        if os.path.isfile(deleteFile.path):
            os.remove(deleteFile.path)
        else :
            return ex.ReturnOK(500, "삭제할 파일이 존재하지 않습니다. 새로고침후 다시 시도바랍니다.", request)

    except Exception as e:
        print("Exception----------", str(e))
        return ex.ReturnOK(500, "파일 삭제 도중 오류가 발생했습니다. 새로고침후 다시 시도바랍니다.", request)

    return ex.ReturnOK(200, "파일 삭제 완료", request)







## ========== 어드민 로그인이력 start ========
# /be/admin/setup/login/list
@router.post("/admin/setup/login/list", dependencies=[Depends(api_same_origin)])
async def 관리자_로그인이력_리스트(
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

    res = setup_service.admin_login_list(request, page_param)
    request.state.inspect = frame()

    return res

# /be/admin/setup/login/filter
@router.post("/admin/setup/login/filter", dependencies=[Depends(api_same_origin)])
async def 관리자_로그인이력_필터조건 (
    request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    result = {}
    result.update({"skeyword_type": [
        {"key": 'user_id', "value": '아이디'},
        {"key": 'ip', "value": '아이피'},
        {"key": 'profile', "value": 'ENV'},
    ]})

    return result





