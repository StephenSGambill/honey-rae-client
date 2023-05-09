import { useEffect, useState, fetchIt } from "react"
import { useNavigate } from "react-router-dom"
import { isStaff } from "../../utils/isStaff"
import { TicketCard } from "./TicketCard"
import { getAllTickets, searchTicketsByStatus, searchTicketsByDescription } from "../../managers/TicketManager"
import "./Tickets.css"


export const TicketList = () => {
  const [active, setActive] = useState("")
  const [tickets, setTickets] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    getAllTickets().then((res) => setTickets(res))
  }, [])

  useEffect(() => {
    const activeTicketCount = tickets.filter(t => t.date_completed === null).length
    if (isStaff()) {
      setActive(`There are ${activeTicketCount} open tickets`)
    }
    else {
      setActive(`You have ${activeTicketCount} open tickets`)
    }
  }, [tickets])

  const toShowOrNotToShowTheButton = () => {
    if (isStaff()) {
      return ""
    }
    else {
      return <button className="actions__create"
        onClick={() => navigate("/tickets/create")}>Create Ticket</button>
    }
  }

  const filterTickets = (status) => {
    searchTicketsByStatus(status)
      .then((tickets) => {
        setTickets(tickets);
      })
      .catch(() => setTickets([]));

  }

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      searchTicketsByDescription(query)
        .then((searchedTickets) => {
          setTickets(searchedTickets);
        })
        .catch(() => setTickets([]));
    } else {
      // If the search query is empty, show all tickets
      getAllTickets().then((res) => setTickets(res));
    }

  }



  return (
    <>

      {isStaff() && (
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search tickets"
          />
          <button onClick={() => filterTickets("all")}>Show All</button>
          <button onClick={() => filterTickets("done")}>Show Done</button>
          <button onClick={() => filterTickets("unclaimed")}>Show Unclaimed</button>
          <button onClick={() => filterTickets("inprogress")}>Show In Progress</button>
        </div>
      )}
      <div className="actions">{toShowOrNotToShowTheButton()}</div>
      <div className="activeTickets">{active}</div>
      <article className="tickets">
        {
          tickets.map(ticket => (
            <TicketCard key={`ticket--${ticket.id}`} ticket={ticket} />
          ))
        }
      </article>
    </>)
}