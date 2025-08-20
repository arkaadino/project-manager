const testimonials = [
  { name: "Alice Johnson", role: "CEO, TechCorp", text: "This tool boosted our team's productivity tremendously!" },
  { name: "Mark Wilson", role: "Product Manager", text: "Intuitive and powerful. We love it!" },
  { name: "Sophia Lee", role: "Designer", text: "Saves me hours every week. Highly recommended." },
]

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-600 mb-4">"{t.text}"</p>
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-gray-500 text-sm">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
