const containerStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "2rem",
  background:
    "linear-gradient(135deg, rgb(236, 253, 245) 0%, rgb(219, 234, 254) 100%)",
  color: "#0f172a",
  fontFamily: "Segoe UI, sans-serif",
} as const;

const cardStyle = {
  maxWidth: "42rem",
  textAlign: "center",
  padding: "3rem",
  borderRadius: "1.5rem",
  backgroundColor: "rgba(255, 255, 255, 0.88)",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
} as const;

const headingStyle = {
  margin: "0 0 1rem",
  fontSize: "clamp(2rem, 4vw, 3.5rem)",
  lineHeight: 1.1,
} as const;

const bodyStyle = {
  margin: 0,
  fontSize: "1.125rem",
  lineHeight: 1.6,
  color: "#475569",
} as const;

export default function Index() {
  return (
    <main style={containerStyle}>
      <section style={cardStyle}>
        <h1 style={headingStyle}>Pomoz odpaduum startuje</h1>
        <p style={bodyStyle}>
          Frontend je pripraveny pro dalsi vyvoj. Upravte tuto stranku a
          napojte ji na budouci backend API.
        </p>
      </section>
    </main>
  );
}
