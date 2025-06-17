'use client'
import { useState } from 'react'
import FormMelhorado from '../components/FormMelhorado'
import CrudTable from '../components/CrudTable'

const animalFields = [
    {
        name: 'nome',
        label: 'Nome do Animal',
        required: true,
        help: 'Nome pelo qual o animal é conhecido'
    },
    {
        name: 'cliente_id',
        label: 'Cliente (Proprietário)',
        type: 'dynamic_select',
        endpoint: 'clientes/ativos',
        required: true,
        placeholder: 'Selecione o proprietário...',
        formatOption: (cliente) => `${cliente.nome} ${cliente.cpf ? `(${cliente.cpf})` : ''} - ${cliente.celular}`,
        help: 'Proprietário responsável pelo animal'
    },
    {
        name: 'especie_id',
        label: 'Espécie',
        type: 'dynamic_select',
        endpoint: 'especies',
        required: true,
        placeholder: 'Selecione a espécie...',
        formatOption: (especie) => especie.nome,
        help: 'Espécie do animal (necessário para filtrar raças)'
    },
    {
        name: 'raca_id',
        label: 'Raça (Opcional)',
        type: 'dynamic_select',
        endpoint: 'racas',
        placeholder: 'Primeiro selecione a espécie...',
        dependsOn: { especie_id: 'especie_id' },
        formatOption: (raca) => `${raca.nome}${raca.porte ? ` (${raca.porte})` : ''}`,
        help: 'Raça específica - carrega automaticamente após selecionar espécie'
    },
    {
        name: 'sexo',
        label: 'Sexo',
        type: 'select',
        options: [
            { value: 'M', label: '♂️ Macho' },
            { value: 'F', label: '♀️ Fêmea' }
        ],
        help: 'Sexo biológico do animal'
    },
    {
        name: 'cor',
        label: 'Cor/Pelagem',
        help: 'Cor predominante ou padrão da pelagem'
    },
    {
        name: 'data_nascimento',
        label: 'Data de Nascimento',
        type: 'date',
        help: 'Data de nascimento (para calcular idade automaticamente)'
    },
    {
        name: 'peso',
        label: 'Peso (kg)',
        type: 'number',
        min: 0.1,
        max: 999.99,
        help: 'Peso atual em quilogramas'
    },
    {
        name: 'castrado',
        label: 'Status de Castração',
        type: 'select',
        options: [
            { value: 'false', label: '❌ Não castrado' },
            { value: 'true', label: '✅ Castrado' }
        ],
        help: 'Status de castração do animal'
    },
    {
        name: 'microchip',
        label: 'Número do Microchip',
        help: 'Número único do microchip (deve ser único no sistema)'
    },
    {
        name: 'observacoes',
        label: 'Observações',
        type: 'textarea',
        help: 'Informações adicionais sobre o animal'
    },
    {
        name: 'foto_url',
        label: 'URL da Foto',
        help: 'Link para foto do animal (opcional)'
    }
]

const animalColumns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'cliente_nome', label: 'Proprietário' },
    { key: 'especie_nome', label: 'Espécie' },
    { key: 'raca_nome', label: 'Raça' },
    { key: 'sexo', label: 'Sexo', format: (value) => value === 'M' ? '♂️ Macho' : value === 'F' ? '♀️ Fêmea' : '-' },
    { key: 'idade_anos', label: 'Idade', format: (value) => value ? `${value} anos` : '-' },
    { key: 'peso', label: 'Peso', format: (value) => value ? `${value} kg` : '-' },
    { key: 'castrado', label: 'Castrado', format: (value) => value ? '✅ Sim' : '❌ Não' }
]

