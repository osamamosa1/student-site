import React from 'react';

const slotStyle = (isWinner) => ({
  padding: '0.45rem 0.65rem',
  background: isWinner ? 'rgba(16,185,129,0.12)' : 'white',
  border: `1px solid ${isWinner ? '#6ee7b7' : '#e2e8f0'}`,
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: isWinner ? 700 : 500,
  color: '#0f172a',
  minHeight: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.5rem',
});

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
  const maxMatches = Math.max(...sortedRounds.map((r) => r.matches.length));

  return (
    <div style={{ overflowX: 'auto', padding: '0.5rem 0 1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '1.5rem', minWidth: sortedRounds.length * 200, alignItems: 'stretch' }}>
        {sortedRounds.map((round) => (
          <div key={round.round} style={{ flex: '0 0 190px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
              الجولة {round.round}
            </p>
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                gap: '1rem',
                minHeight: maxMatches * 88,
              }}
            >
              {round.matches.map((m) => {
                const p1Win = m.winner_name && m.winner_name === m.player1_name;
                const p2Win = m.winner_name && m.winner_name === m.player2_name;
                return (
                  <div key={m.id} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                    {/* connector line to next round */}
                    {round.round < sortedRounds[sortedRounds.length - 1].round && (
                      <div
                        style={{
                          position: 'absolute',
                          left: -12,
                          top: '50%',
                          width: 12,
                          height: 2,
                          background: '#cbd5e1',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {bracket.champion_name && (
          <div style={{ flex: '0 0 120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ fontWeight: 800, fontSize: '0.85rem', color: '#b45309', marginBottom: '0.5rem' }}>فائز</p>
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                border: '2px solid #f59e0b',
                borderRadius: '12px',
                fontWeight: 800,
                color: '#92400e',
                textAlign: 'center',
                fontSize: '0.9rem',
              }}
            >
              🏆 {bracket.champion_name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnockoutBracket;
