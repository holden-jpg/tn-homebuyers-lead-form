import { LeadForm } from './components/LeadForm'

function App({ variant, fullFormUrl }) {
  if (variant === 'short') {
    return <LeadForm variant={variant} fullFormUrl={fullFormUrl} />
  }

  return (
    <main>
      <LeadForm variant={variant} fullFormUrl={fullFormUrl} />
    </main>
  )
}

export default App
