const testimonials = [
  {
    id: 1,
    content: "The quality of products is outstanding. I've been using GLIDEON supplements for 6 months and the results speak for themselves. Fast shipping and excellent customer service!",
    name: "Mike Johnson",
    title: "Fitness Enthusiast",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: 2,
    content: "Amazing equipment quality! The adjustable dumbbells are perfect for my home gym. Great investment and the customer support team is incredibly helpful.",
    name: "Sarah Davis",
    title: "Personal Trainer",
    image: "https://pixabay.com/get/g99eb1039ac4a01a7b200027e167bab6269ac19eea8a6603a94ace39c16b97e1eb7547374b55212ff88c7d4698f7e7315c2407eea26ab7e1cf878878f86c092d0_1280.jpg"
  },
  {
    id: 3,
    content: "Fast delivery, great packaging, and products that actually work. GLIDEON has become my go-to store for all fitness needs. Highly recommended!",
    name: "Alex Rodriguez",
    title: "Bodybuilder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="testimonials-title">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300" data-testid="testimonials-description">
            Join thousands of satisfied customers who trust GLIDEON
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              data-testid={`testimonial-${testimonial.id}`}
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic" data-testid={`testimonial-content-${testimonial.id}`}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  data-testid={`testimonial-image-${testimonial.id}`}
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white" data-testid={`testimonial-name-${testimonial.id}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm" data-testid={`testimonial-title-${testimonial.id}`}>
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
