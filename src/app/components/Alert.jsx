export default function Alert({ type, message, onClose }) {
    if (!message) return null

    const styles = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700'
    }

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }

    return (
        <div className={`border px-4 py-3 rounded mb-4 ${styles[type] || styles.error}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-start">
                    <span className="mr-2">{icons[type] || icons.error}</span>
                    <span className="flex-1">{message}</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="ml-4 text-lg leading-none hover:opacity-70"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    )
}