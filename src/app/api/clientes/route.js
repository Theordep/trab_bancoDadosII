import { query } from '@/app/lib/db'

export async function POST(request) {
    try {
        const { nome, cpf, email, celular, cidade_id } = await request.json()

        // Validações básicas
        if (!nome || !celular) {
            return Response.json({
                error: 'Nome e celular são obrigatórios'
            }, { status: 400 })
        }

        const result = await query(
            'CALL inserir_cliente($1, $2, $3, $4, $5)',
            [nome, cpf, email, celular, cidade_id]
        )

        if (!result.success) {
            return Response.json({
                error: result.error
            }, { status: 400 })
        }

        return Response.json({
            message: 'Cliente inserido com sucesso!'
        })

    } catch (error) {
        return Response.json({
            error: 'Erro interno do servidor'
        }, { status: 500 })
    }
}

export async function GET() {
    try {
        const result = await query(`
      SELECT c.id, c.nome, c.cpf, c.email, c.celular, 
             c.telefone, c.endereco, c.bairro, c.cep,
             ci.nome as cidade, e.nome as estado
      FROM clientes c
      LEFT JOIN cidades ci ON ci.id = c.cidade_id
      LEFT JOIN estados e ON e.id = ci.estado_id
      WHERE c.ativo = true 
      ORDER BY c.nome
    `)

        return Response.json(result.success ? result.data : [])
    } catch (error) {
        return Response.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
    }
}