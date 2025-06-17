import { query } from '@/app/lib/db'

export async function PUT(request, { params }) {
    try {
        const { quantidade, operacao } = await request.json()

        // Validações
        if (!quantidade || quantidade <= 0) {
            return Response.json({
                error: 'Quantidade deve ser maior que zero'
            }, { status: 400 })
        }

        if (!['VENDA', 'COMPRA', 'AJUSTE'].includes(operacao)) {
            return Response.json({
                error: 'Operação deve ser VENDA, COMPRA ou AJUSTE'
            }, { status: 400 })
        }

        // Chama a procedure
        const result = await query(
            'CALL atualizar_estoque_produto($1, $2, $3)',
            [parseInt(params.id), parseInt(quantidade), operacao]
        )

        if (!result.success) {
            return Response.json({
                error: result.error
            }, { status: 400 })
        }

        return Response.json({
            message: `Estoque atualizado! Operação: ${operacao}`
        })
    } catch (error) {
        return Response.json({ error: 'Erro interno do servidor' }, { status: 500 })
    }
}