export function Complete({ leadId }) {
  return (
    <div className="form-step complete-step">
      <div className="complete-icon">✓</div>

      <h2 className="form-step-title">You're all set!</h2>
      <p className="form-step-subtitle">
        We've received your information and will be in touch shortly with
        your cash offer.
      </p>

      <div className="next-steps">
        <h3>What happens next?</h3>
        <ol>
          <li>Our team reviews your property details</li>
          <li>We prepare a fair cash offer within 24 hours</li>
          <li>You choose whether to accept — no obligation</li>
        </ol>
      </div>
    </div>
  );
}