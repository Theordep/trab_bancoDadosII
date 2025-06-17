import { query } from '@/app/lib/db'

export async function GET() {
    try {
        // Executa as 3 views em paralelo
        const [agendamentos, estoqueBaixo, historico, estatisticas] = await Promise.all([
            // View 1: Agendamentos de hoje
            query('SELECT * FROM vw_agendamentos_detalhados WHERE data_agendamento = CURRENT_DATE ORDER BY hora_inicio'),

            // View 2: Produtos com estoque baixo
            query('SELECT * FROM vw_produtos_estoque_baixo ORDER BY nivel_alerta DESC, estoque_diario ASC'),

            // View 3: Últimos atendimentos
            query('SELECT * FROM vw_historico_medico_completo ORDER BY data_atendimento DESC LIMIT 10'),

            // Estatísticas gerais
            query(`
        SELECT 
          (SELECT COUNT(*) FROM clientes WHERE ativo = true) as total_clientes,
          (SELECT COUNT(*) FROM animais WHERE ativo = true) as total_animais,
          (SELECT COUNT(*) FROM agendamentos WHERE data_agendamento = CURRENT_DATE AND status != 'CANCELADO') as agendamentos_hoje,
          (SELECT COUNT(*) FROM produtos WHERE ativo = true) as total_produtos,
          (SELECT COUNT(*) FROM produtos WHERE estoque_atual <= estoque_minimo AND ativo = true) as produtos_estoque_baixo
      `)
        ])

        return Response.json({
            agendamentosHoje: agendamentos.data || [],
            alertasEstoque: estoqueBaixo.data || [],
            ultimosAtendimentos: historico.data || [],
            estatisticas: estatisticas.data?.[0] || {},
            timestamp: new Date().toISOString(),
            views_utilizadas: [
                'vw_agendamentos_detalhados',
                'vw_produtos_estoque_baixo',
                'vw_historico_medico_completo'
            ]
        })
    } catch (error) {
        console.error('Erro no dashboard:', error)
        return Response.json({
            error: 'Erro ao carregar dashboard',
            details: error.message
        }, { status: 500 })
    }
}