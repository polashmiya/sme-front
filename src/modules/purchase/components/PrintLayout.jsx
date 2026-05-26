// Shared print layout – used by all purchase view pages.
// All styles are inline so they survive react-to-print's iframe copy.

export const PAGE_STYLE = `
  @page { size: A4 portrait; margin: 12mm 15mm; }
  /* Override app globals that get copied into the print iframe */
  html, body {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
    width: auto !important;
  }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #111827; margin: 0; padding: 0; }
  div, section, article { overflow: visible !important; max-height: none !important; }
  table { border-collapse: collapse; width: 100%; page-break-inside: auto; break-inside: auto; }
  thead { display: table-header-group; }
  tfoot { display: table-footer-group; }
  tbody { display: table-row-group; }
  tr { page-break-inside: avoid; break-inside: avoid; page-break-after: auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  th { background: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;

// ─── Status badge colours ────────────────────────────────────────────────────
const STATUS = {
  Draft:              { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" },
  Approved:           { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" },
  "Partially Received":{ bg: "#fef9c3", color: "#a16207", border: "#fde047" },
  Completed:          { bg: "#d1fae5", color: "#065f46", border: "#6ee7b7" },
  Paid:               { bg: "#dbeafe", color: "#1d4ed8", border: "#93c5fd" },
};

// ─── Helper sub-components ───────────────────────────────────────────────────
export function PrintSection({ title, children, style }) {
  return (
    <div className="print-section" style={{ marginBottom: 14, ...style }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: "#374151",
        textTransform: "uppercase", letterSpacing: "0.8px",
        borderBottom: "1.5px solid #16a34a", paddingBottom: 4, marginBottom: 8,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export function PrintRow({ label, value, mono, accent }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "2.5px 0", borderBottom: "1px dotted #f3f4f6",
    }}>
      <span style={{ color: "#6b7280", minWidth: 130, flexShrink: 0, fontSize: 11 }}>{label}</span>
      <span style={{
        color: accent ? "#16a34a" : "#111827", fontWeight: 500,
        fontFamily: mono ? "monospace" : "inherit", textAlign: "right", fontSize: 11,
      }}>
        {value || "—"}
      </span>
    </div>
  );
}

export function PrintTable({ headers, children }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, marginTop: 4 }}>
      <thead>
        <tr style={{ background: "#f9fafb" }}>
          {headers.map(({ label, align = "left" }, i) => (
            <th key={i} style={{
              padding: "5px 6px", border: "1px solid #d1d5db",
              textAlign: align, fontWeight: 600, color: "#374151",
            }}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

export function PrintTd({ children, align = "left", bold, accent, muted, mono, style }) {
  return (
    <td style={{
      padding: "4px 6px", border: "1px solid #e5e7eb",
      textAlign: align,
      fontWeight: bold ? 600 : 400,
      color: accent ? "#16a34a" : muted ? "#6b7280" : "#111827",
      fontFamily: mono ? "monospace" : "inherit",
      ...style,
    }}>
      {children}
    </td>
  );
}

// ─── Main layout wrapper ─────────────────────────────────────────────────────
export default function PurchasePrintLayout({ docType, docNo, docDate, status, children }) {
  const sc = STATUS[status] || STATUS.Draft;

  const printedAt = new Date().toLocaleString("en-BD", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 11, color: "#111827", background: "#fff", width: "100%",
    }}>
      {/* ══ Header ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        paddingBottom: 12, marginBottom: 16, borderBottom: "2px solid #16a34a",
      }}>
        {/* Company */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, background: "#16a34a", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1 }}>C</span>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>Corelium</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>Enterprise Resource Planning</div>
          </div>
        </div>

        {/* Document identity */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.8px" }}>
            {docType}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "monospace", color: "#111827", marginTop: 2 }}>
            {docNo}
          </div>
          {docDate && (
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>
              Date: {typeof docDate === "string" ? docDate
                : new Date(docDate).toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
          )}
          {status && (
            <span style={{
              display: "inline-block", marginTop: 4,
              fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 9999,
              background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
            }}>
              {status}
            </span>
          )}
        </div>
      </div>

      {children}

      {/* ══ Footer ══════════════════════════════════════════════════════════ */}
      <div style={{
        marginTop: 20, paddingTop: 8, borderTop: "1px solid #e5e7eb",
        display: "flex", justifyContent: "space-between",
        fontSize: 9, color: "#9ca3af",
      }}>
        <span>Printed: {printedAt}</span>
        <span>This is a computer-generated document · Corelium ERP</span>
      </div>
    </div>
  );
}
