import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { isStaff } from "../../utils/isStaff"
import { getAllEmployees } from "../../managers/EmployeeManager"
import { getTicketById, deleteTicket, updateTicket } from "../../managers/TicketManager"
import { dateConverter } from "../../utils/dateConverter"

export const Ticket = () => {
  const [ticket, setTicket] = useState({})
  const [employees, setEmployees] = useState([])
  const { ticketId } = useParams()
  const navigate = useNavigate()

  const fetchTicket = () => {
    getTicketById(ticketId)
      .then((res) => setTicket(res))
  }

  useEffect(
    () => {
      fetchTicket()
    },
    [ticketId]
  )

  useEffect(
    () => {
      getAllEmployees().then((res) => setEmployees(res))
    }, []
  )

  const deleteTicketEvent = () => {
    deleteTicket(ticketId).then(() => navigate("/"))
  }

  const updateTicketEvent = (evt) => {
    const updatedTicket = {
      ...ticket,
      employee: parseInt(evt.target.value)
    }
    updateTicket(updatedTicket).then(() => fetchTicket())

  }

  const completeTicketEvent = () => {
    // console.log(parseInt(evt.target.value))
    const newDate = dateConverter()
    const updatedTicket = {
      ...ticket,
      employee: ticket.employee.id,
      date_completed: newDate
    }
    updateTicket(updatedTicket).then(() => fetchTicket())
    navigate("/")
  }

  const ticketStatus = () => {
    if (ticket.date_completed === null) {
      if (ticket.employee) {
        return <span className="status--in-progress">In progress</span>
      }
      return <span className="status--new">Unclaimed</span>
    }
    return <span className="status--completed">Done</span>
  }

  const employeePicker = () => {
    if (isStaff()) {
      return <div className="ticket__employee">
        <label>Assign to:</label>
        <select
          value={ticket.employee?.id}
          onChange={updateTicketEvent}>
          <option value="0">Choose...</option>
          {
            employees.map(e =>
              <option key={`employee--${e.id}`} value={e.id}>{e.full_name}</option>)
          }
        </select>
      </div>
    }
    else {
      return <div className="ticket__employee">Assigned to {ticket.employee?.full_name ?? "no one"}</div>
    }
  }

  return (
    <>
      <section className="ticket">
        <h3 className="ticket__description">Description Ticket - {ticket.id}</h3>
        <div>{ticket.description}</div>

        <footer className="ticket__footer ticket__footer--detail">
          <div className=" footerItem">Submitted by {ticket.customer?.full_name}</div>
          <div className="ticket__employee footerItem">
            {
              ticket.date_completed === null && isStaff()
                ? employeePicker()
                : `Completed by ${ticket.employee?.full_name} on ${ticket.date_completed}`
            }
          </div>
          <div className="footerItem">
            {ticketStatus()}
          </div>
          {
            ticket.date_completed === null && isStaff()
              ? <button className="btn-4" onClick={completeTicketEvent}>Mark Done</button>
              : <button onClick={deleteTicketEvent}>Delete</button>
          }
        </footer>

      </section>
    </>
  )
}
