import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, { useEffect, useMemo, ReactElement, useState, useRef } from "react"

// Define default theme colors for consistency
const DEFAULT_COLORS = {
  progress: "#2196F3",  // Main progress color (bright blue)
  track: "#EEEEEE",     // Track background (light gray)
  text: "#2196F3",      // Text color for percentage
  label: "#757575",     // Text color for label (gray)
  canceled: "#F44336"   // Red color for canceled state
}

interface CircularProgressProps extends ComponentProps {
  args: {
    value?: number;
    size?: number;
    thickness?: number;
    color?: string;
    trackColor?: string;
    indeterminate?: boolean;
    label?: string;
    allowCancel?: boolean;  // Option to enable/disable cancel functionality
    showPercentage?: boolean; // Whether to show the percentage value
  }
}

function CircularProgress({ args, theme }: CircularProgressProps): ReactElement {
  const {
    value = 0,
    size = 40,
    thickness = 3.6,
    color,
    trackColor,
    indeterminate = false,
    label,
    allowCancel = true,  // Default to true
    showPercentage = false  // Default to false - don't show percentage
  } = args

  // Use ref to check if canceled was already reported to avoid flicker
  const cancelReported = useRef(false);
  
  // State for hover effect and cancel state
  const [isHovered, setIsHovered] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  
  // Keep a stable reference to the last valid value before cancellation
  const lastValueRef = useRef(value);
  
  // Update lastValueRef when value changes while not canceled
  useEffect(() => {
    if (!isCanceled) {
      lastValueRef.current = value;
    }
  }, [value, isCanceled]);

  // Use theme colors if custom colors aren't provided
  const progressColor = useMemo(() => {
    // If canceled, use the canceled color
    if (isCanceled) {
      return DEFAULT_COLORS.canceled;
    }
    return color || (theme ? theme.primaryColor : DEFAULT_COLORS.progress);
  }, [color, theme, isCanceled])

  const progressTrackColor = useMemo(() => {
    // Ensure a visible track color is always used
    // First check for explicit trackColor, then theme background, then default
    // If track would be white, use the default instead
    const themeColor = theme?.backgroundColor;
    const finalTrackColor = trackColor || 
                          (themeColor && themeColor.toLowerCase() !== "#ffffff" ? themeColor : DEFAULT_COLORS.track);
    
    // Convert to lowercase for robust comparison
    const colorLower = finalTrackColor.toLowerCase();
    
    // Ensure we don't return white or transparent
    if (colorLower === "#ffffff" || colorLower === "#fff" || 
        colorLower === "white" || colorLower === "transparent") {
      return DEFAULT_COLORS.track;
    }
    
    return finalTrackColor;
  }, [trackColor, theme])

  // Use the last stable value if canceled, otherwise use the current value
  const displayValue = isCanceled ? lastValueRef.current : value;
  
  // Constrain value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, displayValue))
  
  // SVG path coordinates
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference.toFixed(3)
  const strokeDashoffset = (((100 - normalizedValue) / 100) * circumference).toFixed(3)
  
  // Center point of the circle
  const center = size / 2

  // Handle cancel action
  const handleCancel = () => {
    if (!isCanceled) {
      setIsCanceled(true);
      cancelReported.current = false;
    }
  };

  // Send the current value back to Streamlit, but only report cancellation once
  useEffect(() => {
    if (isCanceled && !cancelReported.current) {
      Streamlit.setComponentValue({
        value: normalizedValue,
        indeterminate: indeterminate,
        canceled: true
      });
      cancelReported.current = true;
    } else if (!isCanceled) {
      Streamlit.setComponentValue({
        value: normalizedValue,
        indeterminate: indeterminate,
        canceled: false
      });
    }
  }, [normalizedValue, indeterminate, isCanceled]);

  // Adjust frame height when component renders
  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [size, label])

  // Reset canceled state if new value is provided after cancellation
  // but only if the value is significantly different (to avoid flicker)
  useEffect(() => {
    if (isCanceled && Math.abs(value - lastValueRef.current) > 5) {
      setIsCanceled(false);
      cancelReported.current = false;
    }
  }, [value, isCanceled]);

  // Determine if we should show the cancel overlay
  const showCancelOverlay = isHovered && allowCancel && !isCanceled && (normalizedValue > 0 || indeterminate);

  // Get the appropriate text to display based on state
  const getStatusText = () => {
    if (isCanceled) {
      return "Canceled";
    }
    return `${normalizedValue}%`;
  };

  // Get the appropriate label based on state
  const getLabel = () => {
    if (isCanceled) {
      return "Operation Canceled";
    }
    // If we don't show percentage in the circle, show it in the label
    if (!showPercentage && normalizedValue > 0 && !indeterminate) {
      return label ? `${label} (${normalizedValue}%)` : `${normalizedValue}%`;
    }
    return label;
  };

  // Determine if we should use a pulsing animation
  const shouldPulse = isCanceled || (!indeterminate && normalizedValue > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          display: "inline-flex",
          position: "relative",
          width: size,
          height: size,
          background: "transparent", // Ensure transparent background
          cursor: showCancelOverlay ? "pointer" : "default"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={showCancelOverlay ? handleCancel : undefined}
      >
        <style>
          {`
            @keyframes circular-rotate {
              100% {
                transform: rotate(360deg);
              }
            }
            @keyframes circular-dash {
              0% {
                stroke-dasharray: ${(circumference * 0.1).toFixed(3)}px, ${circumference}px;
                stroke-dashoffset: ${(circumference * 0.25).toFixed(3)}px;
              }
              50% {
                stroke-dasharray: ${(circumference * 0.8).toFixed(3)}px, ${circumference}px;
                stroke-dashoffset: ${(circumference * 0.1).toFixed(3)}px;
              }
              100% {
                stroke-dasharray: ${(circumference * 0.1).toFixed(3)}px, ${circumference}px;
                stroke-dashoffset: ${(circumference * 0.8).toFixed(3)}px;
              }
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.6; }
              100% { opacity: 1; }
            }
          `}
        </style>
        <svg
          style={{
            transform: indeterminate ? "rotate(-90deg)" : undefined,
            animation: indeterminate && !isCanceled ? "circular-rotate 1.4s linear infinite" : undefined,
          }}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={progressTrackColor || "#EEEEEE"} // Ensure a fallback
            strokeWidth={thickness}
            strokeOpacity={1} // Ensure full opacity
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={thickness}
            strokeLinecap="round"
            style={{
              strokeDasharray: indeterminate && !isCanceled
                ? `${(circumference * 0.8).toFixed(3)}px, ${circumference}px` 
                : isCanceled ? circumference : strokeDasharray,
              strokeDashoffset: indeterminate && !isCanceled
                ? `${(circumference * 0.2).toFixed(3)}px` 
                : isCanceled ? "0" : strokeDashoffset,
              animation: indeterminate && !isCanceled 
                ? "circular-dash 1.4s ease-in-out infinite" 
                : shouldPulse ? "pulse 2s ease-in-out infinite" : undefined,
              transition: !indeterminate && !isCanceled ? "stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
            }}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        
        {/* Cancel overlay that appears on hover */}
        {showCancelOverlay && (
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.2s ease-in-out",
              color: "white",
              zIndex: 10
            }}
            title="Cancel"
          >
            {/* X icon for cancel */}
            <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </div>
        )}
        
        {/* Only show the percentage text if explicitly requested */}
        {showPercentage && !indeterminate && !showCancelOverlay && (
          <div 
            style={{
              position: "absolute", 
              top: 0, 
              left: 0, 
              bottom: 0, 
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isCanceled ? DEFAULT_COLORS.canceled : (theme ? theme.textColor : DEFAULT_COLORS.text),
              fontSize: `${Math.max(size / 4.5, 12)}px`,
              fontWeight: 500,
              zIndex: 5
            }}
          >
            {getStatusText()}
          </div>
        )}
      </div>
      {(label || isCanceled || (!showPercentage && normalizedValue > 0)) && (
        <div 
          style={{ 
            marginTop: 8, 
            color: isCanceled ? DEFAULT_COLORS.canceled : (theme ? theme.textColor : DEFAULT_COLORS.label),
            fontSize: "0.875rem",
            fontWeight: 400
          }}
        >
          {getLabel()}
        </div>
      )}
    </div>
  )
}

export default withStreamlitConnection(CircularProgress)
