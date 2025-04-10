import os
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = False

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("my_component"
        # does not fit this bill, so please choose something better for your
        # own component :)
        "circular_action_progress",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("circular_action_progress", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.
def circular_action_progress(
    value=0, 
    size=40, 
    thickness=3.6, 
    color=None, 
    track_color=None, 
    indeterminate=False, 
    label=None,
    allow_cancel=True,
    show_percentage=False,
    key=None
):
    """Create a circular progress indicator component.

    Parameters
    ----------
    value: int or float
        The value of the progress indicator. Value between 0 and 100.
    size: int
        The size of the circle in pixels.
    thickness: float
        The thickness of the circle.
    color: str or None
        The color of the progress. If None, uses the theme's primary color.
    track_color: str or None
        The color of the track. If None, uses the theme's background color.
    indeterminate: bool
        Whether the progress is indeterminate (loading/processing state).
    label: str or None
        Optional label to display beneath the progress indicator.
    allow_cancel: bool
        Whether to show a cancel button when hovering over the progress indicator.
        When clicked, the component will return a 'canceled' flag set to True.
    show_percentage: bool
        Whether to show the percentage value inside the progress indicator.
        If False, the percentage will be shown in the label if provided.
    key: str or None
        An optional key that uniquely identifies this component. If this is
        None, and the component's arguments are changed, the component will
        be re-mounted in the Streamlit frontend and lose its current state.

    Returns
    -------
    dict
        A dictionary containing the current value and state of the progress indicator.
        {
            "value": float,
            "indeterminate": bool,
            "canceled": bool
        }
    """
    # Call through to our private component function. Arguments we pass here
    # will be sent to the frontend, where they'll be available in an "args"
    # dictionary.
    component_value = _component_func(
        value=value,
        size=size,
        thickness=thickness,
        color=color,
        trackColor=track_color,  # Convert snake_case to camelCase for JavaScript
        indeterminate=indeterminate,
        label=label,
        allowCancel=allow_cancel,  # Parameter for cancel functionality
        showPercentage=show_percentage,  # Parameter for showing percentage
        key=key,
        default={"value": value, "indeterminate": indeterminate, "canceled": False}
    )

    return component_value
