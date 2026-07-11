import type { UnitsApp } from '../useUnitsApp';

export function AboutModal({ app }: { app: UnitsApp }) {
  const { aboutOpen, setAboutOpen } = app;
  if (!aboutOpen) return null;
  const close = () => setAboutOpen(false);

  return (
    <div className="ovl" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="fx jb ac">
          <h3 className="m0 postertitle">About An App</h3>
          <button className="cdel" style={{ opacity: 1 }} onClick={close}>×</button>
        </div>
        <p className="msub">
          Inspired by Will Freeman's philosophy in <em>About A Boy</em>: a day is easier as forty-eight
          thirty-minute units than as twenty-four intimidating hours.
        </p>
        <p className="quote" style={{ padding: 0 }}>
          “I find the key is to think of a day as units of time, each unit consisting of no more than
          thirty minutes. Full hours can be a little bit intimidating.”
        </p>
        <p className="mt12">
          <a href="https://www.youtube.com/watch?v=74256F5BtiI" target="_blank" rel="noreferrer">
            Watch the clip ↗
          </a>
        </p>
        <p className="mfoot">
          Built by RetiredOnMyTerms, who thinks in half-hour units. {' '}
          <a href="https://github.com/RetiredOnMyTerms" target="_blank" rel="noreferrer">GitHub</a>
          {' · '}
          <a href="https://www.linkedin.com/in/whelanjamesm/" target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
      </div>
    </div>
  );
}
