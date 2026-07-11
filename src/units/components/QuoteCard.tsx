export function QuoteCard({ quote }: { quote: string }) {
  return (
    <div className="quote">
      “{quote}”
      <span className="qwho">— Will, probably</span>
    </div>
  );
}
