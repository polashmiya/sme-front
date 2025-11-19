import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

import { Check, X, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CUSTOMERS = ['Customer A','Customer B','Customer C','Customer D'];
const users = ['User 1', 'User 2', 'User 3', 'User 4', 'User 5'];
const rows = Array.from({ length: 160 }).map((_,i)=> ({
  id: i+1,
  soNo: 'SO-'+String(4000+i),
  soDate: new Date(2025, 0, (i%28)+1),
  customer: CUSTOMERS[i % CUSTOMERS.length],
  createdBy: users[i % users.length],
  amount: Math.floor(Math.random()*50000)+7000,
}));

export default function SalesOrderApproval() {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(rows.length / pageSize);
  const pageRows = useMemo(() => rows.slice((page-1)*pageSize, page*pageSize), [page]);
  const navigate = useNavigate();

  const toggleAll = (e) => {
    if (e.target.checked) setSelected(pageRows.map(r=>r.id));
    else setSelected([]);
  };
  const toggleOne = (id) => {
    setSelected(sel => sel.includes(id) ? sel.filter(x=>x!==id) : [...sel, id]);
  };
  const approveSelected = () => {
    alert('Approved: ' + selected.join(', '));
    setSelected([]);
  };
  const rejectSelected = () => {
    alert('Rejected: ' + selected.join(', '));
    setSelected([]);
  };
  return (
    <motion.div className="flex flex-col gap-4" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <motion.div className="mb-2 flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <button className="text-primary hover:underline text-sm p-1" onClick={()=>navigate(-1)}><ArrowLeft size={22}/></button>
        <span className="text-lg font-bold text-gray-800">Sales Order Approval</span>
      </motion.div>
      <div className="flex items-center gap-2 mb-2">
        <button className="btn-primary" disabled={!selected.length} onClick={approveSelected}><Check size={16}/> Approve Selected</button>
        <button className="btn-outline text-red-600" disabled={!selected.length} onClick={rejectSelected}><X size={16}/> Reject Selected</button>
        <span className="ml-2 text-sm text-gray-500">Selected: {selected.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="table-base w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-xs uppercase text-gray-600">
              <th><input type="checkbox" checked={selected.length===pageRows.length && pageRows.length>0} onChange={toggleAll} /></th>
              <th>SL</th>
              <th>SO Date</th>
              <th>SO No</th>
              <th>Customer</th>
              <th>Created By</th>
              <th style={{textAlign:'right'}}>Amount (BDT)</th>
              <th style={{textAlign:'center'}}>Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pageRows.map((r,idx) => (
              <motion.tr
                key={r.id}
                className="border-t hover:bg-gray-50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.01 }}
              >
                <>
                  <td><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>toggleOne(r.id)} /></td>
                  <td>{(page-1)*pageSize + idx + 1}</td>
                  <td>{r.soDate.toISOString().split('T')[0]}</td>
                  <td>{r.soNo}</td>
                  <td>{r.customer}</td>
                  <td>{r.createdBy}</td>
                  <td style={{textAlign:"right"}}>৳ {r.amount.toLocaleString()}</td>
                  <td className="text-center">
                    <button className="icon-btn" title="View"><Eye size={16}/></button>
                  </td>
                </>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2 text-sm">
        <span className="text-gray-600">Showing {(page-1)*pageSize + 1} - {Math.min(page*pageSize, rows.length)} of {rows.length}</span>
        <div className="flex items-center gap-2">
          <button disabled={page===1} onClick={()=> setPage(p=> p-1)} className="btn-outline px-2 py-1 disabled:opacity-40">Prev</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page===totalPages} onClick={()=> setPage(p=> p+1)} className="btn-outline px-2 py-1 disabled:opacity-40">Next</button>
        </div>
      </div>
    </motion.div>
  );
}
