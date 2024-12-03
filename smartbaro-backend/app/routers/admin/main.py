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

from app.service.admin import main_service
from app.service.admin import cate_service
from app.routers.display import *
from app.routers.doctor import *
from app.routers.board import *
from app.deps.auth import get_current_active_admin

router = APIRouter(
    prefix=PROXY_PREFIX,
    tags=["/admin/main"],
)

# /be/admin/main/list
@router.post("/admin/main/list", dependencies=[Depends(api_same_origin)])
async def 메인영역_리스트(
     request: Request
    ,mainListInput: MainListInput
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    res = main_service.main_list(request, mainListInput) 
    request.state.inspect = frame()

    return res

# /be/admin/main/read
@router.post("/admin/main/read", dependencies=[Depends(api_same_origin)])
async def 메인영역_상세(
    request: Request
    ,pRead : PRead = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "T_MAIN 의 uid",
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
        return Main()
    
    res = main_service.main_read(request, pRead.uid)
    request.state.inspect = frame()

    if res is None :
        return ex.ReturnOK(404, "데이터가 없습니다.", request)
        
    return res

# /be/admin/main/edit
@router.post("/admin/main/edit", dependencies=[Depends(api_same_origin)])
async def 메인영역_편집(
    request: Request
    ,main: Main = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "메인영역 등록예시 01",
                "description": "",
                "value": {
                     "site_id" : "smartbaro"
                    ,"area" : "TEST_BANNER"
                    ,"area_class" : "A"
                    ,"area_name" : "테스트 배너"
                    ,"area_sort" : 0
                    ,"display_type" : "MAIN"
                    ,"cont_type" : "BANNER"
                    ,"mode" : "REG"
                }
            },
            "example02" : {
                "summary": "메인영역 수정예시 01",
                "description": "",
                "value": {
                    "uid" : 3
                    ,"area" : "TEST_BANNER_ASDFADF"
                    ,"area_class" : "B"
                    ,"area_name" : "테스트 배너 수정"
                    ,"area_sort" : 2
                    ,"cont_type" : "TEXT"
                    ,"mode" : "MOD"
                }
            },
            "example03" : {
                "summary": "메인영역 삭제예시 01",
                "description": "",
                "value": {
                    "uid" : 4
                    ,"mode" : "DEL"
                }
            },
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if main.mode == "REG" :
        res = main_service.main_create(request, main)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "메인영역 등록 완료", request, {"uid" : res.uid})

    if main.mode == "MOD" :
        res = main_service.main_update(request, main)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "메인영역 수정 완료", request, {"uid" : res.uid})

    if main.mode == "DEL" :
       res = main_service.main_delete(request, main.uid)
       request.state.inspect = frame()
       return ex.ReturnOK(200, "메인영역 삭제 완료", request, {"uid" : res.uid})
    
