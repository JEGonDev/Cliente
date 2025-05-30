import React from "react"
import Footer from "./ui/layouts/Footer"
import { RouterApp } from "./routes/RouterApp"
import { Header } from "./ui/layouts/Header"

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-0 pb-0"> {/* Ajusta el padding según la altura del Header/Footer */}
        <RouterApp />
      </main>
      <Footer />
    </div>
  )
}
