import { useState } from "react";
import { faqItems } from "../data/faq";

export function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      id="faq"
      className="py-24 lg:py-32 bg-warm-ivory border-t border-foreground/5"
    >
      <div className="mx-auto max-w-3xl px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest text-lavender-elegant/70 mb-4 uppercase font-medium">
            FAQ
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-lavender-elegant font-light">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-light-cream rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-medium text-lavender-elegant hover:text-lavender-elegant/80 transition-colors"
                >
                  <span>{item.question}</span>
                  <span
                    className="ml-4 shrink-0 text-lavender-elegant text-xl"
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div id={`faq-answer-${item.id}`} className="px-6 pb-5">
                    <p className="text-foreground/70 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
