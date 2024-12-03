from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from fastapi.responses import RedirectResponse, JSONResponse
from inspect import currentframe as frame
from fastapi.encoders import jsonable_encoder

from app.core import exceptions as ex
from app.core import util
from app.core.config import PROXY_PREFIX, api_same_origin
from app.models.board import *
from app.schemas.admin.board import *
from app.schemas.admin.auth import *
from app.deps.auth import get_password_hash
from app.service.log_service import *

from app.service import board_service as front_board_service

router = APIRouter(
    prefix=PROXY_PREFIX,
    tags=["/board"],
)

# /be/front/posts/init
@router.post("/front/posts/init", dependencies=[Depends(api_same_origin)])
async def 프론트_게시물_init (
     request : Request
    ,pRead: PRead
):  
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    
    jsondata = {}

    if util.checkNumeric(pRead.uid) == 0 :
        return ex.ReturnOK(404, "페이지를 불러오는데 실패하였습니다.", request)
    
    elif (util.checkNumeric(pRead.uid) != 1 
          and util.checkNumeric(pRead.uid) != 2
          and util.checkNumeric(pRead.uid) != 3
          and util.checkNumeric(pRead.uid) != 4
          and util.checkNumeric(pRead.uid) != 5
          and util.checkNumeric(pRead.uid) != 6
          and util.checkNumeric(pRead.uid) != 7
          and util.checkNumeric(pRead.uid) != 9
          and util.checkNumeric(pRead.uid) != 10 ) :
        return ex.ReturnOK(405, "페이지를 불러오는데 실패하였습니다.", request)

    # [ S ] 게시판 정보
    board = front_board_service.board_read(request, pRead.uid) 
    request.state.inspect = frame()

    if board is None :
        return ex.ReturnOK(406, "페이지를 불러오는데 실패하였습니다.", request)
    
    if board.is_display != "T" :
        return ex.ReturnOK(407, "페이지를 불러오는데 실패하였습니다.", request)

    jsondata.update({"board": dict(zip(board.keys(), board))})

    params = {
         "board_uid" : pRead.uid
        ,"page" : 1
        ,"page_view_size": 30
        ,"page_size": 0
        ,"page_total": 0
        ,"page_last": 0
        ,"filters": {}
    }
    jsondata.update({"params": params})

    filter = {}

    filter.update({"skeyword_type": [
        {"key": '', "value": '제목+본문'},
        {"key": 'title', "value": '제목'},
        {"key": 'contents', "value": '본문내용'},
        {"key": 'create_name', "value": '작성자'}
    ]})

    if board.board_type == "qna" :
        filter.update({"state": [
            {"key": '100', "value": '미답변'},
            {"key": '200', "value": '답변완료'},
            {"key": '300', "value": '공지'},
        ]})
    else :
        filter.update({"state": []})

    jsondata.update({"filter": filter})

    return ex.ReturnOK(200, "", request, jsondata)

# /be/front/posts/list
@router.post("/front/posts/list", dependencies=[Depends(api_same_origin)])
async def 게시물_리스트(
     request : Request
    ,postsListInput: PostsListInput
):  
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    if not postsListInput.page or int(postsListInput.page) == 0:
        postsListInput.page = 1
    
    if not postsListInput.page_view_size or int(postsListInput.page_view_size) == 0 :
        postsListInput.page_view_size = 30

    posts = front_board_service.posts_list(request, postsListInput) 
    request.state.inspect = frame()

    return posts

