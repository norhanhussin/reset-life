import { useEffect, useRef } from 'react'
import { useI18n } from '../../../i18n/useI18n.js'
import ColoringDesignSvg from './ColoringDesignSvg.jsx'

const VIEW_WIDTH = 500
const VIEW_HEIGHT = 600

function drawStroke(context, stroke) {
  if (!stroke.points?.length) return

  context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
  context.strokeStyle = stroke.color || '#3b5946'
  context.fillStyle = stroke.color || '#3b5946'
  context.lineWidth = stroke.size || 7
  context.lineCap = 'round'
  context.lineJoin = 'round'

  if (stroke.points.length === 1) {
    const [point] = stroke.points
    context.beginPath()
    context.arc(point.x, point.y, (stroke.size || 7) / 2, 0, Math.PI * 2)
    context.fill()
  } else {
    context.beginPath()
    context.moveTo(stroke.points[0].x, stroke.points[0].y)
    for (const point of stroke.points.slice(1)) context.lineTo(point.x, point.y)
    context.stroke()
  }
  context.globalCompositeOperation = 'source-over'
}

function redrawCanvas(canvas, strokes, liveStroke) {
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height) return

  const pixelRatio = Math.max(1, window.devicePixelRatio || 1)
  const pixelWidth = Math.round(rect.width * pixelRatio)
  const pixelHeight = Math.round(rect.height * pixelRatio)
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
  }

  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.setTransform(pixelWidth / VIEW_WIDTH, 0, 0, pixelHeight / VIEW_HEIGHT, 0, 0)
  context.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT)
  for (const stroke of strokes) drawStroke(context, stroke)
  if (liveStroke) drawStroke(context, liveStroke)
}

function ColoringCanvas({ design, artworkData, tool, color, brushSize, onFillRegion, onStrokesChange }) {
  const { t } = useI18n()
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const liveStrokeRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const redraw = () => redrawCanvas(canvas, artworkData.strokes || [], liveStrokeRef.current)
    redraw()
    const observer = new ResizeObserver(redraw)
    observer.observe(canvas)
    return () => {
      observer.disconnect()
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [artworkData.strokes])

  function pointFromEvent(event) {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(VIEW_WIDTH, ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH)),
      y: Math.max(0, Math.min(VIEW_HEIGHT, ((event.clientY - rect.top) / rect.height) * VIEW_HEIGHT)),
    }
  }

  function handlePointerDown(event) {
    if (tool !== 'brush' && tool !== 'eraser') return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    drawingRef.current = true
    liveStrokeRef.current = {
      tool,
      color,
      size: brushSize,
      points: [pointFromEvent(event)],
    }
    redrawCanvas(canvasRef.current, artworkData.strokes || [], liveStrokeRef.current)
  }

  function handlePointerMove(event) {
    if (!drawingRef.current || !liveStrokeRef.current) return
    event.preventDefault()
    liveStrokeRef.current.points.push(pointFromEvent(event))
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      redrawCanvas(canvasRef.current, artworkData.strokes || [], liveStrokeRef.current)
      frameRef.current = null
    })
  }

  function handlePointerUp(event) {
    if (!drawingRef.current || !liveStrokeRef.current) return
    event.preventDefault()
    drawingRef.current = false
    const stroke = liveStrokeRef.current
    liveStrokeRef.current = null
    onStrokesChange([...(artworkData.strokes || []), stroke])
  }

  return (
    <div className="relative aspect-[5/6] max-h-[min(72vh,760px)] w-full max-w-[625px] overflow-hidden rounded-lg border border-[#d8dfd6] bg-[#fffefa] shadow-sm">
      <ColoringDesignSvg
        artworkData={artworkData}
        className="absolute inset-0 h-full w-full"
        design={design}
        interactive={tool === 'fill'}
        onFillRegion={onFillRegion}
      />
      <canvas
        aria-label={t('coloring.canvasAria', { title: t(design.titleKey) })}
        className={`absolute inset-0 h-full w-full ${tool === 'brush' || tool === 'eraser' ? 'cursor-crosshair' : 'pointer-events-none'}`}
        onPointerCancel={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        ref={canvasRef}
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}

export default ColoringCanvas