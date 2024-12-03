from fastapi import Response, Request

PROXY_PREFIX = "/be"

EMAIL_FROM = "noreply@indend.co.kr"
EMAIL_SERVER = 'smtp.office365.com'
EMAIL_PORT = 587
EMAIL_USER = "security@indend.co.kr"
EMAIL_PASS = ""

def api_same_origin(
    request:Request,
    response:Response):

    # if request.headers.get('sec-fetch-site') == "same-origin" :
    #     print ("api_same_origin OK")

    # elif request.headers.get('host') == "backend:5000" :
    #     print ("api_same_origin OK")

    # else :
    #     print ("api_same_origin 비정상적인 호출")

    return True
