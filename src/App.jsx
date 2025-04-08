import { Header } from "./ui/layouts/Header"


import Footer from "./ui/layouts/Footer"
import { RouterApp } from "./routes/RouterApp"

export const App = () => {
  return (
    <div>
      <Header />
      <RouterApp />
      <Footer />

    </div>
  )
}
