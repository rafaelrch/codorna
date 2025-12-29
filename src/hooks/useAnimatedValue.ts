import { useState, useEffect, useRef } from 'react';

interface UseAnimatedValueOptions {
  duration?: number; // Duração em milissegundos
  startDelay?: number; // Delay antes de começar a animação
}

export function useAnimatedValue(
  targetValue: number,
  options: UseAnimatedValueOptions = {}
): number {
  const { duration = 800, startDelay = 0 } = options;
  const [animatedValue, setAnimatedValue] = useState(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef(0);

  useEffect(() => {
    // Reset quando o valor alvo mudar
    setAnimatedValue(0);
    startValueRef.current = 0;

    const startAnimation = () => {
      startTimeRef.current = Date.now();

      const animate = () => {
        if (!startTimeRef.current) return;

        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = startValueRef.current + (targetValue - startValueRef.current) * easeOut;
        setAnimatedValue(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setAnimatedValue(targetValue);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration, startDelay]);

  return animatedValue;
}









