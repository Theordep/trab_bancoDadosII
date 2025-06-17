import { query } from '@/app/lib/db'

export async function GET(request, { params }) {
    try {
        const result = await query(`
      SELECT a.*, c.nome as cliente_nome, e.nome as especie_nome, r.nome as raca_nome
      FROM animais a
      JOIN clientes c ON c.id = a.cliente_id
      JOIN especies e ON e.id = a.especie_id
      LEFT JOIN racas r ON r.id = a.raca_id
      WHERE a.id = $1
    `, [params.id])

        if (!result.success || result.data.length === 0) {
            return Response.json({ error: 'Animal não encontrado' }, { status: 404 })
        }

        return Response.json(result.data[0])
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const {
            nome, cliente_id, especie_id, raca_id, sexo, cor,
            data_nascimento, peso, castrado, microchip, observacoes, foto_url
        } = await request.json()

        // Chama a PROCEDURE atualizar_animal
        const result = await query(
            'CALL atualizar_animal($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
            [params.id, nome, cliente_id, especie_id, raca_id, sexo, cor,
                data_nascimento, peso, castrado, microchip, observacoes, foto_url]
        )

        if (!result.success) {
            return Response.json({
                error: result.error
            }, { status: 400 })
        }

        return Response.json({
            message: 'Animal atualizado com sucesso!'
        })

    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        // Chama a FUNCTION remover_animal
        const result = await query(
            'SELECT remover_animal($1) as resultado',
            [params.id]
        )

        if (!result.success) {
            return Response.json({
                error: result.error
            }, { status: 400 })
        }

        return Response.json({
            message: result.data[0].resultado
        })

    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}