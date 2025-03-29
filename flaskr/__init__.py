import os
from google import genai 

from dotenv import load_dotenv

from flask import Flask

from flask import render_template,request,jsonify

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
            return request.form
        
        return render_template('index.html')
    
    @app.route('/api/chat', methods=['POST'])
    def chat():
        load_dotenv('keys.env')
        # Get API key from environment variable
        key = os.getenv('GEMINI_KEY')
        print(key)
        # Get user message from request
        user_message = request.json.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        
        client = genai.Client(api_key=key)
        
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=user_message
        )
        
        # Extract the AI's response
        return jsonify({'response':response.text})
            
        '''      
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        '''
    from . import db
    db.init_app(app)
    return app