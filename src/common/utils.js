const formatDate = (d) => {
  return d.toISOString().split("T")[0];
};
const formatDateTime = (d) => {
  return d.toISOString().replace("T", " ").slice(0, 16);
};


export { formatDate, formatDateTime };
