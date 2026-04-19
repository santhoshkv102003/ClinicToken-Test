const Cards = ({ completed, queue, wait, avgTime = 5 }) => {
  return (
    <div className="cq-cards">
      {/* Completed */}
      <div className="cq-card cq-card-completed">
        <div className="cq-card-top">
          <div className="cq-icon-wrap">✓</div>
          <span className="cq-card-tag">TODAY</span>
        </div>
        <div className="cq-card-label">Completed</div>
        <div className="cq-card-value">{completed}</div>
        <div className="cq-card-foot">▲ &nbsp;PATIENTS SERVED</div>
      </div>

      {/* In Queue */}
      <div className="cq-card cq-card-queue">
        <div className="cq-card-top">
          <div className="cq-icon-wrap">⋯</div>
          <span className="cq-card-tag">LIVE</span>
        </div>
        <div className="cq-card-label">In Queue</div>
        <div className="cq-card-value">{queue}</div>
        <div className="cq-card-foot">● &nbsp;ACTIVE TOKENS</div>
      </div>

      {/* Waiting Time */}
      <div className="cq-card cq-card-wait">
        <div className="cq-card-top">
          <div className="cq-icon-wrap">◷</div>
          <span className="cq-card-tag">EST.</span>
        </div>
        <div className="cq-card-label">Waiting Time</div>
        <div className="cq-card-value">
          {wait}
          <span className="cq-card-unit">min</span>
        </div>
        <div className="cq-card-foot">≈ &nbsp;{Math.round(avgTime)} MIN PER CONSULT</div>
      </div>
    </div>
  );
};

export default Cards;
