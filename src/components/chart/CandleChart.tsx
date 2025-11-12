'use client'

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { CrosshairMode, IChartApi, ISeriesApi, LineData, createChart } from 'lightweight-charts'

/** 가격 데이터 타입 */
interface PriceData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

/** 거래량 데이터 타입 */
interface VolumeData {
  time: string
  value: number
  color?: string
}

interface MAData {
  time: string
  value: number
}

export type ChartType = 'candlestick' | 'line'
export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
export const TIME_FRAMES: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h', '1d']

interface TradingChartProps {
  priceData: PriceData[]
  volumeData: VolumeData[]
  className?: string
  blockId: string
  type: ChartType
  maData?: {
    ma5: MAData[]
    ma10: MAData[]
    ma20: MAData[]
    ma50: MAData[]
    ma120: MAData[]
  }
}

/** 차트 캔버스 핸들 타입 */
export interface ChartComponentHandle {
  getChartCanvas: () => Promise<HTMLCanvasElement | null>
  downloadPDF: () => void
}

interface DisplayPriceInfo {
  time: string
  open: number
  high: number
  low: number
  close: number
  ma5?: number
  ma10?: number
  ma20?: number
  ma60?: number
  ma120?: number
}

const ChartComponent = forwardRef<ChartComponentHandle, TradingChartProps>(
  ({ priceData, volumeData, className = '', blockId, type = 'candlestick', maData }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
    const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
    const maSeriesRefs = useRef<ISeriesApi<'Line'>[]>([])

    // latest/hover price
    const [latestPrice, setLatestPrice] = useState<DisplayPriceInfo | null>(null)
    const [hoverPrice, setHoverPrice] = useState<DisplayPriceInfo | null>(null)

    const priceRef = useRef(priceData)
    const maRef = useRef(maData)
    useEffect(() => {
      priceRef.current = priceData
    }, [priceData])
    useEffect(() => {
      maRef.current = maData
    }, [maData])

    useEffect(() => {
      if (priceData.length) {
        const last = priceData[priceData.length - 1]
        setLatestPrice({
          time: last.time,
          open: last.open,
          high: last.high,
          low: last.low,
          close: last.close,
        })
      }
    }, [priceData])

    // initialize chart once
    useEffect(() => {
      if (!containerRef.current) return
      const chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        layout: { background: { color: '#fff' }, textColor: 'rgba(0,0,0,0.9)' },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: {
          borderColor: '#485c7b',
          scaleMargins: { top: 0.1, bottom: 0.25 },
          entireTextOnly: true,
        },
        timeScale: { borderColor: '#485c7b' },
        watermark: { text: 'Finola', color: '#485c7b' },
      })
      chartRef.current = chart

      candleSeriesRef.current = chart.addCandlestickSeries({
        upColor: '#26A69A',
        downColor: '#EF5350',
        borderUpColor: '#26A69A',
        borderDownColor: '#EF5350',
        wickUpColor: '#666',
        wickDownColor: '#666',
        visible: type === 'candlestick',
      })
      lineSeriesRef.current = chart.addLineSeries({
        color: '#000',
        lineWidth: 2,
        visible: type === 'line',
      })
      volumeSeriesRef.current = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      })
      chart.priceScale('volume').applyOptions({
        visible: true,
        borderColor: '#485c7b',
        scaleMargins: { top: 0.8, bottom: 0 },
      })

      candleSeriesRef.current.setData(priceRef.current)
      lineSeriesRef.current.setData(
        priceRef.current.map((d) => ({ time: d.time, value: d.close }) as LineData),
      )
      volumeSeriesRef.current.setData(
        volumeData.map((v, i) => ({
          time: v.time,
          value: v.value,
          color: priceRef.current[i].close >= priceRef.current[i].open ? '#26A69A' : '#EF5350',
        })),
      )

      if (maRef.current) {
        const configs = [
          { data: maRef.current.ma5, color: '#1E88E5' },
          { data: maRef.current.ma10, color: '#FB8C00' },
          { data: maRef.current.ma20, color: '#43A047' },
          { data: maRef.current.ma50, color: '#8E24AA' },
          { data: maRef.current.ma120, color: '#BDBDBD' },
        ]
        maSeriesRefs.current = configs.map(({ data, color }) => {
          const s = chart.addLineSeries({
            color,
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: false,
            crosshairMarkerVisible: false,
          })
          s.setData(data)
          return s
        })
      }

      const handleCrosshairMove = (param: any) => {
        if (!param.time || !param.point || param.point.x < 0 || param.point.y < 0)
          return setHoverPrice(null)
        const h = priceRef.current.find((d) => d.time === param.time)
        if (h) {
          const ma5 = maRef.current?.ma5.find((d) => d.time === param.time)?.value
          const ma10 = maRef.current?.ma10.find((d) => d.time === param.time)?.value
          const ma20 = maRef.current?.ma20.find((d) => d.time === param.time)?.value
          const ma50 = maRef.current?.ma50.find((d) => d.time === param.time)?.value
          const ma120 = maRef.current?.ma120.find((d) => d.time === param.time)?.value
          setHoverPrice({
            time: h.time,
            open: h.open,
            high: h.high,
            low: h.low,
            close: h.close,
            ma5,
            ma10,
            ma20,
            ma60: ma50,
            ma120,
          })
        } else setHoverPrice(null)
      }
      chart.subscribeCrosshairMove(handleCrosshairMove)
      // registerChartRef(blockId, { getChartCanvas, downloadPDF })
      // const onDragEnd = () => {
      //   setIsDragging(false)
      // }
      // document.addEventListener('dragstart', () => setIsDragging(true))
      // document.addEventListener('mouseup', onDragEnd)
      // document.addEventListener('dragend', onDragEnd)

      const ro = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect
        chart.applyOptions({ width, height })
      })
      ro.observe(containerRef.current)

      return () => {
        chart.unsubscribeCrosshairMove(handleCrosshairMove)
        chart.remove()
        // document.removeEventListener('mouseup', onDragEnd)
        // document.removeEventListener('dragend', onDragEnd)
        ro.disconnect()
      }
    }, [])

    // update data
    useEffect(() => {
      if (!chartRef.current) return
      candleSeriesRef.current?.applyOptions({ visible: type === 'candlestick' })
      lineSeriesRef.current?.applyOptions({ visible: type === 'line' })
      candleSeriesRef.current?.setData(priceData)
      lineSeriesRef.current?.setData(
        priceData.map((d) => ({ time: d.time, value: d.close }) as LineData),
      )
      volumeSeriesRef.current?.setData(
        volumeData.map((v, i) => ({
          time: v.time,
          value: v.value,
          color: priceData[i].close >= priceData[i].open ? '#26A69A' : '#EF5350',
        })),
      )
      if (maData)
        maSeriesRefs.current.forEach((s, i) =>
          s.setData([maData.ma5, maData.ma10, maData.ma20, maData.ma50, maData.ma120][i]),
        )
    }, [priceData, volumeData, maData, type])

    const getChartCanvas = useCallback((): Promise<HTMLCanvasElement | null> => {
      if (!chartRef.current) return Promise.resolve(null)
      return new Promise<HTMLCanvasElement | null>((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            try {
              const container = containerRef.current
              let originalStyle = ''

              if (container) {
                originalStyle = container.style.cssText
                container.style.padding = '10px 20px 30px 20px'
              }

              const canvas = chartRef.current?.takeScreenshot() as HTMLCanvasElement

              if (container) {
                container.style.cssText = originalStyle
              }

              if (canvas) {
                const resizedCanvas = document.createElement('canvas')
                const maxWidth = 800
                const maxHeight = 600
                let newWidth = canvas.width
                let newHeight = canvas.height

                if (newWidth > maxWidth) {
                  const ratio = maxWidth / newWidth
                  newWidth = maxWidth
                  newHeight = Math.floor(newHeight * ratio)
                }
                if (newHeight > maxHeight) {
                  const ratio = maxHeight / newHeight
                  newHeight = maxHeight
                  newWidth = Math.floor(newWidth * ratio)
                }

                resizedCanvas.width = newWidth
                resizedCanvas.height = newHeight
                const ctx = resizedCanvas.getContext('2d')
                ctx?.drawImage(canvas, 0, 0, newWidth, newHeight)

                resolve(resizedCanvas)
              } else {
                resolve(canvas || null)
              }
            } catch (error) {
              console.error('Chart screenshot error:', error)
              resolve(null)
            }
          }, 300)
        })
      })
    }, [])

    const downloadPDF = useCallback(() => {
      getChartCanvas().then((canvas) => {
        if (!canvas) return
        const dataUrl = canvas.toDataURL('image/png')
        const win = window.open('', '_blank')
        if (win) {
          win.document.write(`<img src="${dataUrl}" onload="window.print(); window.close();" />`)
        }
      })
    }, [getChartCanvas])

    useImperativeHandle(ref, () => ({ getChartCanvas, downloadPDF }))

    const display = hoverPrice || latestPrice
    let diff = 0,
      diffPct = 0
    if (display) {
      diff = display.close - display.open
      diffPct = display.open ? (diff / display.open) * 100 : 0
    }

    return (
      <div
        ref={containerRef}
        data-block-id={blockId}
        // id={`chart-${blockId}`}
        className={`chart-container ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '360px',
          overflow: 'hidden',

          transition: 'opacity 0.2s',
        }}
      >
        {display && (
          <div
            style={{ position: 'absolute', top: 0, left: 0, padding: 8, zIndex: 10, fontSize: 14 }}
          >
            <div className="flex gap-2">
              <span style={{ color: display.close >= display.open ? '#26a69a' : '#ef5350' }}>
                O:{display.open.toFixed(2)}
              </span>
              <span style={{ color: display.close >= display.open ? '#26a69a' : '#ef5350' }}>
                H:{display.high.toFixed(2)}
              </span>
              <span style={{ color: display.close >= display.open ? '#26a69a' : '#ef5350' }}>
                L:{display.low.toFixed(2)}
              </span>
              <span style={{ color: display.close >= display.open ? '#26a69a' : '#ef5350' }}>
                C:{display.close.toFixed(2)}
              </span>
              <span
                style={{
                  color: diff >= 0 ? '#26A69A' : '#EF5350',
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}
              >
                {diff >= 0 ? `+${diff.toFixed(5)}` : diff.toFixed(5)}(
                {diff >= 0 ? `+${diffPct.toFixed(2)}` : diffPct.toFixed(2)}%)
              </span>
            </div>
            <div className="flex gap-2 mt-1">
              {/* <span>MA5:{display.ma5?.toFixed(2) || 'N/A'}</span>
              <span>MA10:{display.ma10?.toFixed(2) || 'N/A'}</span>
              <span>MA20:{display.ma20?.toFixed(2) || 'N/A'}</span>
              <span>MA60:{display.ma60?.toFixed(2) || 'N/A'}</span>
              <span>MA120:{display.ma120?.toFixed(2) || 'N/A'}</span> */}
            </div>
          </div>
        )}
      </div>
    )
  },
)
ChartComponent.displayName = 'ChartComponent'
export type { TradingChartProps }
export default ChartComponent
