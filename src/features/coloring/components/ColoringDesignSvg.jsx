import { useI18n } from '../../../i18n/useI18n.js'

function ColoringDesignSvg({
  artworkData = { fills: {}, strokes: [] },
  design,
  interactive = false,
  onFillRegion,
  className = '',
}) {
  const { t } = useI18n()
  const fillMap = artworkData.fills || {}

  return (
    <svg
      aria-label={design ? t(design.titleKey) : undefined}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role={interactive ? 'group' : 'img'}
      viewBox="0 0 500 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#fffefa" height="600" width="500" />
      <g>
        {design.regions.map((region) => (
          <path
            aria-label={interactive ? t(region.labelKey) : undefined}
            className={interactive ? 'transition-colors' : undefined}
            d={region.d}
            fill={fillMap[region.id] || '#fffefa'}
            key={region.id}
            onClick={interactive ? () => onFillRegion(region.id) : undefined}
            onKeyDown={interactive ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onFillRegion(region.id)
              }
            } : undefined}
            role={interactive ? 'button' : undefined}
            stroke="#35483d"
            strokeLinejoin="round"
            strokeWidth="3.5"
            tabIndex={interactive ? 0 : undefined}
          />
        ))}
      </g>
      <g fill="none" pointerEvents="none" stroke="#35483d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
        {design.lines.map((line, index) => (
          <path d={line} key={`${design.id}-line-${index}`} />
        ))}
      </g>
    </svg>
  )
}

export default ColoringDesignSvg