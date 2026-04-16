export function ProgressBar({ progressPercent }) {
  return (
    <div className="progress-strip-track">
      <div
        className="progress-strip-fill"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
}
