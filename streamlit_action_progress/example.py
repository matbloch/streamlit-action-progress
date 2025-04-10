import streamlit as st
import time
from streamlit_action_progress import streamlit_action_progress

# Initialize session state variables
if 'running' not in st.session_state:
    st.session_state.running = False
    st.session_state.progress_value = 0
    st.session_state.canceled = False

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
        comp_value = streamlit_action_progress(
            value=st.session_state.progress_value,
            size=100, 
            thickness=8,
            color="#FF5722",
            label=f"Progress: {st.session_state.progress_value}%" if st.session_state.progress_value > 0 else "Progress",
            key="smooth_progress"
        )

        # Check if the progress was canceled
        if comp_value.get('canceled', False):
            if not st.session_state.canceled:
                st.session_state.canceled = True
                st.session_state.running = False
                st.warning("Operation was canceled by user")
                st.rerun()
        
        # Show the current progress value
        status_text = f"Current value: {comp_value['value']}%"
        if st.session_state.canceled:
            status_text += " (Canceled)"
        st.info(status_text)
    
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
                    st.session_state.canceled = False
                st.rerun()
            
            if st.form_submit_button("Stop", disabled=not st.session_state.running):
                st.session_state.running = False
                st.rerun()

# Other examples in a separate container
with examples_container:
    st.header("Component Gallery")
    
    # First row
    st.subheader("State & Animation Variants")
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("**Indeterminate Progress**")
        indeterminate_value = streamlit_action_progress(
            indeterminate=True,
            size=60,
            thickness=5,
            color="#2196F3",
            label="Processing...",
            key="indeterminate_progress"
        )
    
    with col2:
        st.markdown("**Pulsating Progress**")
        standard_value = streamlit_action_progress(
            value=50,
            key="default_styling",
            label="Default Theme",
            show_percentage=False  # Don't show percentage inside
        )
    
    # Second row
    st.subheader("Visual Customization")
    col3, col4 = st.columns(2)
    
    with col3:
        st.markdown("**Large Format**")
        large_value = streamlit_action_progress(
            value=75,
            size=80,
            thickness=10,
            color="#4CAF50",
            label="Enhanced Visibility",
            key="custom_size_progress",
            show_percentage=False  # Don't show percentage inside
        )
    
    with col4:
        st.markdown("**Custom colors and %**")
        custom_value = streamlit_action_progress(
            value=50,
            size=60,
            thickness=5,
            color="#9C27B0",
            track_color="#F3E5F5",
            #label="Classic Style",
            key="custom_color_progress",
            show_percentage=True  # Show percentage inside
        )

# Documentation in a separate container
with docs_container:


    st.header("Component features")

    st.write("""
    ### Working with Cancellation:
    1. Hover over any progress indicator to see the cancel button
    2. Click the cancel button to stop the operation
    3. The component returns a `canceled` flag in the returned dictionary
    4. You can detect cancellation and take appropriate action in your code
    """)
    
    st.code("""
    # Example of handling cancellation
    progress = streamlit_action_progress(
        value=50,
        key="progress_with_cancel"
    )
    
    if progress.get('canceled', False):
        # User canceled the operation
        st.warning("Operation was canceled")
        # Handle cancellation logic here
    """)


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
    progress = streamlit_action_progress(
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
if st.session_state.running and not st.session_state.canceled:
    # Small delay to control speed
    time.sleep(0.1)
    
    # Update the progress value
    increment_progress()
    
    # Rerun to update the UI
    st.rerun() 