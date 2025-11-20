import UploadPDF from './UploadPDF'
import './App.css'

function App() {
  return (
    <div className="min-h-screen p-10 bg-gray-50 font-sans">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-700">
        💸 CashClarity
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Upload your PDF bank statement to automatically extract and analyze your transactions using AI.
      </p>
      
      <div className="flex justify-center">
        <UploadPDF />
      </div>
    </div>
  )
}

export default App
