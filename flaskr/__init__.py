import os
from google import genai 

from google.genai import types
import backend_util

from dotenv import load_dotenv

from flask import Flask,render_template,request,jsonify



def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # a simple page that says hello
    @app.route('/',methods=['POST','GET'])
    def hello():
        
        if request.method == 'POST':
            
            constraints = [0 for i in range(7)]
            nutrients = ['calories','protein','sodium','sugar','fat','fiber','carbs']
            
            for i in range(len(nutrients)):
                if request.form[nutrients[i]] != '':
                    constraints[i] = int(request.form[nutrients[i]])
                
            plans = backend_util.find_best_meal_combinations(3,constraints,'none')
            plans = [i[0] for i in plans]

           
            return render_template('index.html',meal_plans=plans[0:3])
        if 'lat' in request.args:
            lat = request.args.get('lat')
            long = request.args.get('long')
            return render_template('index.html',position = (long,lat))

        
        return render_template('index.html')
    @app.route('/api/location',methods=['POST','GET'])
    def locations():
        return render_template('location.html')
    @app.route('/api/chat', methods=['POST'])
    def chat():
        load_dotenv('keys.env')
        # Get API key from environment variable
        api_key = os.getenv('GEMINI_KEY')
        
        # Get user message and conversation history from request
        user_message = request.json.get('message', '')
        conversation = request.json.get('conversation', [])
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Add the new user message to the conversation
        conversation.append({"role": "user", "parts": [{"text": user_message}]})
        
       
        # Prepare system prompt to guide Gemini's responses
        system_prompt = """
        You are a nutrition assistant helping users set up their meal planning form.
        If the user shares their goals, age, weight, height, gender, or activity level, 
        calculate appropriate nutritional recommendations. For any recommendations,
        return a JSON object with the following structure in addition to your conversational response:
        {"form_updates": {"calories": 2000, "protein": 150, "carbs": 200, "fat": 65, "fiber": 30, "sugar": 40, "sodium": 2000}}
        Only include fields that you have recommendations for. DO NOT mention the json object, simply end your response with the raw JSON.
        Keepy your reasoning for reccomendations under 200 words.
        """
        
        # Call Gemini API with the entire conversation history
        client = genai.Client(api_key=api_key)
    
        ai_response = client.models.generate_content(
        model="gemini-2.0-flash", 
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt)
        )
        ai_response = ai_response.text
        app.logger.debug(f"{ai_response}")
        import re, json

        json_match = re.search(r'({[\s\S]*"form_updates"[\s\S]*})', ai_response)
        form_updates = ""
        if json_match:
            json_str = json_match.group(1)
            updates_data = json.loads(json_str)
            form_updates = updates_data.get('form_updates', {})
            
            # Remove the JSON from the displayed response
            ai_response = ai_response.replace(json_match.group(1), '')
            ai_response = ai_response[:-8]
        
        
        
        conversation.append({"role": "assistant", "parts": [{"text": ai_response}]})
            
        return jsonify({
            'response': ai_response,
            'form_updates': form_updates,
            'conversation': conversation
        })
           
                
        

    from . import db
    db.init_app(app)
    return app