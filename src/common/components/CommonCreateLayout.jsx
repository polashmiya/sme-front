import FormHeader from "./FormHeader";
import { motion, AnimatePresence } from "framer-motion";
import Table from "./Table";

export default function CommonCreateLayout({
  title,
  headerRight = null,
  onSubmit,
  children,
  className = "card space-y-4",
  // Actions
  onCancel,
  cancelLabel = "Cancel",
  submitLabel = "Save",
  submitDisabled = false,
  actionsRight = null,
  hideActions = false,
  // New: place actions in header instead of footer
  actionsPosition = "footer", // "footer" | "header"
  // Items section (optional)
  itemsTitle = "Items",
  onAddLine,
  addButtonLabel = "+ Add Line",
  // Use common Table when columns + data provided; fallback to itemsTable
  itemsColumns = null,
  itemsData = null,
  itemsTable = null,
  itemsFooter = null,
}) {
  const actionButtons = (
    <div className="flex items-center gap-2">
      {onCancel && (
        <button type="button" className="btn-outline" onClick={onCancel}>
          {cancelLabel}
        </button>
      )}
      {actionsRight}
      <button type="submit" className="btn-primary" disabled={submitDisabled}>
        {submitLabel}
      </button>
    </div>
  );

  const headerRightContent = actionsPosition === "header" ? (
    // When actions in header, render submit/cancel in the right slot
    actionButtons
  ) : (
    headerRight
  );

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <FormHeader title={title} right={headerRightContent} />
        <form onSubmit={onSubmit} className={className}>
          {/* Top fields/content */}
          {children}

          {/* Optional items section */}
          {(itemsColumns && itemsData) || itemsTable ? (
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">{itemsTitle}</h3>
                {onAddLine ? (
                  <button
                    type="button"
                    className="btn-outline text-xs"
                    onClick={onAddLine}
                  >
                    {addButtonLabel}
                  </button>
                ) : null}
              </div>
                {itemsColumns && itemsData ? (
                  <Table columns={itemsColumns} data={itemsData} />
                ) : (
                  itemsTable
                )}
                {itemsFooter}
            </div>
          ) : null}

          {/* Footer actions (optional) */}
          {!hideActions && actionsPosition !== "header" && (
            <div className="flex items-center justify-end gap-2">{actionButtons}</div>
          )}
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
