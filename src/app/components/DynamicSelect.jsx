'use client'
import { useState, useEffect } from 'react'

export default function DynamicSelect({
    endpoint,
    value,
    onChange,
    placeholder = "Selecione...",
    required = false,
    disabled = false,
    dependsOn = null,
    formatOption = null,
    className = "",
    name = ""
}) {
    const [options, setOptions] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadOptions = async () => {
        // Se depende de outro campo e ele não está preenchido, não carrega
        if (dependsOn) {
            const dependencyValues = Object.values(dependsOn)
            const hasEmptyDependency = dependencyValues.some(val => !val)
            if (hasEmptyDependency) {
                setOptions([])
                return
            }
        }

        setLoading(true)
        setError('')

        try {
            let url = `/api/${endpoint}`

            // Adicionar parâmetros de dependência
            if (dependsOn) {
                const params = new URLSearchParams()
                Object.entries(dependsOn).forEach(([key, val]) => {
                    if (val) params.append(key, val)
                })
                if (params.toString()) {
                    url += `?${params.toString()}`
                }
            }

            const response = await fetch(url)
            if (response.ok) {
                const data = await response.json()
                setOptions(Array.isArray(data) ? data : [])
            } else {
                setError('Erro ao carregar opções')
                setOptions([])
            }
        } catch (error) {
            console.error('Erro ao carregar opções:', error)
            setError('Erro de comunicação')
            setOptions([])
        } finally {
            setLoading(false)
        }
    }

    // Carregar opções quando dependência muda
    useEffect(() => {
        loadOptions()
    }, [endpoint, JSON.stringify(dependsOn)]) // JSON.stringify para comparar objetos

    // Limpar valor quando dependência muda (mas não resetar se está carregando dados iniciais)
    useEffect(() => {
        if (dependsOn && value) {
            const dependencyValues = Object.values(dependsOn)
            const hasEmptyDependency = dependencyValues.some(val => !val)
            if (hasEmptyDependency) {
                onChange('')
            }
        }
    }, [JSON.stringify(dependsOn)])

    const defaultFormatOption = (option) => {
        if (option.nome) return `${option.nome}${option.cpf ? ` (${option.cpf})` : ''}`
        return option.label || option.name || String(option.id)
    }

    const formatFn = formatOption || defaultFormatOption

    const isDisabled = disabled || loading || (dependsOn && Object.values(dependsOn).some(val => !val))

    return (
        <div className={className}>
            <select
                name={name}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={isDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                <option value="">
                    {loading ? 'Carregando...' :
                        error ? 'Erro ao carregar' :
                            isDisabled && dependsOn ? 'Selecione a espécie primeiro' :
                                placeholder}
                </option>
                {options.map(option => (
                    <option key={option.id} value={option.id}>
                        {formatFn(option)}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}

            {loading && (
                <p className="text-blue-500 text-xs mt-1">Carregando opções...</p>
            )}

            {dependsOn && Object.values(dependsOn).some(val => !val) && (
                <p className="text-gray-500 text-xs mt-1">
                    Selecione {Object.keys(dependsOn)[0].replace('_id', '')} primeiro
                </p>
            )}
        </div>
    )
}