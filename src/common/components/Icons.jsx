import { Eye, Pencil, Printer, Trash2 } from "lucide-react";

const PView = ({ onClick = () => {}, title = "View", btnStyle = {} }) => (
  <button
    className="icon-btn"
    type="button"
    title={title}
    onClick={onClick}
    style={btnStyle}
  >
    <Eye size={14} />
  </button>
);

const PEdit = ({ onClick = () => {}, title = "Edit", btnStyle = {} }) => (
  <button
    className="icon-btn"
    type="button"
    title={title}
    onClick={onClick}
    style={btnStyle}
  >
    <Pencil size={14} />
  </button>
);
const PPrint = ({ onClick = () => {}, title = "Print", btnStyle = {} }) => (
  <button
    className="icon-btn"
    type="button"
    title={title}
    onClick={onClick}
    style={btnStyle}
  >
    <Printer size={14} />
  </button>
);
const PDelete = ({ onClick = () => {}, title = "Delete", btnStyle = {} }) => (
  <button
    className="icon-btn text-red-600"
    type="button"
    title={title}
    onClick={onClick}
    style={btnStyle}
  >
    <Trash2 size={14} />
  </button>
);

export { PView, PEdit, PPrint, PDelete };
