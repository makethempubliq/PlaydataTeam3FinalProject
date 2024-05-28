from TagExtractor import extract_keywords, kor_to_en
from script import main_recommend
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import logging, csv

app = Flask(__name__)
CORS(app)
# Configure logging
logging.basicConfig(level=logging.INFO)
# SBERT 모델 로드

predefined_embeddings = {}
model = None

def load_model():
    global predefined_embeddings
    global model
    model = SentenceTransformer('snunlp/KR-SBERT-V40K-klueNLI-augSTS')
    with open(r"resources\static\data\taglist.csv", "r") as file:
        reader = csv.reader(file)
        tag_list = next(reader)
    predefined_embeddings = {kw: model.encode(kw) for kw in tag_list}

# 애플리케이션 시작 시 모델 불러오기
load_model()

@app.route('/api/v1/flask/themeselect', methods=['POST'])
def theme_select():
    payload = request.get_json()
    input_text = payload.get('inputText')
    total_duration = int(payload.get('totalDuration'))
    logging.info("tokenizing..........")
    
    # Placeholder for tokenization process
    tokenized_theme = extract_keywords(model, predefined_embeddings, input_text)  # This should be replaced with the actual tokenization logic
    track_counts = total_duration//3  # Determine number of tracks based on duration
    
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

    # Placeholder for track recommendation logic
    track_uris = main_recommend(tokenized_theme, track_counts)  # Add more URIs as needed
    track_uris = ["spotify:track:"+i for i in track_uris]
    response = {
        "tokenizedTheme": tokenized_theme,
        "trackUris": track_uris,
        "entokenizedTheme": en_tokenized_theme
    }

    return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
