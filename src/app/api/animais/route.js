import { query } from '@/app/lib/db'

export async function POST(request) {
    try {
        const {
            nome, cliente_id, especie_id, raca_id, sexo, cor,
            data_nascimento, peso, castrado, microchip, observacoes, foto_url
        } = await request.json()

        // Chama a PROCEDURE inserir_animal
        const result = await query(
            'CALL inserir_animal($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
            [nome, cliente_id, especie_id, raca_id, sexo, cor,
                data_nascimento, peso, castrado || false, microchip, observacoes, foto_url]
        )

        if (!result.success) {
            return Response.json({
                error: result.error
            }, { status: 400 })
        }

        return Response.json({
            message: 'Animal cadastrado com sucesso!'
        })

    } catch (error) {
        return Response.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}

export async function GET() {
    try {
        // Chama a FUNCTION obter_animais_detalhado
        const result = await query('SELECT * FROM obter_animais_detalhado()')

        return Response.json(result.success ? result.data : [])
    } catch (error) {
        return Response.json({ error: 'Erro ao buscar animais' }, { status: 500 })
    }
}