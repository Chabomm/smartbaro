from typing import List, Dict, Any, Union, Optional
from datetime import date, datetime, time, timedelta

from app.schemas.schema import *

class DoctorDetail(BaseModel):
    uid: int = Field(0, title="의료진 고유번호")
    cate_uid: Optional[List[int]] = Field([], title="카테고리 uid")
    name: Optional[str] = Field(None, title="이름", max_length=10)
    position: Optional[str] = Field(None, title="직책", max_length=10)
    thumb: Optional[str] = Field(None, title="사진", max_length=255)
    profile: Optional[str] = Field(None, title="프로필 이미지", max_length=255)
    field_keyword: Optional[str] = Field(None, title="전문분야 키워드", max_length=100)
    field_spec: Optional[str] = Field(None, title="전문분야 전체", max_length=500)
    career: Optional[str] = Field(None, title="경력", max_length=500)
    subject: Optional[str] = Field(None, title="제목", max_length=20)
    contents: Optional[str] = Field(None, title="내용", max_length=3000)
    info_sort: Optional[int] = Field(None, title="상세정보 순서")
    am_week_1: Optional[str] = Field(None, title="월요일 오전", max_length=5)
    am_week_2: Optional[str] = Field(None, title="화요일 오전", max_length=5)
    am_week_3: Optional[str] = Field(None, title="수요일 오전", max_length=5)
    am_week_4: Optional[str] = Field(None, title="목요일 오전", max_length=5)
    am_week_5: Optional[str] = Field(None, title="금요일 오전", max_length=5)
    pm_week_1: Optional[str] = Field(None, title="월요일 오후", max_length=5)
    pm_week_2: Optional[str] = Field(None, title="화요일 오후", max_length=5)
    pm_week_3: Optional[str] = Field(None, title="수요일 오후", max_length=5)
    pm_week_4: Optional[str] = Field(None, title="목요일 오후", max_length=5)
    pm_week_5: Optional[str] = Field(None, title="금요일 오후", max_length=5)
    doctor_schedule_reset: Optional[bool] = Field(None, title="시간표 존재 여부")
    sort_array: Optional[List[int]] = Field([], title="변경할 의료진 순서")
    mode: Optional[str] = Field(0, title="REG/MOD/DEL")
    class Config:
        orm_mode = True

class DoctorInfo(Status):
    uid: int = Field(0, title="의료진 상세 고유번호")
    doctor_uid: Optional[int] = Field(None, title="의료진 uid")
    subject: Optional[str] = Field(None, title="제목", max_length=20)
    contents: Optional[str] = Field(None, title="내용", max_length=3000)
    sort_array: Optional[List[int]] = Field([], title="변경할 의료진 상세 순서")
    mode: Optional[str] = Field(0, title="REG/MOD/DEL")
    class Config: 
        orm_mode = True

