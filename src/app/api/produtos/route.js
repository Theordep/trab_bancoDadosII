import { query } from '@/app/lib/db'

export async function POST(request) {
    try {
        const {
            nome, categoria, marca, codigo_barras, preco_custo, preco_venda,
            estoque_inicial = 0, estoque_minimo = 0, unidade_medida = 'UN', descricao
        } = await request.json()

        // Validações básicas
        if (!nome || !preco_venda) {
            return Response.json({
                error: 'Nome e preço de venda são obrigatórios'
            }, { status: 400 })
        }

        if (preco_venda <= 0) {
            return Response.json({
                error: 'Preço de venda deve ser maior que zero'
            }, { status: 400 })
        }

        const result = await query(`
      INSERT INTO produtos (
        nome, categoria, marca, codigo_barras, preco_custo, preco_venda,
        estoque_atual, estoque_minimo, unidade_medida, descricao
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [nome, categoria, marca, codigo_barras, preco_custo, preco_venda,
            estoque_inicial, estoque_minimo, unidade_medida, descricao])

        return Response.json(result.success ?
            { message: 'Produto criado com sucesso!', id: result.data[0].id } :
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
      SELECT id, nome, categoria, marca, codigo_barras, 
             preco_custo, preco_venda, estoque_atual, estoque_minimo, 
             unidade_medida, descricao, ativo, created_at
      FROM produtos 
      WHERE ativo = true 
      ORDER BY nome
    `)

        return Response.json(result.success ? result.data : [])
    } catch (error) {
        return Response.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
    }
}