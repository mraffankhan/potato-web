"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Database, Table, AlertCircle, RefreshCw, Trash2, Edit2, Plus, ChevronLeft, ChevronRight, Search, Menu, X } from "lucide-react";

export default function AdminDatabasePage() {
    const [tables, setTables] = useState<string[]>([]);
    const [filteredTables, setFilteredTables] = useState<string[]>([]);
    const [searchTable, setSearchTable] = useState("");

    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const router = useRouter();
    const DEVS = ["1449081308616720628"];

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/");
                return;
            }

            const discordId = session.user.user_metadata.provider_id;
            if (!DEVS.includes(discordId)) {
                setError("You are not authorized to view this page.");
                setLoading(false);
                return;
            }

            setUser(session.user);
            await fetchTables(discordId);
        };
        init();
    }, []);

    useEffect(() => {
        if (searchTable.trim() === "") {
            setFilteredTables(tables);
        } else {
            setFilteredTables(tables.filter(t => t.toLowerCase().includes(searchTable.toLowerCase())));
        }
    }, [searchTable, tables]);

    const fetchTables = async (userId: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/db/tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setTables(data.tables || []);
            setFilteredTables(data.tables || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTableData = async (tableName: string, pageIndex = 0) => {
        if (!user) return;
        setSelectedTable(tableName);
        setPage(pageIndex);
        setDataLoading(true);
        setError(null);
        setSidebarOpen(false); // Close sidebar on mobile after selection

        try {
            // Fetch Columns First
            const colRes = await fetch('/api/admin/db/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.user_metadata.provider_id,
                    action: 'read_columns',
                    table: tableName
                })
            });
            const colData = await colRes.json();
            if (colData.error) throw new Error(colData.error);
            setColumns(colData.data || []);

            // Fetch Data
            const dataRes = await fetch('/api/admin/db/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.user_metadata.provider_id,
                    action: 'read',
                    table: tableName,
                    payload: { offset: pageIndex * 100 }
                })
            });
            const rowData = await dataRes.json();
            if (rowData.error) throw new Error(rowData.error);
            setTableData(rowData.data || []);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setDataLoading(false);
        }
    };

    const handleDelete = async (row: any) => {
        if (!confirm("Are you sure you want to delete this row?")) return;

        const idCol = columns.find(c => c.column_name === 'id' || c.column_name.endsWith('_id'));
        if (!idCol) {
            alert("Could not identify a primary key to delete this row safely.");
            return;
        }

        try {
            const res = await fetch('/api/admin/db/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.user_metadata.provider_id,
                    action: 'delete',
                    table: selectedTable,
                    payload: {
                        idField: idCol.column_name,
                        idValue: row[idCol.column_name]
                    }
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            fetchTableData(selectedTable!, page);
        } catch (err: any) {
            alert("Error deleting row: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 size={48} className="text-primary animate-spin" />
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4 text-center px-4">
                <AlertCircle size={48} className="text-red-500" />
                <h1 className="text-2xl font-bold text-white">Access Denied</h1>
                <p className="text-red-400">{error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pt-24 pb-12 px-2 sm:px-6 relative flex flex-col md:flex-row gap-6">

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
                <h2 className="font-bold text-white flex items-center gap-2">
                    <Database className="text-primary" size={20} />
                    {selectedTable ? selectedTable : "Select Database Table"}
                </h2>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white/10 rounded-lg text-white">
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar (Tables List) */}
            <div className={`
                absolute md:relative z-20 w-full md:w-72 flex-shrink-0 bg-black/80 md:bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex-col h-[70vh] md:h-[calc(100vh-140px)] transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'flex top-40 left-0 px-2' : 'hidden md:flex'}
            `}>
                <div className="p-4 border-b border-white/10 bg-white/5 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Database className="text-primary" size={20} />
                        <h2 className="font-bold text-white text-lg tracking-wide">Database</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search tables..."
                            value={searchTable}
                            onChange={(e) => setSearchTable(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                    {filteredTables.length > 0 ? filteredTables.map(table => (
                        <button
                            key={table}
                            onClick={() => fetchTableData(table, 0)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-all duration-200 ${selectedTable === table
                                ? 'bg-primary/10 text-primary font-bold border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Table size={16} className={selectedTable === table ? "text-primary" : "opacity-70"} />
                            <span className="truncate">{table}</span>
                        </button>
                    )) : (
                        <div className="text-center text-gray-500 py-4 text-sm italic">No tables found.</div>
                    )}
                </div>
            </div>

            {/* Main Content Area (Data Viewer) */}
            <div className="flex-1 bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] shadow-2xl">
                {selectedTable ? (
                    <>
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex flex-wrap items-center justify-between gap-4">
                            <h2 className="font-bold text-white text-xl flex items-center gap-2">
                                <Table className="text-primary" />
                                {selectedTable}
                                <span className="text-xs font-normal text-gray-500 bg-black/50 px-2 py-1 rounded-full border border-white/5 ml-2">
                                    {tableData.length || 0} rows
                                </span>
                            </h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Pagination Controls */}
                                <div className="flex items-center bg-black/50 border border-white/10 rounded-lg overflow-hidden mr-2">
                                    <button
                                        onClick={() => fetchTableData(selectedTable, Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="px-3 text-sm text-gray-300 border-x border-white/10 font-mono">
                                        Pg {page + 1}
                                    </span>
                                    <button
                                        onClick={() => fetchTableData(selectedTable, page + 1)}
                                        disabled={tableData.length < 100} // Hardcoded limit from API
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => fetchTableData(selectedTable, page)}
                                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors border border-transparent hover:border-white/10"
                                    title="Refresh Data"
                                >
                                    <RefreshCw size={18} className={dataLoading ? "animate-spin text-primary" : ""} />
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary/90 hover:bg-primary text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">
                                    <Plus size={18} />
                                    <span className="hidden sm:inline">Add Row</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-black/40 p-0 sm:p-4">
                            {dataLoading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4">
                                    <Loader2 size={40} className="text-primary animate-spin" />
                                    <p className="text-gray-400 animate-pulse font-medium">Querying {selectedTable}...</p>
                                </div>
                            ) : error ? (
                                <div className="m-4 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg flex items-start gap-3">
                                    <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-red-400">Query Failed</h3>
                                        <p className="text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            ) : tableData.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                                        <Table size={32} className="opacity-30" />
                                    </div>
                                    <p className="text-lg font-medium text-gray-400">No data found</p>
                                    <p className="text-sm">Page {page + 1} of {selectedTable} is currently empty.</p>
                                </div>
                            ) : (
                                <div className="border-y sm:border sm:rounded-xl border-white/10 overflow-hidden shadow-2xl bg-[#0a0a0a]">
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-max">
                                            <thead>
                                                <tr className="bg-white/5 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                                                    <th className="p-4 w-16 text-center sticky left-0 bg-[#161616] border-r border-white/5 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.2)]">Actions</th>
                                                    {columns.map(col => (
                                                        <th key={col.column_name} className="p-4 font-semibold text-gray-300">
                                                            {col.column_name}
                                                            <span className="block text-[10px] text-gray-600 font-mono mt-0.5 normal-case">{col.data_type}</span>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-sm">
                                                {tableData.map((row, i) => (
                                                    <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                                                        <td className="p-3 flex items-center justify-center gap-2 sticky left-0 bg-[#0a0a0a] group-hover:bg-[#111] border-r border-white/5 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.1)] transition-colors">
                                                            <button className="p-1.5 text-blue-400 hover:bg-blue-400/20 hover:text-blue-300 rounded opacity-50 sm:opacity-0 group-hover:opacity-100 transition-all">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(row)}
                                                                className="p-1.5 text-red-500 hover:bg-red-500/20 hover:text-red-400 rounded opacity-50 sm:opacity-0 group-hover:opacity-100 transition-all">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                        {columns.map(col => {
                                                            const val = row[col.column_name];
                                                            const isNull = val === null;
                                                            const isBool = typeof val === 'boolean' || val === 1 || val === 0;
                                                            const displayVal = isNull ? "NULL" :
                                                                typeof val === 'object' ? JSON.stringify(val) :
                                                                    String(val);

                                                            return (
                                                                <td key={col.column_name} className="p-4 text-gray-300 max-w-[300px]" title={displayVal}>
                                                                    <div className="truncate">
                                                                        {isNull ? (
                                                                            <span className="px-2 py-0.5 rounded bg-white/5 text-gray-500 italic text-xs border border-white/5">NULL</span>
                                                                        ) : (
                                                                            <span className={typeof val === 'number' ? 'text-blue-300 font-mono' : typeof val === 'string' && val.startsWith('{') ? 'text-green-300 font-mono' : ''}>
                                                                                {displayVal}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-5 p-6 text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
                            <Database size={40} className="text-primary/70" />
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Database Explorer</h3>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            Welcome to the Developer Control Panel. Select any table from the sidebar to inspect, modify, or manage its corresponding data dynamically.
                        </p>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
