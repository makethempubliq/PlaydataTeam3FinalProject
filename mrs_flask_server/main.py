
from TagExtractor import extract_keywords, kor_to_en
from SongRecommender import main_recommend_with_knn
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer 
import logging, csv, yaml, boto3, io

app = Flask(__name__)   
CORS(app)
# Configure logging
logging.basicConfig(level=logging.INFO)
# SBERT 모델 로드

with open('s3config.yaml', 'r') as f:
    config = yaml.safe_load(f)

s3_client = boto3.client(
    service_name=config['service_name'],
    region_name=config['region_name'],
    aws_access_key_id=config['access_key'],
    aws_secret_access_key=config['secret_key']
)
bucket_name = config['bucket_name']

predefined_embeddings = {}
model = None

def load_model():
    global predefined_embeddings
    global model
    model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key="data/taglist.csv")
        print(response)
        reader = csv.reader(io.StringIO(response["Body"].read().decode('cp949')))
        print(reader)
        tag_list = next(reader)
        
    except Exception as e:
        print(f"Error: {e}")
    predefined_embeddings = {kw: model.encode(kw) for kw in tag_list}
    # with open(r"resources\static\data\taglist.csv", "r") as file:
    #     reader = csv.reader(file)
    #     tag_list = next(reader)
    # predefined_embeddings = {kw: model.encode(kw) for kw in tag_list}

# 애플리케이션 시작 시 모델 불러오기
load_model()

@app.route('/api/v1/flask/themeselect', methods=['POST'])
def theme_select():
    payload = request.get_json()
    input_text = payload.get('inputText')
    total_duration = int(payload.get('totalDuration'))
    logging.info("tokenizing..........")
    tokenized_theme = extract_keywords(model, predefined_embeddings, input_text)
    track_counts = total_duration//3 
    
    response = {
        "tokenizedTheme": tokenized_theme,
        "trackCounts": track_counts,
    }

    return jsonify(response), 200

@app.route('/api/v1/flask/gettracks', methods=['POST'])
def get_recommended_tracks():
    payload = request.get_json()
    tokenized_theme = payload.get('tokenizedTheme')                                         
    track_counts = payload.get('trackCounts')
    en_tokenized_theme = kor_to_en(tokenized_theme)
    logging.info("recommending..........")
    track_uris = main_recommend_with_knn(tokenized_theme, track_counts)
    track_uris = ["spotify:track:"+i for i in track_uris]
    response = {
        "tokenizedTheme": tokenized_theme,
        "trackUris": track_uris,
        "entokenizedTheme": en_tokenized_theme
    }
    return jsonify(response), 200

@app.route('/', methods=['GET'])
def test():
    return "testsuccess"

if __name__ == '__main__':
    app.run(debug=True)