# /be/front/posts/read
@router.post("/front/posts/read", dependencies=[Depends(api_same_origin)])
async def 게시물_상세(
     request: Request
    ,response: Response
    ,postsInput : PostsInput
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)

    board = Board()
    person = {}
    files = []
    replys = {}
    replys["list"] = []
    prev_next = {}
    prev_next["prev_posts"] = {}
    prev_next["next_posts"] = {}

    # [ S ] 비밀번호 체크 
    if postsInput.password is not None and postsInput.password != "" :
        cbfp = check_block_fail_password(request, "T_BOARD_POSTS_PERSON", postsInput.posts_uid)
        request.state.inspect = frame()
        if cbfp is not None and cbfp.fail_count >= 5 :
            if cbfp.ten_min >= 0 : # 10분 아직 안지남
                return ex.ReturnOK(300, "비밀번호를 5회연속 틀렸습니다.\n10분간 사용이 제한됩니다.", request)
            else : # 10분 지남
                reset_block_fail_password(request, "T_BOARD_POSTS_PERSON", postsInput.posts_uid)
                request.state.inspect = frame()
    # [ E ] 비밀번호 체크 
                
    values = {}

    if postsInput.posts_uid == 0 : # 글등록
        posts = Posts()
        if postsInput.values_type == "voc" : # 고객의 소리 /bbs/voc
            values = {
                "board_uid" : 10
                ,"name": ""
                ,"mobile": ""
                ,"email": ""
                ,"title": ""
                ,"contents": ""
                ,"is_agree": False
            }
        elif postsInput.values_type == "medical" : # 전문의상담 /medical/4/reg
            values = {
                 "board_uid" : 9
                ,"name": ""
                ,"password": ""
                ,"mobile": ""
                ,"email": ""
                ,"title": ""
                ,"contents": ""
                ,"is_agree": False
            }


    else :
        posts = front_board_service.posts_read(request, postsInput.posts_uid)
        request.state.inspect = frame()

        if posts is None :
            return ex.ReturnOK(404, "게시물을 찾을 수 없습니다.", request)

        board = front_board_service.board_read(request, posts.board_uid) 
        request.state.inspect = frame()

        if postsInput.posts_uid != 0 and board is None :
            return ex.ReturnOK(406, "페이지를 불러오는데 실패하였습니다.", request)
        
        if postsInput.posts_uid != 0 and board.is_display != "T" :
            return ex.ReturnOK(407, "페이지를 불러오는데 실패하였습니다.", request)
    
        if board.board_type != "qna" :
            prev_next = front_board_service.read_prev_next_posts(request, postsInput.posts_uid, posts.board_uid)
            request.state.inspect = frame()

        else : # 문의 게시물은 다음글 이전글 비노출
            prev_next = {}
            prev_next["prev_posts"] = {}
            prev_next["next_posts"] = {}
        
            person = front_board_service.posts_person_read(request, postsInput.posts_uid)
            request.state.inspect = frame()

            person = dict(zip(person.keys(), person))
            person["name"] = util.fn_masking_user_name(person["name"] if "name" in person else "")
            person["email"] = util.fn_masking_user_email(person["email"] if "email" in person else "")
            person["mobile"] = util.fn_masking_user_mobile(person["mobile"] if "mobile" in person else "")

            pw_vaild_res = front_board_service.pass_vaild(request, postsInput)
            request.state.inspect = frame()

            if pw_vaild_res is None : # 비밀번호 틀림
                fail_count = create_fail_password(request, "T_BOARD_POSTS_PERSON", postsInput.posts_uid, postsInput.password)
                request.state.inspect = frame()
                # log insert를 해야되서 200 code 리턴.

                fail_password_history(request, "T_BOARD_POSTS_PERSON", postsInput.posts_uid, postsInput.password)
                request.state.inspect = frame()

                return ex.ReturnOK(200, "비밀번호가 일치하지 않습니다. ("+str(fail_count)+"/5)\n5회 연속 다른 경우, 서비스 사용이 제한됩니다.", request)
            else :
                reset_block_fail_password(request, "T_BOARD_POSTS_PERSON", postsInput.posts_uid)
                request.state.inspect = frame()
    
            
            files = front_board_service.posts_files_list(request, postsInput.posts_uid) 
            request.state.inspect = frame()

            if board.is_comment == "T" :
                replys = front_board_service.posts_reply_list(request, postsInput.posts_uid) 
                request.state.inspect = frame()
            else :
                replys = {"list":[]}

    jsondata = {}
    jsondata.update(jsonable_encoder(posts))
    if "create_at" in jsondata and jsondata["create_at"] != "" :
        jsondata.update( {"create_at": util.mysqlDateTimeToYYYY_MM_DD(jsondata["create_at"])} )
    jsondata.update({"board": board})
    jsondata.update({"person": person})
    jsondata.update({"files": files})
    jsondata.update({"replys": replys["list"]})
    jsondata.update({"prev_posts": prev_next["prev_posts"]})
    jsondata.update({"next_posts": prev_next["next_posts"]})

    if postsInput.posts_uid == 0 :
        jsondata.update({"values": values})

    return ex.ReturnOK(200, "", request, jsondata, False)

# /be/front/posts/create
@router.post("/front/posts/create", dependencies=[Depends(api_same_origin)])
async def 프론트_게시글_등록 (
     request: Request
    ,posts: CreatePosts
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    
    if posts.password is not None : 
        password_hash = get_password_hash(posts.password)
        request.state.inspect = frame()
        posts.password = password_hash

    res = front_board_service.posts_create(request, posts)
    request.state.inspect = frame()
    return ex.ReturnOK(200, "등록이 완료되었습니다.", request, {"uid" : res.uid})

























