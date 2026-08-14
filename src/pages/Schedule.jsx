import { useLanguage } from '../i18n/useLanguage'

function Schedule() {
  const { copy } = useLanguage()
  return <section className="schedule-page">{copy.schedule.title}</section>
}

export default Schedule
