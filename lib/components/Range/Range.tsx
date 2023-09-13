import { MouseEvent, TouchEvent, useRef, useState } from 'react';
import { RangeProps } from './types';

import styles from './Range.module.css';

const thumbWidth = 70;

export default function Range({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
}: RangeProps) {
  const [grabbing, setGrabbing] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const calculateValue = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    let newValue = Math.round(min + ((max - min) * percent) / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));
    return newValue;
  };

  const handleMouseDown = (
    e:
      | MouseEvent<HTMLDivElement, globalThis.MouseEvent>
      | TouchEvent<HTMLDivElement>
  ) => {
    let clientX;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    if (!clientX) return;

    const newValue = calculateValue(clientX);
    setGrabbing(true);
    onChange && onChange(newValue);

    const handleMouseMove = (
      e: globalThis.MouseEvent | globalThis.TouchEvent
    ) => {
      let newValue;

      if ('touches' in e) {
        newValue = calculateValue(e.touches[0].clientX);
      } else {
        newValue = calculateValue(e.clientX);
      }

      onChange && onChange(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      setGrabbing(false);
    };

    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const left = `calc(${((value - min) / (max - min)) * 100}% - ${
    thumbWidth / 2
  }px)`;
  const fillerRight = `calc(100% - ${left} - 70px)`;
  const cursor = grabbing ? 'grabbing' : 'grab';

  return (
    <div className={styles.range}>
      <div ref={trackRef} className={styles.track}>
        <div
          className={styles.thumb}
          style={{
            width: thumbWidth,
            left,
            cursor,
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3333 3.33334H7.33331L10.6666 8.00001L7.33331 12.6667H10.3333L13.6666 8.00001L10.3333 3.33334Z"
              fill="white"
            />
            <path
              d="M5.66669 3.33334H2.66669L6.00002 8.00001L2.66669 12.6667H5.66669L9.00002 8.00001L5.66669 3.33334Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          className={styles.filler}
          style={{
            right: fillerRight,
          }}
        />
        <span className={styles.disclaimer}>Drag to rotate until fit</span>
      </div>
    </div>
  );
}
