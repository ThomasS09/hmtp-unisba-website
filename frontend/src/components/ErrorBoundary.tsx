import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  sectionName?: string
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[ErrorBoundary - ${this.props.sectionName || 'Root'}]`, error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-6 m-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center font-inter">
          <div className="text-3xl mb-2">⚠️</div>
          <h3 className="text-lg font-bold text-red-400 font-poppins">
            Terjadi Kesalahan pada Bagian {this.props.sectionName || 'ini'}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            {this.state.error?.message || 'Gagal memuat komponen. Silakan coba lagi.'}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-black font-semibold text-xs hover:bg-yellow-400 transition-colors cursor-pointer"
          >
            Coba Muat Ulang
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
