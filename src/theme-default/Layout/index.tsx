import { useState } from 'react'

export function Layout() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>This is Layout Component2321</h1>
      <div>{count}</div>
      <button onClick={() => setCount(count + 1)}>Add Count</button>
    </div>
  )
}
