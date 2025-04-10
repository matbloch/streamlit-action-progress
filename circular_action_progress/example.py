import streamlit as st
import time
from circular_action_progress import circular_action_progress

# Initialize session state variables
if 'running' not in st.session_state:
    st.session_state.running = False
    st.session_state.progress_value = 0

def increment_progress():
    """Function to increment progress and handle completion"""
    if st.session_state.progress_value < 100:
        st.session_state.progress_value += 1
    else:
        st.session_state.running = False
        st.session_state.progress_value = 100

# Main app
st.title("Circular Progress Indicator Demo")
st.write("This demo showcases a circular progress indicator with smooth transitions.")

# Create main page structure with containers
main_container = st.container()
examples_container = st.container()
docs_container = st.container()

# Top section with main progress demo
with main_container:
    st.header("Basic Progress")
    
    # Create two columns for progress and controls
    col1, col2 = st.columns([3, 1])
    
    with col1:
        # Place the progress indicator here
        comp_value = circular_action_progress(
            value=st.session_state.progress_value,
            size=100, 
            thickness=8,
            color="#FF5722",
            label=f"Progress: {st.session_state.progress_value}%" if st.session_state.progress_value > 0 else "Progress",
            key="smooth_progress"
        )

        st.info(f"Current value: {comp_value['value']}%")
    
    with col2:
        # Control buttons in a form to prevent re-rendering
        with st.form(key="progress_controls"):
            if st.form_submit_button("Start" if not st.session_state.running else "Reset"):
                if st.session_state.running:
                    # Reset
                    st.session_state.progress_value = 0
                    st.session_state.running = False
                else:
                    # Start
                    st.session_state.running = True
                    st.session_state.progress_value = 0
                st.rerun()
            
            if st.form_submit_button("Stop", disabled=not st.session_state.running):
                st.session_state.running = False
                st.rerun()

# Other examples in a separate container
with examples_container:
    st.header("Customization Options")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.subheader("Indeterminate")
        indeterminate_progress = circular_action_progress(
            indeterminate=True,
            size=60,
            thickness=5,
            color="#2196F3",
            label="Loading...",
            key="indeterminate_progress"
        )
    
    with col2:
        st.subheader("Custom Size")
        custom_size_progress = circular_action_progress(
            value=75,
            size=80,
            thickness=10,
            color="#4CAF50",
            label="Large Progress",
            key="custom_size_progress"
        )
    
    with col3:
        st.subheader("Custom Colors")
        custom_color_progress = circular_action_progress(
            value=50,
            size=60,
            thickness=5,
            color="#9C27B0",
            track_color="#F3E5F5",
            label="Custom Colors",
            key="custom_color_progress"
        )

# Documentation in a separate container
with docs_container:
    st.header("Tips for Smooth Progress Updates")
    st.write("""
    ### Reducing Flickering:
    1. Always use a consistent `key` parameter for your component
    2. Keep component rerenders to a minimum
    3. Use session_state to track progress values
    4. Structure your app with containers
    5. Use forms for controls when possible
    
    The circular progress component has smooth transitions built in,
    so even incremental updates should appear fluid.
    """)
    
    st.code("""
    # Example of smooth progress updates
    progress = circular_action_progress(
        value=st.session_state.progress_value,
        key="your_progress_key"  # IMPORTANT: Use consistent key
    )
    
    if st.session_state.running:
        if st.session_state.progress_value < 100:
            st.session_state.progress_value += 1
            time.sleep(0.1)  # Control update speed
            st.rerun()
    """)

# Main update loop - keeps this at the end of the script
if st.session_state.running:
    # Small delay to control speed
    time.sleep(0.1)
    
    # Update the progress value
    increment_progress()
    
    # Rerun to update the UI
    st.rerun() 