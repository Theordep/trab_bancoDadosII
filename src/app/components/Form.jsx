'use client'
import { useState } from 'react'
import Alert from './Alert'

export default function Form({ endpoint, method = 'POST', fields, initialData = {}, onSuccess }) {
    const [data, setData] = useState(initialData)
    const [alert, setAlert] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setAlert({ type: '', message: '' })

        try {
            const response = await fetch(`/api/${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.ok) {
                setAlert({ type: 'success', message: result.message })
                if (!initialData.id) setData({}) // Reset apenas para novos registros
                onSuccess?.()
            } else {
                setAlert({ type: 'error', message: result.error })
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Erro de comunicação com o servidor' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ type: '', message: '' })}
                />

                {fields.map(field => (
                    <div key={field.name} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === 'select' ? (
                            <select
                                required={field.required}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data[field.name] || ''}
                                onChange={(e) => setData(prev => ({
                                    ...prev,
                                    [field.name]: e.target.value
                                }))}
                            >
                                <option value="">Selecione...</option>
                                {field.options?.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === 'textarea' ? (
                            <textarea
                                required={field.required}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data[field.name] || ''}
                                onChange={(e) => setData(prev => ({
                                    ...prev,
                                    [field.name]: e.target.value
                                }))}
                            />
                        ) : (
                            <input
                                type={field.type || 'text'}
                                required={field.required}
                                step={field.type === 'number' ? '0.01' : undefined}
                                min={field.min}
                                max={field.max}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={data[field.name] || ''}
                                onChange={(e) => setData(prev => ({
                                    ...prev,
                                    [field.name]: e.target.value
                                }))}
                            />
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Processando...' : (initialData.id ? 'Atualizar' : 'Salvar')}
                </button>
            </form>
        </div>
    )
}