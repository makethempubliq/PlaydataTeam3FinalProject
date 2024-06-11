# base image 설정
FROM python:3.11-slim

COPY requirements.txt /app/

COPY . /app
# 작업 디렉토리 설정
WORKDIR /app

# 패키지 설치
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


CMD ["python", "main.py", "--host=0.0.0.0"]
