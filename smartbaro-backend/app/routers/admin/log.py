import os
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from fastapi.responses import RedirectResponse, JSONResponse
from inspect import currentframe as frame

from app.core import exceptions as ex
from app.core import util
from app.deps.auth import get_current_active_admin
from app.schemas.admin.auth import *
from app.schemas.log import *
from app.core.config import PROXY_PREFIX, api_same_origin

# from app.service.admin import log_service

router = APIRouter (
    prefix = PROXY_PREFIX,
    tags=["/admin/log"],
)

# [ S ] 백엔드 로그 파일관리 
# /be/admin/log/backend/log
@router.post("/admin/log/backend/log", dependencies=[Depends(api_same_origin)])
async def 폴더리스트_backend_log(
     request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    folers = os.listdir("/usr/src/app/data/smartbaro-backend/")
    
    ll = []
    for folder in folers:
        this_path_obj = {}
        path = os.path.join('/usr/src/app/data/smartbaro-backend/', folder)
        this_path_obj["folder"] = folder
        this_path_obj["path"] = path.replace("./", "/be/")
        this_path_obj["open"] = False
        ll.append(this_path_obj)

    result = {}
    # result.update({"list": sorted([f"{f}" for f in folers])})
    result.update({"list": ll})
    return result

# /be/admin/log/backend/files
@router.post("/admin/log/backend/files", dependencies=[Depends(api_same_origin)])
async def 파일리스트_backend_files(
     request: Request
    ,backendFileListInput: BackendFileListInput
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    def print_files_in_dir(root_dir, ll):
        files = os.listdir(root_dir)
        for file in files:
            this_path_obj = {}
            path = os.path.join(root_dir, file)
            this_path_obj["name"] = file
            this_path_obj["path"] = path.replace("./", "/be/")
            this_path_obj["real"] = path
            ll.append(this_path_obj)
        return ll

    file_list = []
    res = print_files_in_dir(backendFileListInput.folder_name, file_list)

    result = {}
    result.update({"list": res})

    return result

# /be/admin/log/backend/read
@router.post("/admin/log/backend/read", dependencies=[Depends(api_same_origin)])
async def 파일상세_backend_read(
     request: Request
    ,backendFileReadInput: BackendFileReadInput
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    f = open("/usr/src/app/data/smartbaro-backend/"+backendFileReadInput.folder_name+'/'+backendFileReadInput.file_name,'r')
    lines = f.readlines()
    return lines
# [ E ] 백엔드 로그 파일관리 