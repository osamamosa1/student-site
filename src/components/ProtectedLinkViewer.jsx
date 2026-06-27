import React from 'react';

const ProtectedLinkViewer = ({ url, title = 'Document' }) => {
  if (!url) return null;

  const viewerUrl = url.includes('drive.google.com')
    ? url.replace('/view', '/preview').replace('?usp=sharing', '')
    : url;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '62%',
        background: '#0f172a',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        marginTop: '1rem',
      }}
      onCopy={(e) => e.preventDefault()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <iframe
        title={title}
        src={viewerUrl}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      />
    </div>
  );
};

export default ProtectedLinkViewer;
