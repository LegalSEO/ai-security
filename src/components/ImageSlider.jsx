/**
 * Image Slider Component
 * Animated carousel for showcasing images
 */

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Main Image Slider Component
 */
export function ImageSlider({
  images,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className = '',
  aspectRatio = '16/9',
  rounded = true
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || images.length <= 1) return

    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, isHovered, goToNext, images.length])

  if (!images || images.length === 0) return null

  return (
    <div
      className={`relative overflow-hidden ${rounded ? 'rounded-2xl' : ''} ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full flex-shrink-0">
            <img
              src={image.src}
              alt={image.alt || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Optional overlay with caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-medium">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            style={{ opacity: isHovered ? 1 : 0 }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            style={{ opacity: isHovered ? 1 : 0 }}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Hero Image Slider - Full-width with text overlay
 */
export function HeroSlider({ images, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [images.length])

  if (!images || images.length === 0) return null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.alt || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-aegis-900/90 via-aegis-900/70 to-aegis-900/50" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10">
        {images[currentIndex]?.content}
      </div>

      {/* Progress Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group relative h-1 w-12 bg-white/20 rounded-full overflow-hidden"
            >
              <div
                className={`absolute inset-y-0 left-0 bg-shield-400 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-full' : 'w-0 group-hover:w-1/3'
                }`}
                style={index === currentIndex ? {
                  animation: 'progress 6s linear'
                } : {}}
              />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}

/**
 * Thumbnail Gallery Slider
 */
export function GallerySlider({ images, className = '' }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <div className={className}>
      {/* Main Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 border border-white/10">
        <img
          src={images[selectedIndex].src}
          alt={images[selectedIndex].alt || ''}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {images[selectedIndex].caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-sm">{images[selectedIndex].caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
              index === selectedIndex
                ? 'border-shield-400 ring-2 ring-shield-400/30'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt || ''}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Card-style Image Carousel (shows multiple at once)
 */
export function CardCarousel({ images, className = '' }) {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = 3 // Number of visible cards

  const canGoNext = startIndex + visibleCount < images.length
  const canGoPrev = startIndex > 0

  if (!images || images.length === 0) return null

  return (
    <div className={className}>
      <div className="relative">
        {/* Cards Container */}
        <div className="flex gap-6 overflow-hidden">
          {images.slice(startIndex, startIndex + visibleCount).map((image, index) => (
            <div
              key={startIndex + index}
              className="flex-1 min-w-0 group"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group-hover:border-shield-500/30 transition-all">
                <img
                  src={image.src}
                  alt={image.alt || ''}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        {images.length > visibleCount && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setStartIndex(Math.max(0, startIndex - 1))}
              disabled={!canGoPrev}
              className="p-2 bg-aegis-800 hover:bg-aegis-700 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setStartIndex(Math.min(images.length - visibleCount, startIndex + 1))}
              disabled={!canGoNext}
              className="p-2 bg-aegis-800 hover:bg-aegis-700 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageSlider
