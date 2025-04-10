import streamlit as st
from circular_action_progress import circular_action_progress

# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/example.py`

st.subheader("Component with constant args")


circular_action_progress(value=75)