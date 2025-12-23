import { useState } from 'react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

export default function Calendar({ tasks, onSelectTask }) {
    const [date, setDate] = useState(new Date())

    const events = tasks
        .filter(task => task.startDate && task.endDate)
        .map(task => ({
            id: task._id,
            title: task.title,
            start: new Date(task.startDate),
            end: new Date(task.endDate),
            resource: task
        }))

    const eventStyleGetter = (event) => {
        const task = event.resource
        let backgroundColor = '#3174ad'

        if (task.priority === 'high') backgroundColor = '#ef4444'
        if (task.priority === 'medium') backgroundColor = '#f59e0b'
        if (task.priority === 'low') backgroundColor = '#10b981'

        const opacity = task.status === 'done' ? 0.5 : 1

        return {
            style: {
                backgroundColor,
                opacity,
                borderRadius: '5px',
                border: 'none',
                color: 'white'
            }
        }
    }

    return (
        <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event) => onSelectTask(event.resource)}
        />
    )
}