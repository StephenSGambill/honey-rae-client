export const dateConverter = () => {
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().split("T"[0])
    return formattedDate[0]
}
