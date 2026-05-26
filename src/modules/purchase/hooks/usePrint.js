import { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { useSearchParams } from "react-router-dom";
import { PAGE_STYLE } from "../components/PrintLayout";

/**
 * Encapsulates react-to-print setup for all purchase View pages.
 * - Returns printRef (attach to the hidden print container) and handlePrint (call on button click).
 * - Automatically triggers printing when ?autoprint=1 is present in the URL.
 */
export function usePrint(documentTitle) {
  const [searchParams] = useSearchParams();
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle,
    pageStyle: PAGE_STYLE,
  });

  useEffect(() => {
    if (searchParams.get("autoprint") === "1") {
      const t = setTimeout(() => handlePrint(), 600);
      return () => clearTimeout(t);
    }
  // handlePrint identity is stable; searchParams intentionally omitted so
  // this only fires on mount (matching the ?autoprint=1 entry navigation).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { printRef, handlePrint };
}
