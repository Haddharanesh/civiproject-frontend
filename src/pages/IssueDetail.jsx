import { useParams } from "react-router-dom"

function IssueDetail() {
  const { id } = useParams()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Issue Details</h2>
      <p>Showing details for issue ID: {id}</p>
    </div>
  )
}

export default IssueDetail
