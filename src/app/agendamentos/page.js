'use client'
import { useState } from 'react'
import Form from '../components/Form'
import CrudTable from '../components/CrudTable'

const agendamentoFields = [
    { name: 'cliente_id', label: 'Cliente ID', type: 'number', required: true },
    { name: 'animal_id', label: 'Animal ID', type: 'number', required: true },
    { name: 'funcionario_id', label: 'Funcionário ID', type: 'number', required: true },
    { name: 'servico_id', label: 'Serviço ID', type: 'number', required: true },
    { name: 'data_agendamento', label: 'Data', type: 'date', required: true },
    { name: 'hora_inicio', label: 'Hora Início', type: 'time', required: true },
    { name: 'hora_fim', label: 'Hora Fim', type: 'time', required: true },
    { name: 'valor', label: 'Valor (R$)', type: 'number', min: 0.01, required: true },
    { name: 'desconto', label: 'Desconto (R$)', type: 'number', min: 0 },
    {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'AGENDADO', label: 'Agendado' },
            { value: 'CONFIRMADO', label: 'Confirmado' },
            { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
            { value: 'CONCLUIDO', label: 'Concluído' }
        ]
    },
    { name: 'observacoes', label: 'Observações', type: 'textarea' }
]

const agendamentoColumns = [
    { key: 'id', label: 'ID' },
    { key: 'data_agendamento', label: 'Data', format: (value) => new Date(value).toLocaleDateString('pt-BR') },
    { key: 'hora_inicio', label: 'Início' },
    { key: 'hora_fim', label: 'Fim' },
    { key: 'cliente_nome', label: 'Cliente' },
    { key: 'animal_nome', label: 'Animal' },
    { key: 'servico_nome', label: 'Serviço' },
    {
        key: 'status',
        label: 'Status',
        format: (value) => {
            const colors = {
                'AGENDADO': 'bg-yellow-100 text-yellow-800',
                'CONFIRMADO': 'bg-blue-100 text-blue-800',
                'EM_ANDAMENTO': 'bg-purple-100 text-purple-800',
                'CONCLUIDO': 'bg-green-100 text-green-800'
            }
            return `<span class="px-2 py-1 rounded text-xs ${colors[value] || 'bg-gray-100 text-gray-800'}">${value}</span>`
        }
    },
    { key: 'valor_final', label: 'Valor Final', format: (value) => `R$ ${parseFloat(value).toFixed(2)}` }
]

export default function AgendamentosPage() {
    const [editingAgendamento, setEditingAgendamento] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [refresh, setRefresh] = useState(0)

    const handleSuccess = () => {
        setShowForm(false)
        setEditingAgendamento(null)
        setRefresh(prev => prev + 1)
    }

    const handleEdit = (agendamento) => {
        // Formatar dados para o formulário
        const formatted = {
            ...agendamento,
            data_agendamento: new Date(agendamento.data_agendamento).toISOString().split('T')[0]
        }
        setEditingAgendamento(formatted)
        setShowForm(true)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">📅 Gestão de Agendamentos</h1>
                    <p className="text-gray-600">CRUD com functions e cálculos automáticos</p>
                </div>
                <button
                    onClick={() => {
                        setEditingAgendamento(null)
                        setShowForm(!showForm)
                    }}
                    className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                    {showForm ? '❌ Cancelar' : '➕ Novo Agendamento'}
                </button>
            </div>

            {/* BD II Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-purple-800 mb-3">🧮 Recursos de Banco de Dados II:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong className="text-purple-700">Function em Ação:</strong>
                        <p className="text-purple-600">
                            <code className="bg-white px-1 rounded">calcular_valor_final(valor, desconto)</code>
                            <br />• Validação automática • Cálculo preciso • Exception handling
                        </p>
                    </div>
                    <div>
                        <strong className="text-purple-700">Query Complexa:</strong>
                        <p className="text-purple-600">
                            JOIN de 5 tabelas: agendamentos + clientes + animais + funcionários + serviços
                        </p>
                    </div>
                    <div>
                        <strong className="text-purple-700">Validações:</strong>
                        <p className="text-purple-600">
                            • Conflito de horários • Valores positivos • Constraints automáticas
                        </p>
                    </div>
                    <div>
                        <strong className="text-purple-700">Status Control:</strong>
                        <p className="text-purple-600">
                            DELETE = Cancelamento (não remove fisicamente)
                        </p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                    <strong className="text-yellow-800">💡 Teste a Function:</strong>
                    <p className="text-yellow-700 text-sm">
                        Crie um agendamento com desconto maior que o valor para ver a validação da function!
                    </p>
                </div>
            </div>

            {/* Formulário */}
            {showForm && (
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {editingAgendamento ? '✏️ Editar Agendamento' : '➕ Novo Agendamento'}
                        </h2>
                        <Form
                            endpoint={editingAgendamento ? `agendamentos/${editingAgendamento.id}` : 'agendamentos'}
                            method={editingAgendamento ? 'PUT' : 'POST'}
                            fields={agendamentoFields}
                            initialData={editingAgendamento || {}}
                            onSuccess={handleSuccess}
                        />
                    </div>
                </div>
            )}

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">📋 Lista de Agendamentos</h2>
                    <p className="text-gray-600 text-sm">
                        Dados processados pela function calcular_valor_final() automaticamente
                    </p>
                </div>
                <div className="p-6">
                    <CrudTable
                        endpoint="agendamentos"
                        columns={agendamentoColumns}
                        onEdit={handleEdit}
                        refresh={refresh}
                    />
                </div>
            </div>
        </div>
    )
}