# Streamlit Action Progress

> A circular process indicator featuring various styling options and multiple states.



![](https://raw.githubusercontent.com/matbloch/streamlit-action-progress/master/preview.png)

## Installation

```bash
pip install streamlit-action-progress
```





## 🛠️ Development

### Environment setup

**Requirements**

- Python 3.7 or higher installed.

**01. Setup a virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate
```

**02. Install streamlet**

```bash
pip install streamlet
```


**03. Install requirements for frontend**

```bash
cd streamlit_action_progress/frontend
npm install
```

**03. Run frontend dev server and python Streamlet component**

Inside `streamlit_action_progress/frontend`

```bash
npm start
```

```bash
pip install -e .
streamlet run streamlit_action_progress/example.py
```



**04. Open test website**

- Local URL: http://localhost:8501


### 📦 Building a Python wheel

01. Change the release flag in `streamlit_action_progress/__init__.py` to `True`

```python
_RELEASE = True
```

02. Compile the frontend

Inside `streamlit_action_progress/frontend`

```bash
npm run build
```


1.   Build the wheel

```bash
python setup.py sdist bdist_wheel
```

04. Publish to PyPi
```bash
twine upload dist/*
```