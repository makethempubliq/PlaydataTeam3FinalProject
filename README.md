![logo](./img/logo.png)
# AI기반 플레이리스트 생성 서비스 RhythmiQ

### 요약

> SBERT와 KNN 알고리즘을 이용해 입력 받은 문장을 테마로 변환해 해당 테마의 음악 플레이리스트를 생성해줍니다.
> 생성된 테마로 Stable Diffusion을 이용해 플레이리스트 커버 이미지를 생성해줍니다.

<br/>

### 팀원 구성

>신원식 - 팀장, 백엔드, CI/CD [github](https://github.com/makethempubliq)  
권민기 - 프론트엔드, 자연어 처리, 데이터 전처리 및 분석 [github](https://github.com/SophieKwonn)  
김재원 - 데이터 수집 및 분석, 추천 알고리즘 개발 [github](https://github.com/jaewon9325)

<br/>

### 기술 스택
- Language : JAVA, Python
- Front-End : HTML, JavaScript, CSS
- Back-End : Spring Boot, FLASK
- CI/CD : AWS ECR, ECS, S3, Route 53, Certificate Manager, Code Pipeline
- Collaborate Tools : Github, Slack

<br/>

### 개발 기간
- **2024-04-08 ~ 2024-06-24**

## 기획

### 개발 배경
최신 음악 감상 트렌드는 다운로드에서 스트리밍으로 변화하였고, 단일 트랙보다 플레이리스트의 이용이 증가하는 추세이며, 기존 플레이리스트 추천 서비스(Youtube 기준)는 유저의 선호도만으로 추천해주며 재생 길이 설정에 한계점이 있음을 파악했다.

### 개발 목적
'여행갈 때', '카페에서 공부할 때' 듣는 뮤직 플레이리스트처럼 사용 목적에 맞게 테마 기반으로 곡을 추천해주고, 재생 시간을 사용자의 편의에 맞게 설정할 수 있는 플레이리스트 생성 서비스를 개발했다.

### 기대 효과
기대효과기기대대대

<br/>

## 사용 데이터
카카오 아레나 3회 대회 Train 데이터 사용 - https://github.com/kakao/recoteam/discussions/9

<br/>

## 데이터 전처리

<br/>

## 사용 모델
### KR-SBERT-V40K-klueNLI-augSTS - 입력 문장에서 테마 추출
>
### Stable Diffusion-XL 1.0-base - 플레이리스트 커버 이미지 생성
https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0 API 호출 방식으로 사용<br/>
테마 목록을 입력 값으로 사용
### K-Nearist-Neighbor - 테마 기반 플레이리스트 생성
프로젝트에서 KNN모델은 플레이리스트와 곡 간의 관계를 나타내는 희소 행렬을 생성한다.
이 행렬은 플레이리스트와 곡의 포함 여부를 나타내며, KNN 모델의 입력으로 사용된다.
코사인 유사도를 사용하여 각 곡 간의 유사성을 측정하고, 가장 유사한 곡들을 찾아낸다.<br/><br/>
**추천 알고리즘 설명**
>1. 추천해야하는 트랙 수의 50%는 입력 테마가 속한 플레이리스트 중에서 소속 빈도 수가 높은 순으로 추출
>2. 나머지 50%는 입력 테마가 속한 플레이리스트의 모든 트랙에서 랜덤하게 선정
>3. 랜덤하게 선정한 트랙들에 KNN모델을 사용하여 각 트랙들과 유사한 곡 추출 (최종 결과에 무작위성 부여)


<br/>

## 시스템 구성도

![시스템 구성도](./img/시스템%20구성도.png)

**Spring Boot** 웹 서버, 테마 추출 및 플레이리스트 생성용 **Flask** 서버
, **Spotify API**, Hugging Face **Stable Diffusion API**로 구성
<br/>

## 서비스 흐름도

![서비스 흐름도](./img/서비스%20흐름도.png)  
사용자가 듣고 싶은 플레이리스트를 문장으로 입력시 문장을 SBERT를 이용해 테마 리스트로 변환, 해당 테마로 플레이리스트와 커버 이미지를 생성
<br/>

## 구동 방법
### Base
1. 앱 생성 및 Client id 및 Client Secret 발급 - https://developer.spotify.com/dashboard
2. Redirect URI 등록 - http://localhost:8080/login/oauth2/authorization/spotify
3. AWS S3 Bucket 생성 및 데이터 파일 업로드 (경로 : 버킷명/data/) - https://drive.google.com/file/d/1DJn5bCax02uh1avpYloX3rsYaIAjUIlD/view?usp=drive_link, https://drive.google.com/file/d/1fVD-cOsX4X0kJN8t96yRLZhxPfIL59s0/view?usp=drive_link
4. Hugging Face API Accesstoken 발급
### Spring main server
1. SpotifyService.java, application.yml, diffuser.js 환경에 맞게 수정
2. MrsSpringWebApplication.java 실행
### Flask Model server
1. requirement.txt 라이브러리 설치 - pip install -r requirements.txt
2. s3config.yaml 파일 환경에 맞게 수정
3. main.py 실행


<br/>

## 실행 화면

### 생성하고 싶은 플레이리스트의 문장과 재생 시간을 입력
![](./img/문장%20입력.png)
### 생성된 플레이리스트 및 커버 이미지, 플레이리스트 재생
![](./img/노래%20재생.png)
<br/>

## 배포

![](./img/배포%20프로세스.png)
1. Github와 AWS CodePipeline 연동해서 Git push시 Docker Build
2. AWS ECR에 이미지 저장
3. AWS ECS Cluster에 Spring Boot, Flask 각각의 서비스 생성(Load Balencer 할당) 및 배포
4. AWS Route 53으로 각각의 Load Balencer DNS주소에 구입한 도메인 주소 할당
5. AWS Certificate Manager로 도메인 주소에 SSL 인증

접속 주소 (임시) - https://anonyq.site

>※ 배포시 Spring Boot, Flask의 buildspec.yml을 환경에 맞게 수정해주세요.

## 참조문헌


