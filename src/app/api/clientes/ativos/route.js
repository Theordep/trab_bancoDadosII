import { query } from '@/app/lib/db'

export async function GET() {
    try {
        const result = await query(`
      SELECT id, nome, cpf, celular
      FROM clientes 
      WHERE ativo = true 
      ORDER BY nome ASC
    `)

        return Response.json(result.success ? result.data : [])
    } catch (error) {
        return Response.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
    }
}