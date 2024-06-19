# AI기반 플레이리스트 생성 서비스 RhythmiQ

### 요약

> SBERT와 KNN 알고리즘을 이용해 입력 받은 문장을 테마로 변환해 해당 테마의 음악 플레이리스트를 생성해줍니다.
> 생성된 테마로 Stable Diffusion을 이용해 플레이리스트 커버 이미지를 생성해줍니다.

<br/>

### 팀원 구성

신원식 - 팀장, 백엔드, CI/CD [github](https://github.com/makethempubliq)  
권민기 - 프론트엔드, 자연어 처리, 데이터 전처리 및 분석 [github](https://github.com/SophieKwonn)  
김재원 - 데이터 수집 및 분석, 추천 알고리즘 개발 [github](https://github.com/jaewon9325)

## 연구배경

연구배경 주세요

<br/>

## 사용 모델
### KR-SBERT-V40K-klueNLI-augSTS
입력 문장에서 **테마 추출**
### Stable Diffusion-XL 1.0-base
**플레이리스트 커버 이미지** 생성
https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0 API 호출 방식으로 사용<br/>
발생 비용이 없기에 선정
### K-Nearist-Neighbor
저희 프로젝트에서 KNN모델은 플레이리스트와 곡 간의 관계를 나타내는 희소 행렬을 생성합니다. 
이 행렬은 플레이리스트와 곡의 포함 여부를 나타내며, KNN 모델의 입력으로 사용됩니다.
KNN 모델은 특정 곡과 유사한 다른 곡들을 추천합니다. 
이를 위해 코사인 유사도를 사용하여 각 곡 간의 유사성을 측정하고, 가장 유사한 곡들을 찾아냅니다.

추천모델 로직

1. 절반을 입력한 태그의 플레이리스트에 빈도수가 높은 곡을 인기곡으로 설정.

2. 나머지 절반은 태그의 랜덤곡으로 설정. 

3. 인기곡은 그대로 사용하고 랜덤곡은 KNN모델을 이용하여 랜덤곡의 5배정도의 곡을 KNN으로 추천한 뒤 그 안에서 랜덤으로 더 다양한 추천을 해줄 수 있게 하였다.

4. 최종 추천 결과는 인기곡+KNN 5:5 비율로 추천한 랜덤곡이다.
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
3. AWS S3 Bucket 생성
4. Hugging Face Accesstoken 발급
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
1. Github와 AWS CodePipeline 연동해서 Git pull시 Docker Build
2. AWS ECR에 이미지 저장
3. AWS ECS Cluster에 Spring Boot, Flask 각각의 서비스 생성(Load Balencer 할당) 및 배포
4. AWS Route 53으로 각각의 Load Balencer DNS주소에 구입한 도메인 주소 할당
5. AWS Certificate Manager로 도메인 주소에 SSL 인증

접속 주소 (임시) - https://anonyq.site

※ 배포시 Spring Boot, Flask의 buildspec.yml을 환경에 맞게 수정해주세요.

## 참조문헌


