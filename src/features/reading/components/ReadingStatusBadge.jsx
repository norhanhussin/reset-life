import { useI18n } from '../../../i18n/useI18n.js'

const STATUS_CLASSES = {
  want_to_read: 'bg-[#f1f0e9] text-[#716c56]',
  reading: 'bg-[#e5efe7] text-[#3d6d4c]',
  completed: 'bg-[#e9efeb] text-[#5a7063]',
}

const STATUS_KEYS = {
  want_to_read: 'reading.statusWantToRead',
  reading: 'reading.statusReading',
  completed: 'reading.statusCompleted',
}

function ReadingStatusBadge({ status }) {
  const { t } = useI18n()
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[status] || 'bg-[#edf0eb] text-[#59685e]'}`}>
      {t(STATUS_KEYS[status] || 'reading.statusWantToRead')}
    </span>
  )
}

export default ReadingStatusBadge