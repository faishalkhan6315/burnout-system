from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['StudentHealthDB']
collection = db['user_data']

# Mapping from frontend keys to ML feature names
FIELD_MAPPING = {
    "stress_week": "stress_level",
    "anxiety_frequency": "anxiety_level",
    "sleep_quality": "sleep_quality",
    "depression_frequency": "depression",
    "self_esteem": "self_esteem",
    "physical_fatigue": "mental_health_history",
    "headache_frequency": "headache",
    "study_load": "study_load",
    "academic_satisfaction": "academic_performance",
    "career_worry": "future_career_concerns",
    "deadline_pressure": "deadline_pressure",
    "focus_difficulty": "attention",
    "social_support": "social_support",
    "peer_pressure": "peer_pressure",
    "teacher_comfort": "teacher_student_relationship",
    "bullying_experience": "bullying",
    "environment_peace": "living_conditions",
    "class_activity": "raisedhands",
    "resource_usage": "VisITedResources",
    "hobby_time": "extracurricular_activities"
}

@app.route('/submit-survey', methods=['POST'])
def submit_survey():
    try:
        data = request.json
        
        # Extract user details
        user_id = data.get('user_id', 'STU_001')
        user_name = data.get('user_name', 'Student Name')
        
        # Prepare survey data
        survey_data = {}
        for frontend_key, db_key in FIELD_MAPPING.items():
            # Get value from data, default to 0 if missing
            # Assuming values are arrays like [5] from the frontend slider, take the first element
            value = data.get(frontend_key, [0])
            if isinstance(value, list) and len(value) > 0:
                survey_data[db_key] = value[0]
            else:
                survey_data[db_key] = value
        
        # Create document structure
        document = {
            "user_id": user_id,
            "user_name": user_name,
            "survey_data": survey_data,
            "created_at": datetime.now()
        }

        # Insert into MongoDB
        collection.insert_one(document)

        return jsonify({"message": "Survey submitted successfully"}), 200

    except Exception as e:
        print(f"Error saving survey: {e}")
        return jsonify({"error": "Failed to save survey data"}), 500

if __name__ == '__main__':
    try:
        # Check MongoDB connection
        client.admin.command('ping')
        print("MongoDB Connected successfully!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
    
    app.run(debug=True, port=5001)
