import { query } from '@/app/lib/db'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const especieId = searchParams.get('especie_id')

        console.log('API Raças - especie_id recebido:', especieId) // Debug

        let queryText = `
      SELECT r.id, r.nome, r.porte, e.nome as especie_nome
      FROM racas r
      JOIN especies e ON e.id = r.especie_id
      WHERE r.ativo = true
    `
        let params = []

        if (especieId && especieId !== 'undefined' && especieId !== 'null') {
            queryText += ' AND r.especie_id = $1'
            params.push(parseInt(especieId))
        }

        queryText += ' ORDER BY r.nome ASC'

        console.log('Query final:', queryText, 'Params:', params) // Debug

        const result = await query(queryText, params)

        console.log('Resultado raças:', result.data?.length || 0, 'raças encontradas') // Debug

        return Response.json(result.success ? result.data : [])
    } catch (error) {
        console.error('Erro na API de raças:', error)
        return Response.json({ error: 'Erro ao buscar raças' }, { status: 500 })
    }
}