"use client"

import { Star, Quote } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export function TestimonialsSection() {
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'

  const testimonials = [
    {
      quote: t("testimonials.testimonial1.quote"),
      author: t("testimonials.testimonial1.author"),
      role: t("testimonials.testimonial1.role"),
      location: t("testimonials.testimonial1.location"),
      avatar: "MT",
      featured: true,
    },
    {
      quote: t("testimonials.testimonial2.quote"),
      author: t("testimonials.testimonial2.author"),
      role: t("testimonials.testimonial2.role"),
      location: t("testimonials.testimonial2.location"),
      avatar: "CR",
      featured: false,
    },
    {
      quote: t("testimonials.testimonial3.quote"),
      author: t("testimonials.testimonial3.author"),
      role: t("testimonials.testimonial3.role"),
      location: t("testimonials.testimonial3.location"),
      avatar: "JM",
      featured: false,
    },
    {
      quote: t("testimonials.testimonial4.quote"),
      author: t("testimonials.testimonial4.author"),
      role: t("testimonials.testimonial4.role"),
      location: t("testimonials.testimonial4.location"),
      avatar: "DW",
      featured: false,
    },
    {
      quote: t("testimonials.testimonial5.quote"),
      author: t("testimonials.testimonial5.author"),
      role: t("testimonials.testimonial5.role"),
      location: t("testimonials.testimonial5.location"),
      avatar: "MC",
      featured: false,
    },
    {
      quote: t("testimonials.testimonial6.quote"),
      author: t("testimonials.testimonial6.author"),
      role: t("testimonials.testimonial6.role"),
      location: t("testimonials.testimonial6.location"),
      avatar: "AJ",
      featured: false,
    },
  ]

  return (
    <section id="testimonials" className="relative py-24 md:py-32" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-4">
            {t("testimonials.sectionLabel")}
          </p>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance ${isHebrew ? 'font-hebrew-display' : ''}`}>
            {t("testimonials.sectionTitle")}
            <span className="text-gradient"> {t("testimonials.sectionTitleHighlight")}</span> {t("testimonials.sectionTitleEnd")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("testimonials.sectionSubtitle")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-500 group relative ${
                testimonial.featured ? 'md:col-span-2 lg:col-span-1 border-primary/20' : ''
              }`}
            >
              {/* Quote icon */}
              <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Quote className="w-12 h-12 text-primary" />
              </div>

              {/* Stars */}
              <div className={`flex gap-1 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground/70">{testimonial.location}</p>
                </div>
              </div>

              {/* Featured badge */}
              {testimonial.featured && (
                <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/30">
                    {t("testimonials.featured")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
