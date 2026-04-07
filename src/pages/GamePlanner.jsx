import { useRef, useState, useEffect, useCallback } from 'react'

export default function GamePlanner() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#00d4ff')
  const [brushSize, setBrushSize] = useState(3)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  // Resize canvas to fill container
  useEffect(() => {
    const canvas = canvasRef.current
    const resizeCanvas = () => {
      const wrapper = canvas.parentElement
      const rect = wrapper.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      // Save current drawing
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      tempCanvas.getContext('2d').drawImage(canvas, 0, 0)

      canvas.width = rect.width * dpr
      canvas.height = 450 * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = '450px'

      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      // Restore drawing
      ctx.drawImage(tempCanvas, 0, 0, rect.width, 450)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }
  }, [])

  const startDrawing = useCallback(
    (e) => {
      e.preventDefault()
      setIsDrawing(true)
      setLastPos(getPos(e))
    },
    [getPos]
  )

  const draw = useCallback(
    (e) => {
      if (!isDrawing) return
      e.preventDefault()
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const pos = getPos(e)

      ctx.beginPath()
      ctx.moveTo(lastPos.x, lastPos.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      setLastPos(pos)
    },
    [isDrawing, lastPos, color, brushSize, getPos]
  )

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'game_plan.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="page-wrapper">
      <div className="container section planner-container">
        <div className="section-header">
          <h2>Game Planner</h2>
          <p>Draw your strategy, plan your plays, and download your game plan</p>
        </div>

        <div className="canvas-wrapper">
          <div className="canvas-toolbar">
            <label>
              Color
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
            <label>
              Brush: {brushSize}px
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
              />
            </label>
          </div>

          <canvas
            ref={canvasRef}
            className="drawing-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          <div className="canvas-actions">
            <button className="btn-secondary" onClick={clearCanvas}>
              🗑️ Erase All
            </button>
            <button className="btn-primary" onClick={downloadCanvas}>
              📥 Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
