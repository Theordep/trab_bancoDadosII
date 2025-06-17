import { query } from '@/app/lib/db'

export async function GET(request, { params }) {
    try {
        const result = await query(`
      SELECT a.*, c.nome as cliente_nome, an.nome as animal_nome,
             f.nome as funcionario_nome, s.nome as servico_nome
      FROM agendamentos a
      JOIN clientes c ON c.id = a.cliente_id
      JOIN animais an ON an.id = a.animal_id
      JOIN funcionarios f ON f.id = a.funcionario_id
      JOIN servicos s ON s.id = a.servico_id
      WHERE a.id = $1
    `, [params.id])

        if (!result.success || result.data.length === 0) {
            return Response.json({ error: 'Agendamento não encontrado' }, { status: 404 })
        }

        return Response.json(result.data[0])
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const {
            data_agendamento, hora_inicio, hora_fim, valor, desconto = 0,
            status = 'AGENDADO', observacoes
        } = await request.json()

        // Recalcula valor final se valor ou desconto mudaram
        const calcResult = await query(
            'SELECT calcular_valor_final($1, $2) as valor_final',
            [parseFloat(valor), parseFloat(desconto)]
        )

        if (!calcResult.success) {
            return Response.json({ error: calcResult.error }, { status: 400 })
        }

        const valorFinal = calcResult.data[0].valor_final

        const result = await query(`
      UPDATE agendamentos 
      SET data_agendamento = $1, hora_inicio = $2, hora_fim = $3, 
          valor = $4, desconto = $5, valor_final = $6, status = $7, 
          observacoes = $8, updated_at = NOW()
      WHERE id = $9
    `, [data_agendamento, hora_inicio, hora_fim, valor, desconto, valorFinal, status, observacoes, params.id])

        return Response.json(result.success ?
            { message: 'Agendamento atualizado com sucesso!' } :
            { error: result.error },
            { status: result.success ? 200 : 400 }
        )
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const { motivo_cancelamento } = await request.json()

        const result = await query(`
      UPDATE agendamentos 
      SET status = 'CANCELADO', motivo_cancelamento = $1, updated_at = NOW() 
      WHERE id = $2
    `, [motivo_cancelamento || 'Cancelado pelo usuário', params.id])

        return Response.json(result.success ?
            { message: 'Agendamento cancelado com sucesso!' } :
            { error: result.error },
            { status: result.success ? 200 : 400 }
        )
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}