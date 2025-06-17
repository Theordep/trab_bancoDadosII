import Link from 'next/link'

export default function HomePage() {
  const modules = [
    {
      href: '/dashboard',
      title: 'Dashboard',
      icon: '📊',
      description: 'Views e relatórios em tempo real',
      color: 'bg-blue-500 hover:bg-blue-600',
      features: ['vw_agendamentos_detalhados', 'vw_produtos_estoque_baixo', 'vw_historico_medico_completo']
    },
    {
      href: '/clientes',
      title: 'Clientes',
      icon: '👥',
      description: 'CRUD com Stored Procedures',
      color: 'bg-green-500 hover:bg-green-600',
      features: ['inserir_cliente()', 'Validações de negócio', 'Exception handling']
    },
    {
      href: '/agendamentos',
      title: 'Agendamentos',
      icon: '📅',
      description: 'Functions e cálculos automáticos',
      color: 'bg-purple-500 hover:bg-purple-600',
      features: ['calcular_valor_final()', 'Validação de horários', 'Status control']
    },
    {
      href: '/produtos',
      title: 'Produtos',
      icon: '📦',
      description: 'Controle de estoque com procedures',
      color: 'bg-orange-500 hover:bg-orange-600',
      features: ['atualizar_estoque_produto()', 'VENDA/COMPRA/AJUSTE', 'Alertas de estoque']
    }
  ]

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          🐾 Sistema Veterinária
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Demonstração completa de <strong>Banco de Dados II</strong>
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🎯 Recursos Implementados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-semibold text-blue-700">✅ Stored Procedures</div>
              <div className="text-blue-600">inserir_cliente, atualizar_estoque</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="font-semibold text-green-700">✅ Functions</div>
              <div className="text-green-600">calcular_valor_final</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="font-semibold text-purple-700">✅ Views</div>
              <div className="text-purple-600">3 views complexas</div>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <div className="font-semibold text-red-700">✅ Exception Handling</div>
              <div className="text-red-600">RAISE EXCEPTION tratados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
        {modules.map(module => (
          <Link key={module.href} href={module.href}>
            <div className={`${module.color} text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}>
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{module.icon}</div>
                <h3 className="text-2xl font-bold">{module.title}</h3>
                <p className="text-lg opacity-90">{module.description}</p>
              </div>

              <div className="bg-white bg-opacity-20 rounded p-4">
                <div className="text-sm font-semibold mb-2">Recursos:</div>
                <ul className="text-sm space-y-1">
                  {module.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2">•</span>
                      <code className="bg-white bg-opacity-25 px-1 rounded">{feature}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🚀 Como usar este sistema
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3 text-blue-600">🔧 Para demonstrar Procedures:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Vá em <strong>Clientes</strong></li>
              <li>• Tente cadastrar com CPF duplicado</li>
              <li>• Veja o RAISE EXCEPTION sendo capturado</li>
              <li>• Cadastre um cliente válido</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-purple-600">🧮 Para demonstrar Functions:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Vá em <strong>Agendamentos</strong></li>
              <li>• Crie um agendamento com desconto</li>
              <li>• Veja a function calculando valor final</li>
              <li>• Teste desconto maior que valor</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-orange-600">📦 Para demonstrar Estoque:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Vá em <strong>Produtos</strong></li>
              <li>• Cadastre um produto com estoque</li>
              <li>• Tente vender mais que disponível</li>
              <li>• Veja a procedure validando</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 text-green-600">📊 Para demonstrar Views:</h3>
            <ul className="space-y-2 text-sm">
              <li>• Vá no <strong>Dashboard</strong></li>
              <li>• Veja as 3 views carregando</li>
              <li>• Produtos com estoque baixo</li>
              <li>• Agendamentos detalhados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}