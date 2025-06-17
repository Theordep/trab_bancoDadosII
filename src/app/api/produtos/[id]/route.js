import { query } from '@/app/lib/db'

export async function GET(request, { params }) {
    try {
        const result = await query('SELECT * FROM produtos WHERE id = $1', [params.id])

        if (!result.success || result.data.length === 0) {
            return Response.json({ error: 'Produto não encontrado' }, { status: 404 })
        }

        return Response.json(result.data[0])
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const {
            nome, categoria, marca, codigo_barras, preco_custo, preco_venda,
            estoque_minimo, unidade_medida, descricao
        } = await request.json()

        const result = await query(`
      UPDATE produtos 
      SET nome = $1, categoria = $2, marca = $3, codigo_barras = $4,
          preco_custo = $5, preco_venda = $6, estoque_minimo = $7,
          unidade_medida = $8, descricao = $9, updated_at = NOW()
      WHERE id = $10
    `, [nome, categoria, marca, codigo_barras, preco_custo, preco_venda,
            estoque_minimo, unidade_medida, descricao, params.id])

        return Response.json(result.success ?
            { message: 'Produto atualizado com sucesso!' } :
            { error: result.error },
            { status: result.success ? 200 : 400 }
        )
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const result = await query(
            'UPDATE produtos SET ativo = false, updated_at = NOW() WHERE id = $1',
            [params.id]
        )

        return Response.json(result.success ?
            { message: 'Produto removido com sucesso!' } :
            { error: result.error },
            { status: result.success ? 200 : 400 }
        )
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}