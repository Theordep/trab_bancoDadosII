import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Teste de conexão
pool.on('connect', () => {
    console.log('✅ Conectado ao PostgreSQL')
})

pool.on('error', (err) => {
    console.error('❌ Erro na conexão PostgreSQL:', err)
})

export async function query(text, params) {
    const start = Date.now()
    try {
        const result = await pool.query(text, params)
        const duration = Date.now() - start
        console.log(`✅ Query executada em ${duration}ms:`, text.substring(0, 100))
        return {
            success: true,
            data: result.rows,
            rowCount: result.rowCount
        }
    } catch (error) {
        console.error('❌ Erro na query:', error)
        return {
            success: false,
            error: error.message,
            code: error.code,
            constraint: error.constraint,
            detail: error.detail
        }
    }
}

export default pool