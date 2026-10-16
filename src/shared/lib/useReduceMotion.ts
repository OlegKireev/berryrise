import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Системное "уменьшить движение". null - еще не знаем
export function useReduceMotion() {
  const [reduce, setReduce] = useState<boolean | null>(null);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduce,
    );
    return () => sub.remove();
  }, []);
  return reduce;
}
