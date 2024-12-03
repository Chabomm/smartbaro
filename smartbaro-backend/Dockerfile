FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /usr/src/app

ENV PROFILE PROFILE
ENV HOST_IP HOST_IP

COPY ./requirements.txt /usr/src/app/requirements.txt

RUN ls

RUN pip install --no-cache-dir --upgrade -r /usr/src/app/requirements.txt

COPY . . 

CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "5000"]