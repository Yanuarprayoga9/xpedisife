
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import Login from './pages/Login'


const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>

        <Login/>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
      </QueryClientProvider>
    </>
  )
}

export default App
