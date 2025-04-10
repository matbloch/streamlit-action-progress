import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, { useEffect, useMemo, ReactElement } from "react"

// Define default theme colors for consistency
const DEFAULT_COLORS = {
  progress: "#2196F3",  // Main progress color (bright blue)
  track: "#EEEEEE",     // Track background (light gray)
  text: "#2196F3",      // Text color for percentage
  label: "#757575"      // Text color for label (gray)
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
    label
  } = args

  // Use theme colors if custom colors aren't provided
  const progressColor = useMemo(() => {
    return color || (theme ? theme.primaryColor : DEFAULT_COLORS.progress)
  }, [color, theme])

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

  // Constrain value between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value))
  
  // SVG path coordinates
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference.toFixed(3)
  const strokeDashoffset = (((100 - normalizedValue) / 100) * circumference).toFixed(3)
  
  // Center point of the circle
  const center = size / 2

  // Send the current value back to Streamlit
  useEffect(() => {
    Streamlit.setComponentValue({
      value: normalizedValue,
      indeterminate: indeterminate
    })
  }, [normalizedValue, indeterminate])

  // Adjust frame height when component renders
  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [size, label])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          display: "inline-flex",
          position: "relative",
          width: size,
          height: size,
          background: "transparent", // Ensure transparent background
        }}
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
          `}
        </style>
        <svg
          style={{
            transform: indeterminate ? "rotate(-90deg)" : undefined,
            animation: indeterminate ? "circular-rotate 1.4s linear infinite" : undefined,
          }}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Debug rectangle to check if SVG is rendering */}
          <rect x="0" y="0" width={size} height={size} fill="transparent" stroke="none" />
          
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={progressTrackColor || "#E3F2FD"} // Ensure a fallback
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
              strokeDasharray: indeterminate 
                ? `${(circumference * 0.8).toFixed(3)}px, ${circumference}px` 
                : strokeDasharray,
              strokeDashoffset: indeterminate 
                ? `${(circumference * 0.2).toFixed(3)}px` 
                : strokeDashoffset,
              animation: indeterminate ? "circular-dash 1.4s ease-in-out infinite" : undefined,
              transition: indeterminate ? undefined : "stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        {!indeterminate && (
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
              color: theme ? theme.textColor : DEFAULT_COLORS.text,
              fontSize: `${Math.max(size / 4.5, 12)}px`,
              fontWeight: 500
            }}
          >
            {normalizedValue}%
          </div>
        )}
      </div>
      {label && (
        <div 
          style={{ 
            marginTop: 8, 
            color: theme ? theme.textColor : DEFAULT_COLORS.label,
            fontSize: "0.875rem",
            fontWeight: 400
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}

export default withStreamlitConnection(CircularProgress)
