import streamlit as st
import time
from circular_action_progress import circular_action_progress

st.title("Circular Progress Indicator Demo")
st.write("This demo showcases different ways to use the circular progress indicator component.")

# Basic usage section
st.header("Basic Usage")
col1, col2 = st.columns(2)

with col1:
    st.subheader("Static Progress")
    static_value = st.slider("Progress value", 0, 100, 75)
    progress_state = circular_action_progress(
        value=static_value,
        label="Static progress"
    )
    st.write(f"Current value: {progress_state['value']}%")

with col2:
    st.subheader("Indeterminate Progress")
    circular_action_progress(
        indeterminate=True,
        label="Loading..."
    )
    st.write("This progress indicator represents an indeterminate state.")

# Continuous timer progress
st.header("Continuous Timer Progress")
if "timer_progress" not in st.session_state:
    st.session_state.timer_progress = 0
    st.session_state.timer_running = False
    st.session_state.timer_speed = 1.0
    st.session_state.timer_duration = 10  # Default duration in seconds
    st.session_state.timer_start_time = None

col1, col2 = st.columns([3, 1])

with col1:
    # Calculate elapsed time if timer is running
    elapsed_seconds = 0
    remaining_seconds = st.session_state.timer_duration
    
    if st.session_state.timer_running and st.session_state.timer_start_time:
        current_time = time.time()
        elapsed_time = current_time - st.session_state.timer_start_time
        elapsed_seconds = int(elapsed_time % st.session_state.timer_duration)
        remaining_seconds = max(0, st.session_state.timer_duration - elapsed_seconds)
        
        # Calculate progress percentage
        st.session_state.timer_progress = (elapsed_seconds / st.session_state.timer_duration) * 100
    
    # Format time display
    time_display = f"{elapsed_seconds}s / {st.session_state.timer_duration}s"
    
    timer_progress = circular_action_progress(
        value=st.session_state.timer_progress,
        size=100,
        thickness=8,
        color="#FF5722",
        label=time_display
    )

with col2:
    st.session_state.timer_duration = st.slider("Timer Duration (seconds)", 
                                              min_value=5, 
                                              max_value=60, 
                                              value=st.session_state.timer_duration)
    
    if st.button("Start Timer" if not st.session_state.timer_running else "Stop Timer"):
        st.session_state.timer_running = not st.session_state.timer_running
        if st.session_state.timer_running:
            # Record start time when starting the timer
            st.session_state.timer_start_time = time.time() - (st.session_state.timer_progress / 100 * st.session_state.timer_duration)
        
    if st.button("Reset Timer"):
        st.session_state.timer_progress = 0
        st.session_state.timer_start_time = None
        st.session_state.timer_running = False

# Update timer progress when running
if st.session_state.timer_running:
    # Check if timer completed a full cycle
    if st.session_state.timer_progress >= 100:
        # Reset the timer for the next cycle
        st.session_state.timer_start_time = time.time()
        st.session_state.timer_progress = 0
    
    # Rerun to update
    time.sleep(0.05)
    st.experimental_rerun()

# Advanced customization
st.header("Customization Options")
col1, col2, col3 = st.columns(3)

with col1:
    st.subheader("Custom Size")
    circular_action_progress(
        value=50,
        size=80,
        thickness=5,
        label="Large indicator"
    )

with col2:
    st.subheader("Custom Colors")
    circular_action_progress(
        value=65,
        color="#4CAF50",  # Green
        track_color="#E8F5E9",
        label="Custom colors"
    )

with col3:
    st.subheader("Themed")
    circular_action_progress(
        value=85,
        size=60,
        thickness=4,
        label="Using theme colors"
    )

# Interactive example
st.header("Interactive Example")

if "progress" not in st.session_state:
    st.session_state.progress = 0
    st.session_state.running = False

def start_progress():
    st.session_state.running = True
    st.session_state.progress = 0

def stop_progress():
    st.session_state.running = False

col1, col2 = st.columns([3, 1])

with col1:
    progress_state = circular_action_progress(
        value=st.session_state.progress,
        size=100,
        thickness=8,
        label="Task Progress"
    )

with col2:
    if st.button("Start" if not st.session_state.running else "Reset", on_click=start_progress if not st.session_state.running else stop_progress):
        pass
    
    if st.button("Stop", disabled=not st.session_state.running, on_click=stop_progress):
        pass

# Update progress when running
if st.session_state.running:
    if st.session_state.progress < 100:
        # Use Streamlit's experimental rerun to update the progress
        st.session_state.progress += 1
        time.sleep(0.05)
        st.rerun()
    else:
        st.session_state.running = False
        st.success("Task completed!")

# Documentation
st.header("Component Documentation")
st.code("""
# Basic usage
circular_action_progress(value=75)

# Indeterminate loading state
circular_action_progress(indeterminate=True)

# Full customization
circular_action_progress(
    value=50,               # Progress value (0-100)
    size=60,                # Size in pixels
    thickness=4,            # Line thickness
    color="#1976d2",        # Progress color
    track_color="#e0e0e0",  # Background track color
    indeterminate=False,    # Determinate/indeterminate mode
    label="Processing...",  # Optional label text
    key="my_progress"       # Component key
)
""") 