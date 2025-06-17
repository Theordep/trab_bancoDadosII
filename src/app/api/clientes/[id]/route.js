import { query } from '@/app/lib/db'

export async function GET(request, { params }) {
    try {
        const result = await query(
            'SELECT * FROM clientes WHERE id = $1',
            [params.id]
        )

        if (!result.success || result.data.length === 0) {
            return Response.json({ error: 'Cliente não encontrado' }, { status: 404 })
        }

        return Response.json(result.data[0])
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const { nome, cpf, email, celular, telefone, endereco, bairro, cep, cidade_id } = await request.json()

        const result = await query(`
      UPDATE clientes 
      SET nome = $1, cpf = $2, email = $3, celular = $4, telefone = $5,
          endereco = $6, bairro = $7, cep = $8, cidade_id = $9, updated_at = NOW()
      WHERE id = $10
    `, [nome, cpf, email, celular, telefone, endereco, bairro, cep, cidade_id, params.id])

        return Response.json(result.success ?
            { message: 'Cliente atualizado com sucesso!' } :
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
            'UPDATE clientes SET ativo = false, updated_at = NOW() WHERE id = $1',
            [params.id]
        )

        return Response.json(result.success ?
            { message: 'Cliente removido com sucesso!' } :
            { error: result.error },
            { status: result.success ? 200 : 400 }
        )
    } catch (error) {
        return Response.json({ error: 'Erro interno' }, { status: 500 })
    }
}