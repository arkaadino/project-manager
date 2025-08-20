const stats = [
  { value: "500+", label: "Companies" },
  { value: "120K", label: "Users" },
  { value: "1M+", label: "Tasks Completed" },
]

const Stats = () => {
  return (
    <section className="py-20 bg-white text-gray-900 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
