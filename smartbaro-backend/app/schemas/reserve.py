from typing import List, Dict, Any, Union, Optional
from datetime import date, datetime, time, timedelta

from app.schemas.schema import *

class Reserve(AppModel):
    uid: int = Field(0, title="예약 고유번호")
    state: Optional[str] = Field("", title="접수/예약/완료/취소", max_length=10)
    doctor_uid: Optional[int] = Field(0, title="의사 uid")
    cate_uid: Optional[int] = Field(0, title="카테고리 uid")
    rev_date: Optional[date] = Field(None, title="예약일")
    rev_time: Optional[str] = Field("", title="예약시간", max_length=5)
    user_name: Optional[str] = Field("", title="예약자 성함", max_length=100)
    mobile: Optional[str] = Field("", title="예약자 전화번호", max_length=20)
    birth: Optional[str] = Field("", title="예약자 생년월일", max_length=15)
    is_first: Optional[str] = Field("", title="초진/재진", max_length=10)
    gender: Optional[str] = Field("", title="예약자 성별", max_length=10)
    post: Optional[str] = Field("", title="우편번호", max_length=6)
    addr: Optional[str] = Field("", title="주소", max_length=100)
    addr_detail: Optional[str] = Field("", title="주소상세", max_length=100)

    class Config:
        orm_mode = True

class ReserveInput(Status):
    uid : Optional[List[int]] = Field([], title="예약 고유번호")
    state : str = Field(None, title="접수/예약/완료/취소", max_length=10)
    # filters: Optional[Dict] = Field(default_factory=dict)
    class Config:
        orm_mode = True

class Docs(BaseModel):
    uid: int = Field(0, title="제증명서류 발급요청 고유번호")
    name: Optional[str] = Field(None, title="환자명", max_length=10)
    post: Optional[str] = Field(None, title="우편번호", max_length=6)
    addr1: Optional[str] = Field(None, title="기본주소", max_length=255)
    addr2: Optional[str] = Field(None, title="상세주소", max_length=255)
    addr3: Optional[str] = Field(None, title="참고항목", max_length=255)
    tel: Optional[str] = Field(None, title="전화번호", max_length=20)
    mobile: Optional[str] = Field(None, title="휴대전화번호", max_length=20)
    proposer: Optional[str] = Field(None, title="신청인", max_length=10)
    proposer_post: Optional[str] = Field(None, title="신청인 우편번호", max_length=6)
    proposer_addr1: Optional[str] = Field(None, title="신청인 기본주소", max_length=255)
    proposer_addr2: Optional[str] = Field(None, title="신청인 상세주소", max_length=255)
    proposer_addr3: Optional[str] = Field(None, title="신청인 참고항목", max_length=255)
    proposer_tel: Optional[str] = Field(None, title="신청인 전화번호", max_length=20)
    proposer_mobile: Optional[str] = Field(None, title="신청인 휴대전화번호", max_length=20)
    password: Optional[str] = Field(None, title="비밀번호", max_length=100)
    relation_type: Optional[str] = Field(None, title="환자와의 관계타입 환자/친족/지정대리인", max_length=10)
    purpose_type: Optional[str] = Field(None, title="신청목적 보험회사/타병원/회사/공공기관/병무청/기타", max_length=100)
    hope_at: Optional[date] = Field(None, title="발급희망일")
    issue_at: Optional[date] = Field(None, title="발급일")
    request: Optional[List[Dict]] = Field([])
    docs_uid: Optional[int] = Field(None, title="발급요청테이블 uid")
    docs_name: Optional[str] = Field(None, title="서류요청부분", max_length=10)
    docs_ea: Optional[int] = Field(None, title="서류수량")
    state: Optional[str] = Field("접수완료", max_length=10)
    class Config:
        orm_mode = True

class DocsRequest(AppModel):
    uid: int = Field(0, title="제증명서류 고유번호")
    docs_uid: Optional[int] = Field(None, title="발급요청테이블 uid")
    docs_name: Optional[str] = Field(None, title="서류요청부분", max_length=10)
    docs_ea: Optional[int] = Field(None, title="서류수량")
    class Config:
        orm_mode = True

class DocsInput(Status):
    name: Optional[str] = Field(None, title="환자명", max_length=10)
    post: Optional[str] = Field(None, title="우편번호", max_length=6)
    addr1: Optional[str] = Field(None, title="기본주소", max_length=255)
    addr2: Optional[str] = Field(None, title="상세주소", max_length=255)
    addr3: Optional[str] = Field(None, title="참고항목", max_length=255)
    tel: Optional[str] = Field(None, title="전화번호", max_length=20)
    mobile: Optional[str] = Field(None, title="휴대전화번호", max_length=20)
    proposer: Optional[str] = Field(None, title="신청인", max_length=10)
    proposer_post: Optional[str] = Field(None, title="신청인 우편번호", max_length=6)
    proposer_addr1: Optional[str] = Field(None, title="신청인 기본주소", max_length=255)
    proposer_addr2: Optional[str] = Field(None, title="신청인 상세주소", max_length=255)
    proposer_addr3: Optional[str] = Field(None, title="신청인 참고항목", max_length=255)
    proposer_tel: Optional[str] = Field(None, title="신청인 전화번호", max_length=20)
    proposer_mobile: Optional[str] = Field(None, title="신청인 휴대전화번호", max_length=20)
    password: Optional[str] = Field(None, title="비밀번호", max_length=100)
    relation_type: Optional[str] = Field(None, title="환자와의 관계타입 환자/친족/지정대리인", max_length=10)
    purpose_type: Optional[str] = Field(None, title="신청목적 보험회사/타병원/회사/공공기관/병무청/기타", max_length=100)
    hope_at: Optional[date] = Field(None, title="발급희망일")
    issue_at: Optional[date] = Field(None, title="발급일")
    request: Optional[List[Dict]] = Field([])
    # docs_uid: Optional[int] = Field(None, title="발급요청테이블 uid")
    # docs_name: Optional[str] = Field(None, title="서류요청부분", max_length=10)
    # docs_ea: Optional[int] = Field(None, title="서류수량", max_length=10)
    class Config:
        orm_mode = True


class DocsReadInput(BaseModel): 
    uid: int = Field(0, title="고유번호")
    password: Optional[str] = Field(None, title="비밀번호", max_length=100)

class DocsAdminInput(Status):
    uid: int = Field(0, title="제증명서류 발급요청 고유번호")
    state : str = Field(None, title="접수/예약/완료/취소", max_length=10)
    issue_at: Optional[date] = Field(None, title="발급일")
    class Config:
        orm_mode = True