'use client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await fetch('/api/dashboard')
            if (response.ok) {
                const result = await response.json()
                setData(result)
            } else {
                const errorData = await response.json()
                setError(errorData.error || 'Erro ao carregar dashboard')
            }
        } catch (error) {
            setError('Erro de comunicação com o servidor')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Carregando dashboard...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    ❌ {error}
                </div>
                <button
                    onClick={loadDashboard}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Tentar Novamente
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Dashboard</h1>
                <p className="text-xl text-gray-600">Views PostgreSQL em Tempo Real</p>
            </div>

            {/* Views Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-blue-800 mb-3">🔍 Views PostgreSQL Utilizadas:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                        <strong className="text-blue-700">vw_agendamentos_detalhados</strong>
                        <p className="text-blue-600">JOINs complexos com 5 tabelas</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <strong className="text-green-700">vw_produtos_estoque_baixo</strong>
                        <p className="text-green-600">Lógica de negócio com níveis de alerta</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                        <strong className="text-purple-700">vw_historico_medico_completo</strong>
                        <p className="text-purple-600">Histórico médico com relacionamentos</p>
                    </div>
                </div>
                <div className="mt-4 text-xs text-blue-600">
                    ⏱️ Última atualização: {data?.timestamp ? new Date(data.timestamp).toLocaleString('pt-BR') : 'N/A'}
                </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-blue-500 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold">{data?.estatisticas?.total_clientes || 0}</div>
                    <div className="text-sm opacity-90">Clientes Ativos</div>
                </div>
                <div className="bg-green-500 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold">{data?.estatisticas?.total_animais || 0}</div>
                    <div className="text-sm opacity-90">Animais Cadastrados</div>
                </div>
                <div className="bg-purple-500 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold">{data?.agendamentosHoje?.length || 0}</div>
                    <div className="text-sm opacity-90">Agendamentos Hoje</div>
                </div>
                <div className="bg-orange-500 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold">{data?.estatisticas?.total_produtos || 0}</div>
                    <div className="text-sm opacity-90">Produtos Ativos</div>
                </div>
                <div className="bg-red-500 text-white p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold">{data?.alertasEstoque?.length || 0}</div>
                    <div className="text-sm opacity-90">Alertas de Estoque</div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Agendamentos Hoje */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-blue-600 flex items-center">
                        📅 Agendamentos de Hoje
                        <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded">
                            vw_agendamentos_detalhados
                        </span>
                    </h2>

                    {!data?.agendamentosHoje || data.agendamentosHoje.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">📅</div>
                            <p>Nenhum agendamento para hoje</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.agendamentosHoje.slice(0, 5).map((ag, i) => (
                                <div key={i} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                {ag.hora_inicio} - {ag.cliente}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                🐾 {ag.animal} | 🏥 {ag.servico}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                👨‍⚕️ {ag.funcionario} | 📂 {ag.categoria_servico}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${ag.status === 'CONFIRMADO' ? 'bg-green-100 text-green-800' :
                                                ag.status === 'AGENDADO' ? 'bg-yellow-100 text-yellow-800' :
                                                    ag.status === 'EM_ANDAMENTO' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {ag.status}
                                            </span>
                                            <div className="text-sm font-medium mt-1">
                                                R$ {parseFloat(ag.valor_final).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {data.agendamentosHoje.length > 5 && (
                                <div className="text-center text-gray-500 text-sm">
                                    ... e mais {data.agendamentosHoje.length - 5} agendamentos
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Alertas de Estoque */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-red-600 flex items-center">
                        ⚠️ Alertas de Estoque
                        <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded">
                            vw_produtos_estoque_baixo
                        </span>
                    </h2>

                    {!data?.alertasEstoque || data.alertasEstoque.length === 0 ? (
                        <div className="text-center py-8 text-green-600">
                            <div className="text-4xl mb-2">✅</div>
                            <p>Todos os produtos com estoque adequado!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.alertasEstoque.map((produto, i) => (
                                <div key={i} className={`p-4 rounded border-l-4 ${produto.nivel_alerta === 'CRÍTICO' ? 'bg-red-50 border-red-500' :
                                    produto.nivel_alerta === 'SEM_ESTOQUE' ? 'bg-red-100 border-red-600' :
                                        'bg-yellow-50 border-yellow-500'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-gray-800">{produto.nome}</div>
                                            <div className="text-sm text-gray-600">
                                                {produto.categoria} • {produto.marca || 'S/marca'}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                📦 Estoque: {produto.estoque_diario} | Mínimo: {produto.estoque_minimo}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${produto.nivel_alerta === 'CRÍTICO' ? 'bg-red-200 text-red-800' :
                                                produto.nivel_alerta === 'SEM_ESTOQUE' ? 'bg-red-300 text-red-900' :
                                                    'bg-yellow-200 text-yellow-800'
                                                }`}>
                                                {produto.nivel_alerta}
                                            </span>
                                            <div className="text-sm mt-1">
                                                Repor: {produto.quantidade_repor}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Últimos Atendimentos */}
                <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4 text-green-600 flex items-center">
                        🏥 Últimos Atendimentos Médicos
                        <span className="text-xs text-gray-500 ml-2 bg-gray-100 px-2 py-1 rounded">
                            vw_historico_medico_completo
                        </span>
                    </h2>

                    {!data?.ultimosAtendimentos || data.ultimosAtendimentos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">🏥</div>
                            <p>Nenhum atendimento registrado recentemente</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Data</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Animal</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Proprietário</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Espécie</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Veterinário</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Diagnóstico</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.ultimosAtendimentos.map((atendimento, i) => (
                                        <tr key={i} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {new Date(atendimento.data_atendimento).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {atendimento.animal}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {atendimento.proprietario}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {atendimento.especie}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {atendimento.veterinario}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {atendimento.tipo_atendimento}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {atendimento.diagnostico || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Reload Button */}
            <div className="text-center mt-8">
                <button
                    onClick={loadDashboard}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    🔄 Atualizar Dashboard
                </button>
            </div>
        </div>
    )
}