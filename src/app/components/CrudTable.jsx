'use client'
import { useState, useEffect } from 'react'

export default function CrudTable({ endpoint, columns, onEdit, refresh, customActions }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadData = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch(`/api/${endpoint}`)
            if (response.ok) {
                const result = await response.json()
                setData(Array.isArray(result) ? result : [])
            } else {
                setError('Erro ao carregar dados')
            }
        } catch (error) {
            console.error('Erro:', error)
            setError('Erro de comunicação')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [endpoint, refresh])

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja remover este registro?')) return

        try {
            const response = await fetch(`/api/${endpoint}/${id}`, {
                method: 'DELETE'
            })

            const result = await response.json()

            if (response.ok) {
                alert('✅ ' + result.message)
                loadData()
            } else {
                alert('❌ Erro: ' + result.error)
            }
        } catch (error) {
            alert('❌ Erro de comunicação')
        }
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Carregando...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-600">
                <p>❌ {error}</p>
                <button
                    onClick={loadData}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Tentar novamente
                </button>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                                {col.label}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                                📋 Nenhum registro encontrado
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item.id || index} className="border-b hover:bg-gray-50 transition-colors">
                                {columns.map(col => (
                                    <td key={col.key} className="px-4 py-3 text-sm text-gray-900">
                                        {col.format ? col.format(item[col.key]) : (item[col.key] || '-')}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onEdit?.(item)}
                                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                                            title="Remover"
                                        >
                                            🗑️
                                        </button>
                                        {customActions?.(item)}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}