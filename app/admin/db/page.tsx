"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Database, Table, AlertCircle, RefreshCw, Trash2, Edit2, Plus } from "lucide-react";

export default function AdminDatabasePage() {
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
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
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTableData = async (tableName: string) => {
        if (!user) return;
        setSelectedTable(tableName);
        setDataLoading(true);
        setError(null);
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
                    payload: { offset: 0 }
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

        // Find a primary key (usually 'id' or ends with '_id')
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

            // Refresh
            fetchTableData(selectedTable!);
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
        <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 flex gap-6">

            {/* Sidebar with Tables */}
            <div className="w-64 flex-shrink-0 bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
                    <Database className="text-primary" size={20} />
                    <h2 className="font-bold text-white">Postgres DB</h2>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {tables.map(table => (
                        <button
                            key={table}
                            onClick={() => fetchTableData(table)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${selectedTable === table
                                    ? 'bg-primary/20 text-primary font-bold border border-primary/30'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Table size={16} />
                            {table}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-[#111] border border-white/10 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
                {selectedTable ? (
                    <>
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <h2 className="font-bold text-white text-xl flex items-center gap-2">
                                <Table className="text-primary" />
                                {selectedTable}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchTableData(selectedTable)}
                                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                                    title="Refresh Data"
                                >
                                    <RefreshCw size={18} className={dataLoading ? "animate-spin" : ""} />
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-black font-bold rounded-lg transition-all">
                                    <Plus size={18} />
                                    Add Row
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-black/50 p-4">
                            {dataLoading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader2 size={32} className="text-primary animate-spin" />
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                                    {error}
                                </div>
                            ) : tableData.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                    <Table size={48} className="opacity-20" />
                                    <p>No rows found in this table.</p>
                                </div>
                            ) : (
                                <div className="border border-white/10 rounded-lg overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                                                <th className="p-3 w-16 text-center">Actions</th>
                                                {columns.map(col => (
                                                    <th key={col.column_name} className="p-3 font-medium whitespace-nowrap">
                                                        {col.column_name}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {tableData.map((row, i) => (
                                                <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                    <td className="p-2 flex items-center justify-center gap-2">
                                                        <button className="p-1.5 text-blue-400 hover:bg-blue-400/20 rounded opacity-0 group-hover:opacity-100 transition-all">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(row)}
                                                            className="p-1.5 text-red-400 hover:bg-red-400/20 rounded opacity-0 group-hover:opacity-100 transition-all">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                    {columns.map(col => {
                                                        const val = row[col.column_name];
                                                        const displayVal = val === null ? "NULL" :
                                                            typeof val === 'object' ? JSON.stringify(val) :
                                                                String(val);
                                                        return (
                                                            <td key={col.column_name} className="p-3 text-sm text-gray-300 max-w-[200px] truncate" title={displayVal}>
                                                                {val === null ? <span className="text-gray-600 italic">NULL</span> : displayVal}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                        <Database size={64} className="opacity-20" />
                        <p className="text-lg">Select a table from the sidebar to view data</p>
                    </div>
                )}
            </div>

        </div>
    );
}
