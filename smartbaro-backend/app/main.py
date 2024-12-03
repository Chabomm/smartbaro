import json
import os

from fastapi import FastAPI, Depends, HTTPException, status, Request, Header
from fastapi.responses import PlainTextResponse, JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from fastapi.staticfiles import StaticFiles
from inspect import currentframe as frame

from app.core import exceptions as ex
from app.core.logger import api_logger
from app.core.database import SessionLocal
from app.core import util

app = FastAPI(
    title = '국제바로병원 API Server',
    description = '국제바로병원 API Server'
)

app.mount("/api/resource", StaticFiles(directory="/usr/src/app/resource/"), name="resource")
        
allow_ip_list = [
    "112.221.134.106"
]

api_key_header = APIKeyHeader(name="Token")

origins = [
    "http://localhost:5000",
    "http://localhost:7070",
]

# origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header (request: Request, call_next):
    request.state.req_time = util.getNow()
    request.state.start = util.getUnixTime()

    if os.environ['PROFILE'] == "development" :
        request.state.user_ip = "127.0.0.1"

    elif request.headers.get('x-user-ip') != None and os.environ['HOST_IP'] != str(request.headers.get('x-user-ip')) :
        request.state.user_ip = str(request.headers.get('x-user-ip')) # nextjs serversideprops에서 보낸 아이피

    elif request.headers.get('x-real-ip') != None and os.environ['HOST_IP'] != str(request.headers.get('x-real-ip')) :
        request.state.user_ip = str(request.headers.get('x-real-ip'))

    elif request.client.host != None and os.environ['HOST_IP'] != str(request.client.host) :
        request.state.user_ip = str(request.client.host)
        
    if not hasattr(request.state, 'user_ip') :
        request.state.user_ip = "127.0.0.1"
        
    # static 미들웨어 허용
    if request.url.path.startswith("/api/static/") :
        response = await call_next(request)
        return response
    
    if request.url.path.startswith("/openapi.json") :
        IS_BLOCK = True
        for allow_ip in allow_ip_list:
            if os.environ.get('PROFILE') == 'development' :
                IS_BLOCK = False
            elif allow_ip == str(request.state.user_ip) :
                IS_BLOCK = False
            if IS_BLOCK :
                return PlainTextResponse(status_code=404)
            
        response = await call_next(request)
        return response

    # docs local만 허용
    if request.url.path.startswith("/docs") \
        or request.url.path.startswith("/redoc") :
        
        IS_BLOCK = True
        for allow_ip in allow_ip_list:
            if os.environ.get('PROFILE') == 'development' :
                IS_BLOCK = False
            elif allow_ip == str(request.state.user_ip) :
                IS_BLOCK = False
            if IS_BLOCK :
                return PlainTextResponse(status_code=404)

    request.state.inspect = None
    request.state.body = None
    request.state.user = None
    request.state.db = SessionLocal()

    try :
        print("")
        print("")
        print("\033[95m" + "######################## [",request.state.user_ip,"] [", util.getNow(), "] [",util.get_request_url(request),"] START " + "\033[0m")
        response = await call_next(request)
        request.state.db.commit()
        request.state.db.close()
        print("\033[95m" + "######################## [",request.state.user_ip,"] [", util.getNow(), "] [",util.get_request_url(request),"] SUCCESS END " + "\033[0m")
    except Exception as e:
        request.state.db.rollback()
        request.state.db.close()
        # 디테일한 내용을 log 찍어주고 간단한 내용을 클라이언트한테 response
        # print("Exception----------", str(e))
        error = await ex.exception_handler(e)
        error_dict = dict(status=error.status_code, msg=error.msg, code=error.code)
        response = JSONResponse(status_code=error.status_code, content=error_dict)
        await api_logger(request=request, error=error)
        print("\033[95m" + "######################## [",request.state.user_ip,"] [", util.getNow(), "] [",util.get_request_url(request),"] EXCEPTION END " + "\033[0m")

    if request.state.user :
        print("\033[95m" + str(request.state.user) + "\033[0m")
        if '/logout' in str(request._url):
            response.delete_cookie(request.state.user.token_name)
        else :
            response.set_cookie ( 
                key=request.state.user.token_name
                ,value=request.state.user.access_token
            )

    # print("")
    # print("")
    # print("--- request")
    # print(request.__dict__)
    # print("")
    # print("")
    # print("--- response")
    # print(response.__dict__)
    # print("")
    # print("")

    return response

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    print(f"{repr(exc)}")
    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)

@app.get("/")
def read_root(request:Request):
    return "Hello World"

API_TOKEN = "SECRET_API_TOKEN"

async def api_token(token: str = Depends(APIKeyHeader(name="Token"))):
    if token != API_TOKEN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

@app.get("/protected-route", dependencies=[Depends(api_token)])
async def protected_route():
    return {"hello": "world"}

@app.get("/be/ping", status_code=200, description="***** Liveliness Check *****")
async def ping(
    request:Request
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    return "pong"

@app.post("/be/client_error")
async def client_error (
    request:Request
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    timestr = util.getNow("%Y-%m-%d")
    file_name = timestr + ".client.log"
    logm = util.getNow() + " |:| " + request.state.user_ip + "\n"
    logm = logm + "┏────────────request.state.body─────────────┓" + "\n"
    logm = logm + json.dumps(request.state.body, ensure_ascii=False, indent=4) + "\n"
    logm = logm + "└───────────────────────────────────────────┘" 

    util.file_open (
        "/usr/src/app/data/smartbaro-backend/client/"
        ,file_name
        ,logm
    )

# ==== start common ==== 
from .routers import auth
app.include_router(auth.router)

from .routers import doctor
app.include_router(doctor.router)

from .routers import reserve
app.include_router(reserve.router)

from .routers import board
app.include_router(board.router)

from .routers import files
app.include_router(files.router)

from .routers import display
app.include_router(display.router)
# ==== end common ==== 

# ==== start admin ==== 
from .routers.admin import auth
app.include_router(auth.router)

from .routers.admin import main
app.include_router(main.router)

from .routers.admin import cate
app.include_router(cate.router)

from .routers.admin import setup
app.include_router(setup.router)

from .routers.admin import board
app.include_router(board.router)

from .routers.admin import posts
app.include_router(posts.router)

from .routers.admin import reserve
app.include_router(reserve.router)

from .routers.admin.medical import category
app.include_router(category.router)

from .routers.admin.medical import doctor
app.include_router(doctor.router)

from .routers.admin import intranet
app.include_router(intranet.router)

from .routers.admin import log
app.include_router(log.router)

# ==== end admin ==== 