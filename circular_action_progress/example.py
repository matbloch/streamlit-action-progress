import streamlit as st
import time
from circular_action_progress import circular_action_progress

st.title("Circular Progress Indicator Demo")
st.write("This demo showcases a circular progress indicator with smooth transitions.")

# Basic usage section
st.header("Basic Progress")

# Add controls
col1, col2 = st.columns([3, 1])

with col2:
    if 'running' not in st.session_state:
        st.session_state.running = False
        st.session_state.progress_value = 0
    
    if st.button("Start" if not st.session_state.running else "Reset"):
        st.session_state.running = not st.session_state.running if st.session_state.running else True
        st.session_state.progress_value = 0
    
    if st.button("Stop", disabled=not st.session_state.running):
        st.session_state.running = False

# Create progress indicator with a persistent key
with col1:
    progress = circular_action_progress(
        value=st.session_state.progress_value,
        size=100, 
        thickness=8,
        color="#FF5722",
        label=f"Progress: {st.session_state.progress_value}%" if st.session_state.progress_value > 0 else "Progress",
        key="smooth_progress"  # Key helps reduce flickering
    )

# Update progress
if st.session_state.running:
    # Use a value in session_state that persists between reruns
    if st.session_state.progress_value < 100:
        # Update progress value smoothly
        st.session_state.progress_value += 1
        
        # Small delay to control speed
        time.sleep(0.2)
        
        # Use Streamlit's rerun to update the progress
        st.rerun()
    else:
        st.session_state.running = False

# Additional examples
st.header("Customization Options")
col1, col2, col3 = st.columns(3)

with col1:
    st.subheader("Indeterminate")
    circular_action_progress(
        indeterminate=True,
        size=60,
        thickness=5,
        color="#2196F3",
        label="Loading...",
        key="indeterminate_progress"
    )

with col2:
    st.subheader("Custom Size")
    circular_action_progress(
        value=75,
        size=80,
        thickness=10,
        color="#4CAF50",
        label="Large Progress",
        key="custom_size_progress"
    )

with col3:
    st.subheader("Custom Colors")
    circular_action_progress(
        value=50,
        size=60,
        thickness=5,
        color="#9C27B0",
        track_color="#F3E5F5",
        label="Custom Colors",
        key="custom_color_progress"
    )

# Documentation
st.header("Tips for Smooth Progress Updates")
st.write("""
### Reducing Flickering:
1. Always use a consistent `key` parameter for your component
2. Keep component rerenders to a minimum
3. Use session_state to track progress values
4. Adjust the sleep time to control update speed

The circular progress component has smooth transitions built in,
so even incremental updates should appear fluid.
""")

st.code("""
# Example of smooth progress updates
if running:
    # Update progress value
    st.session_state.progress_value += 1
    
    # Update component with new value
    progress = circular_action_progress(
        value=st.session_state.progress_value,
        key="your_progress_key"  # IMPORTANT: Use consistent key
    )
    
    # Control update speed
    time.sleep(0.05)
    
    # Rerun to update progress
    st.rerun()
""") 