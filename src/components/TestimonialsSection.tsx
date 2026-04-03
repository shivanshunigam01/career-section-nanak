import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Patna, Bihar",
    rating: 5,
    text: "The VF 7 is a game changer. The safety features and range are incredible. Patliputra Auto made the entire buying experience seamless.",
    model: "VF 7 Owner",
  },
  {
    name: "Priya Singh",
    location: "Muzaffarpur, Bihar",
    rating: 5,
    text: "As a first-time EV buyer, I had many concerns. The team at Patliputra Auto addressed everything — from charging to finance. Absolutely love my VF 6!",
    model: "VF 6 Owner",
  },
  {
    name: "Amit Verma",
    location: "Patna, Bihar",
    rating: 5,
    text: "Premium quality at an unbeatable price. The exchange bonus and easy finance made it a no-brainer. Bihar's EV revolution starts here!",
    model: "VF 7 Owner",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 section-surface">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-primary font-display font-semibold text-sm uppercase tracking-[0.2em] mb-3">
            Customer Stories
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl">
            Trusted by Bihar
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-sm p-6 lg:p-8 relative"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <p className="font-display font-semibold">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.model} · {t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
