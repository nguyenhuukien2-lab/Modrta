# Cinematic Components

Bộ components với hiệu ứng điện ảnh cao cấp cho Modtra website.

## Components

### 1. CinematicSection
Section wrapper với fade-in và parallax effects.

```tsx
import { CinematicSection } from '@/components/cinematic'

<CinematicSection 
  background="pattern"  // 'white' | 'gradient' | 'pattern' | 'none'
  parallaxSpeed={0.2}   // Tốc độ parallax (0 = disabled)
  fadeIn={true}         // Fade in khi scroll vào view
  delay={200}           // Delay trước khi fade in (ms)
>
  <YourContent />
</CinematicSection>
```

### 2. CinematicImage
Image với hover zoom và overlay effects.

```tsx
import { CinematicImage } from '@/components/cinematic'

<CinematicImage
  src="/path/to/image.jpg"
  alt="Description"
  aspectRatio="square"  // 'square' | '4/3' | '16/9' | '3/4'
  overlay={true}        // Hiển thị gradient overlay khi hover
  zoom={true}           // Zoom in khi hover
  rounded="2xl"         // Border radius
  shadow={true}         // Box shadow
/>
```

### 3. ScrollReveal
Wrapper để reveal elements khi scroll.

```tsx
import { ScrollReveal } from '@/components/cinematic'

<ScrollReveal delay={100}>
  <YourElement />
</ScrollReveal>
```

### 4. ParallaxSection
Section với parallax effect dựa trên scroll.

```tsx
import { ParallaxSection } from '@/components/cinematic'

<ParallaxSection speed={0.5}>
  <YourContent />
</ParallaxSection>
```

### 5. AnimatedBackground
Animated background patterns.

```tsx
import { AnimatedBackground } from '@/components/cinematic'

<div className="relative">
  <AnimatedBackground variant="orbs" /> {/* 'orbs' | 'grid' | 'gradient' | 'minimal' */}
  <YourContent />
</div>
```

### 6. SectionHeader
Header cho sections với animations.

```tsx
import { SectionHeader } from '@/components/cinematic'
import { Sparkles } from 'lucide-react'

<SectionHeader
  label="Featured Products"
  title={<>Our <span className="text-zen">Premium</span> Collection</>}
  description="Discover our handpicked selection of the finest products"
  align="center"  // 'left' | 'center' | 'right'
  icon={<Sparkles className="w-4 h-4" />}
/>
```

### 7. PageTransition
Smooth transitions giữa các pages.

```tsx
import { PageTransition } from '@/components/cinematic'

// Wrap your page content
<PageTransition>
  <YourPageContent />
</PageTransition>
```

### 8. LoadingTransition
Full-screen loading overlay.

```tsx
import { LoadingTransition } from '@/components/cinematic'

<LoadingTransition 
  isLoading={isLoading} 
  message="Đang tải sản phẩm..." 
/>
```

## CSS Classes có sẵn

### Animations
- `.animate-fade-in` - Fade in
- `.animate-fade-in-slow` - Fade in chậm
- `.animate-scale-in` - Scale in
- `.animate-slide-up/down/left/right` - Slide animations
- `.animate-float` - Floating animation
- `.camera-zoom` - Camera zoom effect
- `.camera-pan` - Camera pan effect

### Hover Effects
- `.img-hover-zoom` - Zoom image on hover
- `.glow` - Glow effect

### Utilities
- `.text-zen` - Zen typography style
- `.text-gradient` - Gradient text
- `.glass` - Glass morphism effect
- `.backdrop-blur-strong` - Strong backdrop blur
- `.stagger-children` - Staggered animations cho children

## Timing Curves

Custom easing curves available:
- `var(--ease-out-expo)` - Exponential ease out
- `var(--ease-in-out-quint)` - Quintic ease in/out
- `var(--ease-cinematic)` - Cinematic easing
- `var(--ease-smooth)` - Smooth transition

## Example Usage

```tsx
import { 
  CinematicSection, 
  SectionHeader, 
  CinematicImage,
  ScrollReveal 
} from '@/components/cinematic'

export default function ProductsPage() {
  return (
    <CinematicSection background="pattern" fadeIn>
      <SectionHeader
        label="Our Collection"
        title={<>Premium <span className="text-zen">Matcha</span> Selection</>}
        description="Carefully sourced from Uji, Kyoto"
      />
      
      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 100}>
            <CinematicImage
              src={product.image}
              alt={product.name}
              aspectRatio="4/3"
            />
          </ScrollReveal>
        ))}
      </div>
    </CinematicSection>
  )
}
```
