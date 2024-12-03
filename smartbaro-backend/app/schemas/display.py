from typing import List, Dict, Any, Union, Optional
from datetime import date, datetime, time, timedelta

from app.schemas.schema import *

class MainCate(BaseModel):
    cuid: Optional[int] = Field(0, title="카테고리 고유번호")
    cate_name: Optional[str] = Field(None, title="카테고리 명", max_length=50)
    cate_icon: Optional[str] = Field(None, title="카테고리 이미지", max_length=255)
    cate_sort: Optional[int] = Field(None, title="카테고리 순서")
    table_name: Optional[str] = Field(None, title="테이블이름", max_length=50)
    table_uid: Optional[int] = Field(None, title="해당 테이블의 uid")
    is_reserve: Optional[str] = Field(None, title="is_reserve", max_length=1)
    sort_array: Optional[List[int]] = Field([], title="변경할 카테고리 순서")
    mode: Optional[str] = Field(0, title="REG/MOD/DEL")
    class Config:
        orm_mode = True

class MainCateListInput(BaseModel):
    site_id: str = Field("", title="프로젝트", max_length=50)
    area: str = Field("", title="영역", max_length=20)

class MainBannerTxt(BaseModel):
    banner_uid: int = Field(0, title="T_MAIN_BANNER uid")
    txt1: Optional[str] = Field(None)
    txt2: Optional[str] = Field(None)
    txt3: Optional[str] = Field(None)
    txt4: Optional[str] = Field(None)
    txt5: Optional[str] = Field(None)
    class Config:
        orm_mode = True

class MainBanner(MainCate, MainBannerTxt):
    mode: Optional[str] = Field(0, title="REG/MOD/DEL")
    uid: int = Field(None, title="배너 고유번호")
    main_uid: Optional[int] = Field(None, title="T_MAIN의 uid")
    site_id: Optional[str] = Field(None, title="프로젝트", max_length=50)
    area: str = Field(None, title="영역", max_length=20)
    area_class: Optional[str] = Field(None, title="플랫폼", max_length=1)
    cate_uid: Optional[int] = Field(None, title="T_MAIN_CATE uid")
    banner_uid : Optional[int] = Field(None)
    banner_name: Optional[str] = Field(None, title="배너명", max_length=50)
    banner_src: Optional[str] = Field(None, title="배너 이미지", max_length=255)
    link_type: Optional[str] = Field(None, title="링크타입", max_length=10)
    link: Optional[str] = Field(None, title="링크", max_length=255)
    sort: Optional[int] = Field(None, title="배너 순서")
    is_display : str = Field("T", title="표시여부", max_length=1)
    create_at: Optional[datetime] = Field(None, title="등록일")
    delete_at : Optional[datetime] = Field(None, title="삭제일")
    update_at : Optional[datetime] = Field(None, title="수정일")
    sort_array  : Optional[List[int]] = Field([], title="변경할 배너 순서")
    class Config:
        orm_mode = True

class MainBannerOutput(MainBanner, Status):
    class Config:
        orm_mode = True

class MainBannerListInput(BaseModel):
    cate_uid: int = Field(0, title="main cate uid")
    site_id: str = Field("", title="프로젝트", max_length=50)
    area: str = Field("", title="영역", max_length=20)

class MainBannerListOutput(Status):
    list: List[MainBanner] = Field([], title="MainBanner list")
    # list: List[Dict[MainBanner, MainCate]] = Field([], title="MainBanner list")
    class Config:
        orm_mode = True

class BannerReadOutput(Status) :
    cuid: Optional[int] = Field(0)
    cate_name: Optional[str] = Field("")
    cate_icon: Optional[str] = Field("")
    cate_sort: Optional[int] = Field(0)
    table_name: Optional[str] = Field("")
    table_uid: Optional[int] = Field(0)
    uid: Optional[int] = Field(0)
    main_uid: Optional[int] = Field(0)
    site_id: Optional[str] = Field("")
    area: Optional[str] = Field("")
    area_class: Optional[str] = Field("A")
    cate_uid: Optional[int] = Field(None)
    banner_name: Optional[str] = Field("")
    banner_src: Optional[str] = Field("")
    link_type: Optional[str] = Field("inside")
    link: Optional[str] = Field("")
    sort: Optional[int] = Field(0)
    create_at: Optional[datetime] = Field(None)
    delete_at: Optional[datetime] = Field(None)
    update_at: Optional[datetime] = Field(None)
    is_display: Optional[str] = Field("T")
    banner_uid: Optional[int] = Field(0)
    txt1: Optional[str] = Field("")
    txt2: Optional[str] = Field("")
    txt3: Optional[str] = Field("")
    txt4: Optional[str] = Field("")
    txt5: Optional[str] = Field("")

class CateInputAdmin(BaseModel) :
    table_name: str = Field("", title="테이블이름", max_length=50)
    table_uid: int = Field(0, title="table_name 테이블의 uid")
    cuid: Optional[int] = Field(0, title="T_CATEGORY의 uid")

class CateReadOutput(Status) :
    cuid: Optional[int] = Field(0)
    cate_name: Optional[str] = Field("")
    cate_icon: Optional[str] = Field("")
    cate_sort: Optional[int] = Field(0)
    table_name: Optional[str] = Field("")
    table_uid: Optional[int] = Field(0)

class CateInput(AppModel):
    uid: int
    cate_uid: Optional[List[int]] = Field([], title="category uids")
    class Config:
        orm_mode = True


class CateTableInput(Status):
    table_name: str = Field("", title="테이블이름", max_length=50)

class DashboardIntranetInput(AppModel):
    instranet_tab: Optional[int]
    class Config:
        orm_mode = True