# /be/admin/main/create
@router.post("/admin/main/create", dependencies=[Depends(api_same_origin)])
async def 메인영역_생성(
    request: Request
    ,mainCreateInput: MainCreateInput = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "메인생성 예시",
                "description": "",
                "value": {
                     "site_id" : "smartbaro"
                    ,"area" : "MAIN_BANNER"
                    ,"area_class" : "A"
                    ,"display_type": "MAIN"
                }
            },
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)
    try :
        # 파일 folder 생성
        save_folder = "/usr/src/app/resource/main/"
        util.makedirs(save_folder)
        save_name = mainCreateInput.display_type + ".json"

        # 기존 파일 로드
        read_file = open(save_folder+save_name, 'r')

        try :
            befjson = dict(json.loads(read_file.read()))
        except Exception as e:
            befjson = {}

        
        if mainCreateInput.area == "ALL" or mainCreateInput.area == "GNB" :
            result = await 배너_리스트(
                request
                ,MainBannerListInput(
                    cate_uid = 0
                    ,site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "TOP_MENU" :
            result = await 배너_리스트(
                request
                ,MainBannerListInput(
                    cate_uid = 0
                    ,site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "TOP_BANNER" :
            result = await 배너_리스트(
                request
                ,MainBannerListInput(
                    cate_uid = 0
                    ,site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "MAIN_POPUP" :
            result = await 배너_리스트(
                request
                ,MainBannerListInput(
                    cate_uid = 0
                    ,site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "MAIN_BANNER" :
            result = await 배너_리스트(
                request
                ,MainBannerListInput(
                    cate_uid = 0
                    ,site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "MEDICAL_BANNER" :
            result = await 배너_리스트(
                request
                ,MainBannerListInput(
                    cate_uid = 0
                    ,site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result) 

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "MAIN_DOCTOR" :
            result = await 의료진_리스트(
                request
                ,PRead(
                    uid = 0
                )
            )
            for doctor in result["doctor_list"] :
                print(doctor['cate_uid'])
                for category in result["category_list"] :
                    if category['uid'] == doctor['cate_uid'][0] :
                        doctor["cate_name"] = category['cate_name']

            result[mainCreateInput.area+"_LIST"] = result["doctor_list"]
            del result["doctor_list"]
            befjson.update(result) 

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "MAIN_COUNT" :
            result = await 배너_리스트(
                request
                ,MainBannerListInput(
                    cate_uid = 0
                    ,site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "QOOK_TV" :
            result = await 게시물_리스트(
                request
                ,PostsListInput(
                     page = 1
                    ,page_size = 0
                    ,page_view_size = 12
                    ,page_total = 0
                    ,page_last = 0 
                    ,board_uid = mainCreateInput.cont_uid
                    ,cate_uid = 0
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "CONSUMER_CATE" :
            result = await 배너_카테고리_리스트(
                request
                ,MainBannerListInput(
                    site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
        )
            result[mainCreateInput.area+"_CATE_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)  

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "NEWS" :

            result = front_board_service.posts_news_list(
                request
                ,MainPostsListInput(
                     limit = 6
                    ,cate_uid = 0
                    ,board_uid = mainCreateInput.cont_uid
                ) )
            request.state.inspect = frame()
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "MEDIA" :
            result = await 게시물_리스트(
                request
                ,PostsListInput(
                     page = 1
                    ,page_size = 0
                    ,page_view_size = 0
                    ,page_total = 0
                    ,page_last = 0 
                    ,board_uid = mainCreateInput.cont_uid
                    ,cate_uid = 0
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        if mainCreateInput.area == "ALL" or mainCreateInput.area == "FOOTER_PARTNER" :
            result = await 배너_리스트(
                request
                ,MainBannerListInput(
                    cate_uid = 0
                    ,site_id = mainCreateInput.site_id
                    ,area = mainCreateInput.area
                )
            )
            result[mainCreateInput.area+"_LIST"] = result["list"]
            del result["list"]
            befjson.update(result)

        # if mainCreateInput.area == "ALL" or mainCreateInput.area == "NEWS" :
        #     result = await 게시물_리스트(
        #         request
        #         ,PostsListInput(
        #              page = 1
        #             ,page_size = 0
        #             ,page_view_size = 5
        #             ,page_total = 0
        #             ,page_last = 0 
        #             ,board_uid = mainCreateInput.cont_uid
        #             ,cate_uid = 0
        #         )
        #     )
        #     result[mainCreateInput.area+"_LIST"] = result["list"]
        #     del result["list"]
        #     befjson.update(result)   

        # if mainCreateInput.area == "ALL" or mainCreateInput.area == "MEDIA" :
        #     result = await 게시물_리스트(
        #         request
        #         ,PostsListInput(
        #              page = 1
        #             ,page_size = 0
        #             ,page_view_size = 5
        #             ,page_total = 0
        #             ,page_last = 0 
        #             ,board_uid = mainCreateInput.cont_uid
        #             ,cate_uid = 0
        #         )
        #     )
        #     result[mainCreateInput.area+"_LIST"] = result["list"]
        #     del result["list"]
        #     befjson.update(result)   

        save_file = open(save_folder+save_name, "w")  
        json.dump(befjson, save_file, indent=4, default=str)
        save_file.close() 
        
        return ex.ReturnOK(200, "완료되었습니다.", request)
    
    except Exception as e :

        print("eee", e)
        return ex.ReturnOK(500, "오류가 발생하였습니다. 다시 시도하여 주세요", request)


 
# /be/admin/sub/create
@router.post("/admin/main/sub/create", dependencies=[Depends(api_same_origin)])
async def 메인서브_생성(
    request: Request
    ,mainCreateInput: MainCreateInput = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "메인서브_생성 예시",
                "description": "",
                "value": {
                    "area" : "AROUND"
                }
            },
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    try :
        save_folder = "/usr/src/app/resource/main/"
        util.makedirs(save_folder)
        save_name = mainCreateInput.area + ".json"

        result = {}

        banners = await 배너_리스트(request, MainBannerListInput(cate_uid = 0, area = mainCreateInput.area))
        result["BANNER_LIST"] = banners["list"]

        cates = await 배너_카테고리_리스트(request, MainBannerListInput(cate_uid = 0, area = mainCreateInput.area))
        result["CATEGORY_LIST"] = cates["list"]

        save_file = open(save_folder+save_name, "w")  
        json.dump(result, save_file, indent=4, default=str)
        save_file.close() 

        return ex.ReturnOK(200, "완료되었습니다.", request)

    except Exception as e :
        return ex.ReturnOK(500, "오류가 발생하였습니다. 다시 시도하여 주세요", request)


## ========== 배너 start ======== 

# /be/admin/main/banner/list
@router.post("/admin/main/banner/list", dependencies=[Depends(api_same_origin)])
async def 배너_리스트_어드민(
    request: Request
    ,pRead: PRead = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "배너리스트 (T_MAIN의 uid)",
                "description": "",
                "value": {
                     "uid" : 1
                }
            },
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # 영역상세 (T_MAIN)
    main_banner = main_service.main_read(request, pRead.uid)
    request.state.inspect = frame()

    res = main_service.banner_list(request, pRead)
    request.state.inspect = frame()

    # return main_banner, res
    res.update({"main": main_banner})

    return res

# /be/admin/main/banner/read
@router.post("/admin/main/banner/read", dependencies=[Depends(api_same_origin)])
async def 배너_상세정보(
    request: Request
    ,bannerDetailInput: BannerDetailInput = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "배너 상세정보",
                "description": "",
                "value": {
                     "uid" : 18,
                     "main_uid" : 1
                }
            },
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # 카테고리 list
    res_cate = cate_service.cate_list(request, CateInputAdmin(
        table_name= "T_MAIN"
        ,table_uid=bannerDetailInput.main_uid
    ))
    request.state.inspect = frame()
    
    # 메인 상세 (T_MAIN)
    main_banner = main_service.main_read(request, bannerDetailInput.main_uid)

    if bannerDetailInput.uid == 0 :
        jsondata = {}
        jsondata.update({"main_banner": main_banner})
        jsondata.update({"values": BannerReadOutput()})
        jsondata.update({"filter": {}})
        jsondata["filter"] = {"cate_list": res_cate["list"]}
        
        return jsondata
    
    # 배너 정보
    res = main_service.banner_read(request, bannerDetailInput.uid)
    request.state.inspect = frame()

    print(util.toJson(res))

    if res is None :
        return ex.ReturnOK(404, "데이터가 없습니다.", request)
    
    jsondata = {}
    jsondata.update({"main_banner": main_banner})
    jsondata.update({"values": res})
    jsondata.update({"filter": {}})
    jsondata["filter"] = {"cate_list": res_cate["list"]}
        
    return jsondata

# /be/admin/main/banner/edit
@router.post("/admin/main/banner/edit", dependencies=[Depends(api_same_origin)])
async def 배너_편집(
     request: Request
    ,mainBanner: MainBanner = Body(
        ...,
        examples = {
            "example01" : {
                "summary": "배너 등록예시 01",
                "description": "",
                "value": {
                     "mode" : "REG"
                    ,"main_uid" : 3
                    ,"site_id" : "smartbaro"
                    ,"area" : "MAIN_REVIEW"
                    ,"area_class" : "W"
                    ,"banner_name" : "테스트 배너"
                    ,"link_type" : "inside"
                    ,"link" : "asdfasdf"
                    ,"sort" : 1
                }
            },
            "example02" : {
                "summary": "배너 등록예시 02",
                "description": "",
                "value": {
                     "mode" : "REG"
                    ,"main_uid" : 3
                    ,"site_id" : "smartbaro"
                    ,"area" : "CONSUMER"
                    ,"area_class" : "A"
                    ,"cate_uid" : 12
                    ,"banner_name" : "test"
                    ,"txt1" : "배너 텍스트1"
                    ,"txt2" : "배너 텍스트2"
                    ,"txt3" : "배너 텍스트3"
                    ,"txt4" : "배너 텍스트4"
                    ,"txt5" : "배너 텍스트5"
                }
            },
            "example03" : {
                "summary": "배너 수정예시 01",
                "description": "",
                "value": {
                     "mode" : "MOD"
                    ,"uid" : 5
                    ,"main_uid" : 4
                    ,"site_id" : "smartbaro"
                    ,"area" : "MAIN_BENEFIT"
                    ,"area_class" : "A"
                    ,"cate_uid" : 12
                    ,"banner_name" : "도입혜택 TEST"
                    ,"banner_src" : "http://www.welfaredream.com/img/mbenefit/benefit_04.png"
                    ,"sort" : 5
                    ,"is_display" : "F"
                }
            },
            "example04" : {
                "summary": "배너 삭제예시 01",
                "description": "",
                "value": {
                     "mode" : "DEL"
                    ,"uid" : 7
                }
            },
        }
    )
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    if mainBanner.mode == "REG" :
        res = main_service.banner_create(request, mainBanner)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "배너 등록 완료", request, {"uid" : res.uid})

    if mainBanner.mode == "MOD" :
        res = main_service.banner_update(request, mainBanner)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "배너 수정 완료", request, {"uid" : res.uid})

    if mainBanner.mode == "DEL" :
        res = main_service.banner_delete(request, mainBanner.uid)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "배너 삭제 완료", request, {"uid" : res.uid})

    if mainBanner.mode == "SORT" :
        main_service.banner_sort(request, mainBanner)
        request.state.inspect = frame()
        return ex.ReturnOK(200, "순서 수정 완료", request)
    

# /be/admin/dashboard/intranet
@router.post("/admin/dashboard/intranet", dependencies=[Depends(api_same_origin)])
async def 어드민_메인화면_인트라넷게시판 (
     request: Request
    ,dashboardIntranetInput: DashboardIntranetInput
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # 인트라넷 게시판 게시물
    intranet_posts = main_service.dashboard_posts(request, dashboardIntranetInput.instranet_tab) 
    request.state.inspect = frame()

    # 인트라넷 게시판 정보
    intranet_board = main_service.dashboard_intranet_board(request, dashboardIntranetInput.instranet_tab, "intranet") 
    request.state.inspect = frame()

    if intranet_board is None :
        return ex.ReturnOK(404, "게시판이 존재하지 않습니다.", request)

    jsondata = {}
    jsondata.update({"params" : {"instranet_tab" : dashboardIntranetInput.instranet_tab}})
    jsondata.update({"intranet_posts" : intranet_posts})
    jsondata.update({"intranet_board" : intranet_board})

    return jsondata

# /be/admin/dashboard/datas
@router.post("/admin/dashboard/datas", dependencies=[Depends(api_same_origin)])
async def 어드민_메인화면_각종데이터 (
     request: Request
    ,user: TokenDataAdmin = Depends(get_current_active_admin)
):
    request.state.inspect = frame()
    request.state.body = await util.getRequestParams(request)
    user, request.state.user = getTokenDataAdmin(user), getTokenDataAdmin(user)

    # 인트라넷 게시판 게시물 - 사진갤러리
    intranet_gallery = main_service.dashboard_posts(request, 17) 
    request.state.inspect = frame()

    reserve_list = []
    consult_list = []
    voc_list = []
    session_hisyory = []

    # 로그인 이력
    session_hisyory = main_service.dashboard_session_hisyory(request) 
    request.state.inspect = frame()

    if user.role == "admin" :
        # 진료예약 내역
        reserve_list = main_service.dashboard_reserve(request) 
        request.state.inspect = frame()

        # 전문의 상담 게시물
        consult_list = main_service.dashboard_posts(request, 9) 
        request.state.inspect = frame()

        # 고객의 소리 게시물
        voc_list = main_service.dashboard_posts(request, 10) 
        request.state.inspect = frame()

    jsondata = {}
    jsondata.update({"intranet_gallery" : intranet_gallery})
    jsondata.update({"reserve_list" : reserve_list})
    jsondata.update({"consult_list" : consult_list})
    jsondata.update({"voc_list" : voc_list})
    jsondata.update({"session_hisyory" : session_hisyory})
    jsondata.update({"user_id" : user.user_id})
    jsondata.update({"user_name" : user.user_name})

    return jsondata













