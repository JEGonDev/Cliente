<<<<<<< HEAD
import React from "react"
import Footer from "./ui/layouts/Footer"
=======
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
import { RouterApp } from "./routes/RouterApp"
import { Header } from "./ui/layouts/Header"

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-0 pb-0"> {/* Ajusta el padding según la altura del Header/Footer */}
        <RouterApp />
      </main>
    </div>
  )
}
