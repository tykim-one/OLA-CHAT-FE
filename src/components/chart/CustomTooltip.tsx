type CustomTooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
  formatter?: (value: any, name: string, props?: any) => React.ReactNode
}

export default function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const value = payload[0].value
  const name = payload[0].name
  const formattedValue = formatter ? formatter(value, name) : value

  return (
    <div
      style={{
        backgroundColor: '#3e3e3e',
        padding: '6px 10px',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '13px',
        textAlign: 'center',
        lineHeight: '1.4',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <div>{label}</div>
      <div>{formattedValue}</div>
    </div>
  )
}