export default function AnimaisPage() {
    const [editingAnimal, setEditingAnimal] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [refresh, setRefresh] = useState(0)

    const handleSuccess = () => {
        setShowForm(false)
        setEditingAnimal(null)
        setRefresh(prev => prev + 1)
    }

    const handleEdit = (animal) => {
        const formatted = {
            ...animal,
            data_nascimento: animal.data_nascimento ?
                new Date(animal.data_nascimento).toISOString().split('T')[0] : '',
            castrado: animal.castrado ? 'true' : 'false',
            // Garantir que IDs sejam strings para os selects
            cliente_id: String(animal.cliente_id || ''),
            especie_id: String(animal.especie_id || ''),
            raca_id: String(animal.raca_id || '')
        }

        console.log('Editando animal:', formatted) // Debug
        setEditingAnimal(formatted)
        setShowForm(true)
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🐾 Gestão de Animais</h1>
                    <p className="text-gray-600">Interface corrigida com selects dinâmicos funcionais</p>
                </div>
                <button
                    onClick={() => {
                        setEditingAnimal(null)
                        setShowForm(!showForm)
                    }}
                    className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                    {showForm ? '❌ Cancelar' : '🐾 Novo Animal'}
                </button>
            </div>

            {/* Info sobre as correções */}
            {/* <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-green-800 mb-3">🔧 Correções Aplicadas:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong className="text-green-700">✅ Select de Raça Corrigido:</strong>
                        <p className="text-green-600">
                            • Dependência espécie → raça funcional<br />
                            • Reset automático quando muda espécie<br />
                            • Loading state enquanto carrega
                        </p>
                    </div>
                    <div>
                        <strong className="text-green-700">✅ Tratamento de Dados:</strong>
                        <p className="text-green-600">
                            • Conversão automática de tipos<br />
                            • IDs como integers no backend<br />
                            • Valores booleanos tratados corretamente
                        </p>
                    </div>
                    <div>
                        <strong className="text-green-700">✅ Debug Melhorado:</strong>
                        <p className="text-green-600">
                            • Console logs para troubleshooting<br />
                            • Feedback visual para dependências<br />
                            • Mensagens de estado claras
                        </p>
                    </div>
                    <div>
                        <strong className="text-green-700">✅ Edição Funcional:</strong>
                        <p className="text-green-600">
                            • Dados carregados corretamente<br />
                            • Selects mantêm valores ao editar<br />
                            • Raça carrega baseada na espécie
                        </p>
                    </div>
                </div>
            </div> */}

            {/* Formulário */}
            {showForm && (
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {editingAnimal ? '✏️ Editar Animal' : '🐾 Cadastrar Novo Animal'}
                        </h2>

                        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                            <h4 className="font-semibold text-blue-800 mb-2">📋 Como usar:</h4>
                            <div className="text-sm text-blue-700">
                                <p>1. Selecione o <strong>proprietário</strong> na lista</p>
                                <p>2. Escolha a <strong>espécie</strong> do animal</p>
                                <p>3. Após selecionar a espécie, as <strong>raças</strong> serão carregadas automaticamente</p>
                                <p>4. Preencha os demais campos conforme necessário</p>
                            </div>
                        </div>

                        <FormMelhorado
                            endpoint={editingAnimal ? `animais/${editingAnimal.id}` : 'animais'}
                            method={editingAnimal ? 'PUT' : 'POST'}
                            fields={animalFields}
                            initialData={editingAnimal || {}}
                            onSuccess={handleSuccess}
                        />
                    </div>
                </div>
            )}

            {/* Tabela */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">📋 Lista de Animais</h2>
                    <p className="text-gray-600 text-sm">
                        Ordenados por data de cadastro (mais recentes primeiro)
                    </p>
                </div>
                <div className="p-6">
                    <CrudTable
                        endpoint="animais"
                        columns={animalColumns}
                        onEdit={handleEdit}
                        refresh={refresh}
                        customActions={(item) => (
                            <div className="flex items-center space-x-2">
                                {item.foto_url && (
                                    <button
                                        onClick={() => window.open(item.foto_url, '_blank')}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                        title="Ver Foto"
                                    >
                                        📷
                                    </button>
                                )}
                                {item.microchip && (
                                    <span
                                        className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded"
                                        title={`Microchip: ${item.microchip}`}
                                    >
                                        🔹 Chip
                                    </span>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}