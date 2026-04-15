import { LeadForm } from './components/LeadForm'

function App({ variant, fullFormUrl }) {
  return (
    <main>
      <LeadForm variant={variant} fullFormUrl={fullFormUrl} />
    </main>
  )
}

export default App
