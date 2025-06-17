'use client'
import { useState } from 'react'
import Form from '../components/Form'
import CrudTable from '../components/CrudTable'

const produtoFields = [
    { name: 'nome', label: 'Nome do Produto', required: true },
    { name: 'categoria', label: 'Categoria' },
    { name: 'marca', label: 'Marca' },
    { name: 'codigo_barras', label: 'Código de Barras' },
    { name: 'preco_custo', label: 'Preço de Custo (R$)', type: 'number', min: 0 },
    { name: 'preco_venda', label: 'Preço de Venda (R$)', type: 'number', min: 0.01, required: true },
    { name: 'estoque_inicial', label: 'Estoque Inicial', type: 'number', min: 0 },
    { name: 'estoque_minimo', label: 'Estoque Mínimo', type: 'number', min: 0 },
    {
        name: 'unidade_medida',
        label: 'Unidade',
        type: 'select',
        options: [
            { value: 'UN', label: 'Unidade' },
            { value: 'KG', label: 'Quilograma' },
            { value: 'L', label: 'Litro' },
            { value: 'ML', label: 'Mililitro' },
            { value: 'G', label: 'Grama' },
            { value: 'PCT', label: 'Pacote' }
        ]
    },
    { name: 'descricao', label: 'Descrição', type: 'textarea' }
]

const produtoColumns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'marca', label: 'Marca' },
    { key: 'preco_venda', label: 'Preço', format: (value) => `R$ ${parseFloat(value).toFixed(2)}` },
    { key: 'estoque_atual', label: 'Estoque' },
    { key: 'estoque_minimo', label: 'Est. Mín.' },
    { key: 'unidade_medida', label: 'Unidade' }
]

export default function ProdutosPage() {
    const [editingProduto, setEditingProduto] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [showEstoque, setShowEstoque] = useState(false)
    const [selectedProduto, setSelectedProduto] = useState(null)
    const [refresh, setRefresh] = useState(0)

    const handleSuccess = () => {
        setShowForm(false)
        setShowEstoque(false)
        setEditingProduto(null)
        setSelectedProduto(null)
        setRefresh(prev => prev + 1)
    }

    const handleEdit = (produto) => {
        setEditingProduto(produto)
        setShowForm(true)
        setShowEstoque(false)
    }

    const handleEstoque = (produto) => {
        setSelectedProduto(produto)
        setShowEstoque(true)
        setShowForm(false)
    }

    const handleEstoqueSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = {
            quantidade: parseInt(formData.get('quantidade')),
            operacao: formData.get('operacao')
        }

        try {
            const response = await fetch(`/api/produtos/${selectedProduto.id}/estoque`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.ok) {
                alert('✅ ' + result.message)
                handleSuccess()
            } else {
                alert('❌ Erro: ' + result.error)
            }
        } catch (error) {
            alert('❌ Erro de comunicação')
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">📦 Gestão de Produtos</h1>
                    <p className="text-gray-600">CRUD completo + Controle de estoque com procedures</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProduto(null)
                        setShowForm(!showForm)
                        setShowEstoque(false)
                    }}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    {showForm ? '❌ Cancelar' : '➕ Novo Produto'}
                </button>
            </div>

            {/* BD II Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-orange-800 mb-3">📦 Recursos de Banco de Dados II:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong className="text-orange-700">Procedure de Estoque:</strong>
                        <p className="text-orange-600">
                            <code className="bg-white px-1 rounded">atualizar_estoque_produto(id, qtd, operacao)</code>
                            <br />• VENDA, COMPRA, AJUSTE • Validação de estoque • Exception handling
                        </p>
                    </div>
                    <div>
                        <strong className="text-orange-700">Operações:</strong>
                        <p className="text-orange-600">
                            • VENDA: diminui estoque • COMPRA: aumenta estoque • AJUSTE: define valor exato
                        </p>
                    </div>
                    <div>
                        <strong className="text-orange-700">Validações:</strong>
                        <p className="text-orange-600">
                            • Estoque suficiente • Produto ativo • Quantidades positivas
                        </p>
                    </div>
                    <div>
                        <strong className="text-orange-700">Constraints:</strong>
                        <p className="text-orange-600">
                            • Preços positivos • Soft delete • Timestamps automáticos
                        </p>
                    </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 rounded border border-yellow-300">
                    <strong className="text-yellow-800">💡 Teste a Procedure:</strong>
                    <p className="text-yellow-700 text-sm">
                        Cadastre um produto e tente fazer uma VENDA com quantidade maior que o estoque!
                    </p>
                </div>
            </div>

            {/* Formulário de Produto */}
            {showForm && (
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {editingProduto ? '✏️ Editar Produto' : '➕ Cadastrar Novo Produto'}
                        </h2>
                        <Form
                            endpoint={editingProduto ? `produtos/${editingProduto.id}` : 'produtos'}
                            method={editingProduto ? 'PUT' : 'POST'}
                            fields={produtoFields}
                            initialData={editingProduto || {}}
                            onSuccess={handleSuccess}
                        />
                    </div>
                </div>
            )}

            {/* Formulário de Estoque */}
            {showEstoque && selectedProduto && (
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            📦 Atualizar Estoque: {selectedProduto.nome}
                        </h2>
                        <div className="mb-4 p-4 bg-gray-50 rounded">
                            <p><strong>Estoque atual:</strong> {selectedProduto.estoque_atual} {selectedProduto.unidade_medida}</p>
                            <p><strong>Estoque mínimo:</strong> {selectedProduto.estoque_minimo} {selectedProduto.unidade_medida}</p>
                        </div>

                        <form onSubmit={handleEstoqueSubmit} className="max-w-md mx-auto">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantidade <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="quantidade"
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Operação <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="operacao"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Selecione a operação...</option>
                                    <option value="VENDA">🛒 VENDA (diminui estoque)</option>
                                    <option value="COMPRA">📦 COMPRA (aumenta estoque)</option>
                                    <option value="AJUSTE">⚖️ AJUSTE (define valor exato)</option>
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                                >
                                    Atualizar Estoque
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEstoque(false)}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">📋 Lista de Produtos</h2>
                    <p className="text-gray-600 text-sm">
                        Clique no botão 📦 para gerenciar estoque usando a procedure
                    </p>
                </div>
                <div className="p-6">
                    <CrudTable
                        endpoint="produtos"
                        columns={produtoColumns}
                        onEdit={handleEdit}
                        refresh={refresh}
                        customActions={(item) => (
                            <button
                                onClick={() => handleEstoque(item)}
                                className="text-orange-600 hover:text-orange-800 hover:bg-orange-50 px-2 py-1 rounded transition-colors ml-2"
                                title="Gerenciar Estoque"
                            >
                                📦
                            </button>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}