import openai, os
from dotenv import load_dotenv
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')
try:
    r = openai.chat.completions.create(model='gpt-4o-mini', messages=[{'role':'user','content':'hola'}], max_tokens=50)
    print('OK:', r.choices[0].message.content)
except Exception as e:
    print('ERROR:', e)