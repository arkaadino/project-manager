const features = [
  { title: "Collaboration", desc: "Work seamlessly with your team in real-time." },
  { title: "Analytics", desc: "Visualize your data and insights effortlessly." },
  { title: "Automation", desc: "Save time by automating repetitive tasks." },
]

const Features = () => {
  return (
    <section className="py-20 bg-gray-50 text-gray-900 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
