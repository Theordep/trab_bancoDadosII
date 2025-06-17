import { query } from '@/app/lib/db'

export async function POST(request) {
    try {
        const {
            cliente_id, animal_id, funcionario_id, servico_id,
            data_agendamento, hora_inicio, hora_fim, valor, desconto = 0
        } = await request.json()

        // Validações básicas
        if (!cliente_id || !animal_id || !funcionario_id || !servico_id || !valor) {
            return Response.json({
                error: 'Todos os campos obrigatórios devem ser preenchidos'
            }, { status: 400 })
        }

        // Usa a function para calcular valor final
        const calcResult = await query(
            'SELECT calcular_valor_final($1, $2) as valor_final',
            [parseFloat(valor), parseFloat(desconto)]
        )

        if (!calcResult.success) {
            return Response.json({ error: calcResult.error }, { status: 400 })
        }

        const valorFinal = calcResult.data[0].valor_final

        // Verifica conflito de horário
        const conflictResult = await query(`
      SELECT COUNT(*) as conflitos
      FROM agendamentos 
      WHERE funcionario_id = $1 
        AND data_agendamento = $2
        AND status NOT IN ('CANCELADO')
        AND (
          (hora_inicio <= $3 AND hora_fim > $3) OR
          (hora_inicio < $4 AND hora_fim >= $4) OR
          (hora_inicio >= $3 AND hora_fim <= $4)
        )
    `, [funcionario_id, data_agendamento, hora_inicio, hora_fim])

        if (conflictResult.success && conflictResult.data[0].conflitos > 0) {
            return Response.json({
                error: 'Horário já ocupado para este funcionário'
            }, { status: 400 })
        }

        // Insere o agendamento
        const result = await query(`
      INSERT INTO agendamentos (
        cliente_id, animal_id, funcionario_id, servico_id,
        data_agendamento, hora_inicio, hora_fim, valor, desconto, valor_final
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [cliente_id, animal_id, funcionario_id, servico_id,
            data_agendamento, hora_inicio, hora_fim, valor, desconto, valorFinal])

        return Response.json(result.success ?
            { message: 'Agendamento criado com sucesso!', id: result.data[0].id } :
            { error: result.error },
            { status: result.success ? 200 : 400 }
        )
    } catch (error) {
        return Response.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const result = await query(`
      SELECT a.id, a.data_agendamento, a.hora_inicio, a.hora_fim, 
             a.status, a.valor, a.desconto, a.valor_final, a.observacoes,
             c.nome as cliente_nome, c.telefone as cliente_telefone,
             an.nome as animal_nome, e.nome as especie,
             f.nome as funcionario_nome, f.cargo,
             s.nome as servico_nome, cs.nome as categoria_servico
      FROM agendamentos a
      JOIN clientes c ON c.id = a.cliente_id
      JOIN animais an ON an.id = a.animal_id
      JOIN especies e ON e.id = an.especie_id
      JOIN funcionarios f ON f.id = a.funcionario_id
      JOIN servicos s ON s.id = a.servico_id
      JOIN categorias_servicos cs ON cs.id = s.categoria_id
      WHERE a.status != 'CANCELADO'
      ORDER BY a.data_agendamento DESC, a.hora_inicio
    `)

        return Response.json(result.success ? result.data : [])
    } catch (error) {
        return Response.json({ error: 'Erro ao buscar agendamentos' }, { status: 500 })
    }
}