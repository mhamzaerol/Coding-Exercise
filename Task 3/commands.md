## Commands To Run Before Execution

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd stockVisualizer
python3 manage.py migrate
python3 manage.py runserver

# To Deactivate The Current Virtual Environment (venv) Run:
deactivate
