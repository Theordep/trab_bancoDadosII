'use client'
import { useState } from 'react'
import Form from '../components/Form'
import CrudTable from '../components/CrudTable'

const clienteFields = [
    { name: 'nome', label: 'Nome Completo', required: true },
    { name: 'cpf', label: 'CPF', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'telefone', label: 'Telefone Fixo', type: 'tel' },
    { name: 'celular', label: 'Celular', type: 'tel', required: true },
    { name: 'endereco', label: 'Endereço', type: 'textarea' },
    { name: 'bairro', label: 'Bairro' },
    { name: 'cep', label: 'CEP' },
    { name: 'cidade_id', label: 'Cidade ID', type: 'number' }
]

const clienteColumns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'email', label: 'Email' },
    { key: 'celular', label: 'Celular' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'estado', label: 'Estado' }
]

export default function ClientesPage() {
    const [editingClient, setEditingClient] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [refresh, setRefresh] = useState(0)

    const handleSuccess = () => {
        setShowForm(false)
        setEditingClient(null)
        setRefresh(prev => prev + 1)
    }

    const handleEdit = (client) => {
        setEditingClient(client)
        setShowForm(true)
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingClient(null)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">👥 Gestão de Clientes</h1>
                    <p className="text-gray-600">CRUD completo com stored procedures</p>
                </div>
                <button
                    onClick={() => {
                        setEditingClient(null)
                        setShowForm(!showForm)
                    }}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    {showForm ? '❌ Cancelar' : '➕ Novo Cliente'}
                </button>
            </div>

            {/* BD II Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-green-800 mb-3">🔧 Recursos de Banco de Dados II:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong className="text-green-700">CREATE:</strong>
                        <p className="text-green-600">
                            Procedure <code className="bg-white px-1 rounded">inserir_cliente()</code> com validações:
                            <br />• CPF único • Email único • Cidade válida
                        </p>
                    </div>
                    <div>
                        <strong className="text-green-700">READ:</strong>
                        <p className="text-green-600">
                            Query com JOINs: clientes + cidades + estados
                        </p>
                    </div>
                    <div>
                        <strong className="text-green-700">UPDATE:</strong>
                        <p className="text-green-600">
                            SQL tradicional com timestamp automático
                        </p>
                    </div>
                    <div>
                        <strong className="text-green-700">DELETE:</strong>
                        <p className="text-green-600">
                            Soft delete (ativo = false)
                        </p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                    <strong className="text-yellow-800">💡 Teste o Exception Handling:</strong>
                    <p className="text-yellow-700 text-sm">
                        Tente cadastrar um cliente com CPF duplicado para ver o RAISE EXCEPTION sendo capturado!
                    </p>
                </div>
            </div>

            {/* Formulário */}
            {showForm && (
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {editingClient ? '✏️ Editar Cliente' : '➕ Cadastrar Novo Cliente'}
                        </h2>
                        <Form
                            endpoint={editingClient ? `clientes/${editingClient.id}` : 'clientes'}
                            method={editingClient ? 'PUT' : 'POST'}
                            fields={clienteFields}
                            initialData={editingClient || {}}
                            onSuccess={handleSuccess}
                        />
                        <div className="text-center mt-4">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">📋 Lista de Clientes</h2>
                    <p className="text-gray-600 text-sm">
                        Dados carregados com JOIN de 3 tabelas: clientes, cidades e estados
                    </p>
                </div>
                <div className="p-6">
                    <CrudTable
                        endpoint="clientes"
                        columns={clienteColumns}
                        onEdit={handleEdit}
                        refresh={refresh}
                    />
                </div>
            </div>
        </div>
    )
}