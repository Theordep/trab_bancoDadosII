'use client'
import { useState, useEffect } from 'react'
import Alert from './Alert'
import DynamicSelect from './DynamicSelect'

export default function FormMelhorado({ endpoint, method = 'POST', fields, initialData = {}, onSuccess }) {
    const [data, setData] = useState(initialData)
    const [alert, setAlert] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    // Atualizar dados quando initialData muda (para edição)
    useEffect(() => {
        setData(initialData)
    }, [initialData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setAlert({ type: '', message: '' })

        try {
            // Converter valores booleanos string para boolean real
            const processedData = { ...data }

            fields.forEach(field => {
                if (field.name === 'castrado' && typeof processedData[field.name] === 'string') {
                    processedData[field.name] = processedData[field.name] === 'true'
                }
                // Converter números
                if (field.type === 'number' && processedData[field.name]) {
                    processedData[field.name] = parseFloat(processedData[field.name])
                }
                // Converter IDs para integer
                if (field.name.endsWith('_id') && processedData[field.name]) {
                    processedData[field.name] = parseInt(processedData[field.name])
                }
            })

            const response = await fetch(`/api/${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData)
            })

            const result = await response.json()

            if (response.ok) {
                setAlert({ type: 'success', message: result.message })
                if (!initialData.id) {
                    setData({}) // Reset apenas para novos registros
                }
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

    const handleChange = (fieldName, value) => {
        setData(prev => {
            const newData = {
                ...prev,
                [fieldName]: value
            }

            console.log(`Campo ${fieldName} alterado para:`, value) // Debug
            console.log('Dados atuais:', newData) // Debug

            return newData
        })
    }

    const renderField = (field) => {
        const commonProps = {
            required: field.required,
            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        }

        // Select dinâmico
        if (field.type === 'dynamic_select') {
            return (
                <DynamicSelect
                    name={field.name}
                    endpoint={field.endpoint}
                    value={data[field.name] || ''}
                    onChange={(value) => handleChange(field.name, value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    dependsOn={field.dependsOn ?
                        Object.fromEntries(
                            Object.entries(field.dependsOn).map(([key, fieldName]) => [key, data[fieldName]])
                        ) : null
                    }
                    formatOption={field.formatOption}
                />
            )
        }

        // Select estático
        if (field.type === 'select') {
            return (
                <select
                    {...commonProps}
                    name={field.name}
                    value={data[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {field.options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )
        }

        // Textarea
        if (field.type === 'textarea') {
            return (
                <textarea
                    {...commonProps}
                    name={field.name}
                    rows={3}
                    value={data[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                />
            )
        }

        // Input padrão
        return (
            <input
                {...commonProps}
                name={field.name}
                type={field.type || 'text'}
                step={field.type === 'number' ? '0.01' : undefined}
                min={field.min}
                max={field.max}
                value={data[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
            />
        )
    }

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert({ type: '', message: '' })}
                />

                {/* Debug info - remover em produção */}
  {/*               {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                        <strong>Debug:</strong> especie_id = {data.especie_id}, raca_id = {data.raca_id}
                    </div>
                )} */}

                {fields.map(field => (
                    <div key={field.name} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {renderField(field)}
                        {field.help && (
                            <p className="text-xs text-gray-500 mt-1">{field.help}</p>
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