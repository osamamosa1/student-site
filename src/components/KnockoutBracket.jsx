import React from 'react';

const SLOT_H = 40;
const MATCH_GAP = 14;
const MATCH_BLOCK_H = SLOT_H * 2 + 6;

const slotStyle = (isWinner) => ({
  padding: '0.45rem 0.65rem',
  background: isWinner ? 'rgba(16,185,129,0.12)' : 'white',
  border: `1px solid ${isWinner ? '#6ee7b7' : '#e2e8f0'}`,
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: isWinner ? 700 : 500,
  color: '#0f172a',
  minHeight: SLOT_H,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
});

const ColumnConnector = ({ height }) => (
  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height }} aria-hidden>
    <div style={{ width: '100%', height: 2, background: '#cbd5e1' }} />
  </div>
);

const KnockoutBracket = ({ bracket }) => {
  const rounds = bracket?.rounds || [];
  if (!rounds.length) {
    return (
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem' }}>
        لم تبدأ مرحلة خروج المغلوب بعد
      </p>
    );
  }

  const sortedRounds = [...rounds].sort((a, b) => a.round - b.round);
  const maxMatches = Math.max(...sortedRounds.map((r) => r.matches.length), 1);
  const matchesHeight = maxMatches * MATCH_BLOCK_H + Math.max(0, maxMatches - 1) * MATCH_GAP;
  const columnHeight = matchesHeight + 28;
  const champion = bracket?.champion_name;

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '0.5rem 0 1rem' }}>
      <div
        dir="ltr"
        style={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 0,
          minWidth: 'max-content',
          height: columnHeight,
          paddingBottom: '0.25rem',
        }}
      >
        {sortedRounds.map((round, roundIdx) => (
          <React.Fragment key={round.round}>
            {roundIdx > 0 && <ColumnConnector height={columnHeight} />}
            <div style={{ flex: '0 0 190px', height: columnHeight, display: 'flex', flexDirection: 'column' }}>
              <p style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#64748b', marginBottom: 8, flexShrink: 0 }}>
                الجولة {round.round}
              </p>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  minHeight: matchesHeight,
                  gap: MATCH_GAP,
                }}
              >
                {round.matches.map((m) => {
                  const p1Win = m.winner_name && m.winner_name === m.player1_name;
                  const p2Win = m.winner_name && m.winner_name === m.player2_name;
                  return (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <div style={slotStyle(p1Win)}>
                        <span>{m.player1_name}</span>
                        {m.status === 'completed' || m.status === 'bye' ? (
                          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{m.player1_score ?? 0}</span>
                        ) : null}
                      </div>
                      {!m.is_bye && (
                        <div style={slotStyle(p2Win)}>
                          <span>{m.player2_name}</span>
                          {m.status === 'completed' ? (
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{m.player2_score ?? 0}</span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        ))}

        {champion && (
          <>
            <ColumnConnector height={columnHeight} />
            <div style={{ flex: '0 0 130px', height: columnHeight, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#b45309', marginBottom: 8 }}>الفائز</p>
              <div
                style={{
                  padding: '0.75rem 0.85rem',
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  border: '2px solid #f59e0b',
                  borderRadius: '12px',
                  fontWeight: 800,
                  color: '#92400e',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                }}
              >
                🏆 {champion}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KnockoutBracket;
