import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, { useEffect, useMemo, ReactElement } from "react"

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
    return color || (theme ? theme.primaryColor : "#1976d2")
  }, [color, theme])

  const progressTrackColor = useMemo(() => {
    return trackColor || (theme ? theme.backgroundColor : "#e0e0e0")
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
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={progressTrackColor}
            strokeWidth={thickness}
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
              color: theme ? theme.textColor : "#000000"
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
            color: theme ? theme.textColor : "#000000",
            fontSize: "0.875rem" 
          }}
        >
          {label}
        </div>
      )}
    </div>
  )
}

export default withStreamlitConnection(CircularProgress)
