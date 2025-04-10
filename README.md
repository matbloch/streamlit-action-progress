# streamlit-custom-component

Streamlit component that allows you to do X

## Installation instructions

```sh
pip install streamlit-custom-component
```


### 🛠️ Development setup

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
cd my_component/frontend
npm install
```

**03. Run frontend dev server and python Streamlet component**

```bash
npm start
```

```bash
pip install -e .
streamlet run streamlit_picture_in_picture_video/example.py
```



**04. Open test website**

- Local URL: http://localhost:8501



### 📦 Building a Python wheel

01. Change the release flag in `streamlit_picture_in_picture/__init__.py` to `True`

```python
_RELEASE = True
```

02. Build the wheel

```bash
python setup.py sdist bdist_wheel
```

03. Publish to PyPi
```bash
twine upload dist/*
```