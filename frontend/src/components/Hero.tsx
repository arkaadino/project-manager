const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl font-bold mb-4">Transform Your Workflow</h1>
      <p className="text-xl mb-8 max-w-xl">Sleek and modern solutions for your team productivity and collaboration.</p>
      <div className="flex gap-4">
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">Get Started</button>
        <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition">Learn More</button>
      </div>
    </section>
  )
}

export default Hero
